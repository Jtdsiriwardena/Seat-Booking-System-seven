import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Attendance.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faPlusCircle, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Attendance = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5; 
    const token = localStorage.getItem('token');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchBookingsByDate = useCallback(async () => {
        try {
            const formattedDate = formatDate(selectedDate);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { date: formattedDate } 
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }, [selectedDate, token]);

    const updateAttendance = async (bookingId, status) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}/attendance`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedBookings = bookings.map(booking => 
                booking._id === bookingId ? { ...booking, status } : booking
            );
            setBookings(updatedBookings);
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    useEffect(() => {
        if (selectedDate) {
            fetchBookingsByDate();
        }
    }, [selectedDate, fetchBookingsByDate]);

   
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const exportPDF = () => {
        const doc = new jsPDF();
    
        const img = new Image();
        img.src = logo; 
        img.onload = function() {
            const imgWidth = 40; 
            const imgHeight = 20; 
            const marginTop = 5; 
            const marginLeft = 5; 
            
            doc.addImage(img, 'PNG', marginLeft, marginTop, imgWidth, imgHeight);
    
            const startYAfterLogo = imgHeight + marginTop + 10; 
    
            const pageWidth = doc.internal.pageSize.getWidth();
    
            const title = 'Daily Attendance Report';
            const titleFontSize = 16;
            doc.setFontSize(titleFontSize);
            const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
            const titleXPos = (pageWidth - titleWidth) / 2;
            doc.setFont("helvetica", "bold");
            doc.text(title, titleXPos, startYAfterLogo); 
    
            const formattedDate = selectedDate ? formatDate(selectedDate) : 'N/A';
            const dateText = `Date: ${formattedDate}`;
            const dateFontSize = 12;
            doc.setFontSize(dateFontSize);
            const dateYPos = startYAfterLogo + 10; 
            const dateWidth = doc.getStringUnitWidth(dateText) * dateFontSize / doc.internal.scaleFactor;
            const dateXPos = (pageWidth - dateWidth) / 2;
            doc.setFont("helvetica", "normal");
            doc.text(dateText, dateXPos, dateYPos); 
    
            let startYForTable = dateYPos + 15; 
    
            doc.setFont("helvetica", "bold");
            doc.text('Intern ID', 20, startYForTable);
            doc.text('Intern', 60, startYForTable);
            doc.text('Seat', 120, startYForTable);
            doc.text('Status', 150, startYForTable);
    
            doc.setFont("helvetica", "normal");
            bookings.forEach((booking) => {
                startYForTable += 10;
                doc.text(booking.intern.internID, 20, startYForTable); 
                doc.text(`${booking.intern.firstName} ${booking.intern.lastName}`, 60, startYForTable); 
                doc.text(booking.seatNumber ? booking.seatNumber.toString() : 'N/A', 120, startYForTable); 
                doc.text(booking.status || 'N/A', 150, startYForTable); 
            });
    
            doc.save(`attendance_report_${formattedDate}.pdf`);
        };
    };

    const getStatusColor = (status) => {
        if (status === 'present') {
            return 'green';
        } else if (status === 'absent') {
            return 'red';
        } else {
            return 'black';
        }
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
                    <Link to="/attendance" className={`px-4 py-2 rounded-tr-full rounded-br-full transition-colors duration-200 ${window.location.pathname === '/attendance' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600 hover:text-white'}`}>
                        <FontAwesomeIcon icon={faCalendar} className="ad-sidebar-icon" />
                        Daily Attendance
                    </Link>
                    <Link to="/intern-attendance" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Intern Attendance
                    </Link>
                </nav>
                <button className="ad-sidebar-logout-button-unique">
                    <FontAwesomeIcon icon={faSignOutAlt} className="ad-sidebar-icon" />
                    Log Out
                </button>
            </aside>
            <div className="add-holiday-content-unique p-6">
                <div className="attendance-area">
                    <h1 className="attendance-heading">Daily Attendance</h1>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="attendance-date-picker"
                    />
                    <button onClick={exportPDF} className="export-pdf-button">
                        Export as PDF
                    </button>
                    {currentBookings.length > 0 ? (
                        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                            <thead>
                                <tr className="bg-blue-200">
                                    <th className="px-4 py-2">Intern ID</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Seat Number</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{booking.intern.internID}</td>
                                        <td className="border px-4 py-2">{`${booking.intern.firstName} ${booking.intern.lastName}`}</td>
                                        <td className="border px-4 py-2">{booking.seatNumber}</td>
                                        <td className="border px-4 py-2" style={{ color: getStatusColor(booking.status) }}>
                                            {booking.status || 'N/A'}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="bg-green-500 text-white py-1 px-3 rounded hover:opacity-90"
                                                onClick={() => updateAttendance(booking._id, 'present')}
                                            >
                                                Present
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:opacity-90 ml-2"
                                                onClick={() => updateAttendance(booking._id, 'absent')}
                                            >
                                                Absent
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No bookings found for the selected date.</p>
                    )}
                    {bookings.length > bookingsPerPage && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
