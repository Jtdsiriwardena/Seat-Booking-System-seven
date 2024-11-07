import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import './InternAttendance.css';
import logo from './images/logo.png';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faPlusCircle, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const InternAttendance = () => {
    const [interns, setInterns] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState('');
    const [monthlyAttendance, setMonthlyAttendance] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/interns`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInterns(response.data);
            } catch (error) {
                console.error('Error fetching interns:', error);
            }
        };
        fetchInterns();
    }, [token]);

    const fetchAttendance = async (internId, startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/intern/${internId}`, {
                params: { startDate, endDate }, 
                headers: { Authorization: `Bearer ${token}` },
            });
            const attendanceData = response.data;

            const groupedByMonth = attendanceData.reduce((acc, record) => {
                const month = moment(record.date).format('MMMM YYYY');
                if (!acc[month]) acc[month] = [];
                acc[month].push(record);
                return acc;
            }, {});

            setMonthlyAttendance(groupedByMonth);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const handleInternChange = (event) => {
        const internId = event.target.value;
        setSelectedIntern(internId);
        if (internId && startDate && endDate) {
            fetchAttendance(internId, startDate, endDate);
        }
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        if (selectedIntern && startDate && endDate) {
            fetchAttendance(selectedIntern, startDate, endDate);
        }
    };


    const addPDFHeader = (doc, internName) => {
        const img = new Image();
        img.src = logo;
        doc.addImage(img, 'PNG', 5, 5, 40, 20);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text('Intern Attendance Report', 105, 40, null, null, 'center');
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Intern: ${internName}`, 105, 50, null, null, 'center');
    };

   
    const addAttendanceDataToPDF = (doc) => {
        let startY = 70;
        Object.keys(monthlyAttendance).forEach((month) => {
            doc.setFont("Helvetica", "bold");
            doc.text(month, 20, startY);
            startY += 10;
            doc.setFont("Helvetica", "normal");
            doc.text('Date', 20, startY);
            doc.text('Status', 80, startY);
            startY += 10;

            monthlyAttendance[month].forEach((record) => {
                doc.text(record.date.split('T')[0], 20, startY);
                doc.text(record.status || 'N/A', 80, startY);
                startY += 10;
            });
        });
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const selectedInternDetails = interns.find((intern) => intern._id === selectedIntern);

        if (!selectedInternDetails) return; 

        const internName = `${selectedInternDetails.firstName} ${selectedInternDetails.lastName}`;

       
        addPDFHeader(doc, internName);
        addAttendanceDataToPDF(doc);

       
        doc.save(`attendance_${internName}.pdf`);
    };

    return (
        <div className="attendance-dashboard">
            <aside className="ad-sidebar-unique">
                <img src={logo} alt="logo" className="ad-sidebar-logo-unique" />
                <nav className="ad-sidebar-nav-unique">
                    <Link to="/admin" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Bookings
                    </Link>
                    <Link to="/interns" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faUser} className="ad-sidebar-icon" />
                        Interns
                    </Link>
                    <Link to="/add-holiday" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faPlusCircle} className="ad-sidebar-icon" />
                        Add Holiday
                    </Link>
                    <Link to="/attendance" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faCalendar} className="ad-sidebar-icon" />
                        Daily Attendance
                    </Link>
                    <Link to="/intern-attendance" className={`px-4 py-2 rounded-tr-full rounded-br-full transition-colors duration-200 ${window.location.pathname === '/intern-attendance' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600 hover:text-white'}`} >
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Intern Attendance
                    </Link>
                </nav>
                <button className="ad-sidebar-logout-button-unique">
                    <FontAwesomeIcon icon={faSignOutAlt} className="ad-sidebar-icon" />
                    Log Out
                </button>
            </aside>
            
            <div className="attendance-content">
            <h1 className="text-4xl font-bold mb-4">Intern Attendance</h1>
                <div>
                    <select value={selectedIntern} onChange={handleInternChange} className="intern-select">
                        <option value="">Select an Intern</option>
                        {interns.map((intern) => (
                            <option key={intern._id} value={intern._id}>
                                {intern.firstName} {intern.lastName} ({intern.internID})
                            </option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleFilterSubmit} className="filter-form">
                    <div className="filter-dates">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor="end-date">End Date:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="filter-button">Filter</button>
                </form>

                {Object.keys(monthlyAttendance).length > 0 ? (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    {Object.keys(monthlyAttendance).map((month) => (
                                        <th key={month}>{month}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(31).keys()].map((day) => (
                                    <tr key={day}>
                                        <td>{day + 1}</td>
                                        {Object.keys(monthlyAttendance).map((month) => {
                                            const record = monthlyAttendance[month].find(
                                                (rec) => moment(rec.date).date() === day + 1
                                            );
                                            return (
                                                <td key={month}>
                                                    {record ? record.status || 'N/A' : '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No attendance records found.</p>
                )}

                <button onClick={exportPDF} className="intern-export-pdf-button">
                    Export as PDF
                </button>
            </div>
        </div>
    );
};

export default InternAttendance;