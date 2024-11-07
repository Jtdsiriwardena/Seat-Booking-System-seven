import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Intern.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faPlusCircle, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Intern = () => {
    const [interns, setInterns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const internsPerPage = 8;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/interns`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInterns(response.data);
            } catch (error) {
                console.error('Error fetching interns:', error.response ? error.response.data : error.message);
            }
        };

        fetchInterns();
    }, [token]);

    const filteredInterns = interns.filter((intern) =>
        `${intern.firstName} ${intern.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastIntern = currentPage * internsPerPage;
    const indexOfFirstIntern = indexOfLastIntern - internsPerPage;
    const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredInterns.length / internsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="intern-dashboard">
            <aside className="ad-sidebar-unique">
                <img src={logo} alt="logo" className="ad-sidebar-logo-unique" />
                <nav className="ad-sidebar-nav-unique">
                    <Link to="/admin" className="ad-sidebar-link-unique">
                        <FontAwesomeIcon icon={faClipboardList} className="ad-sidebar-icon" />
                        Bookings
                    </Link>
                    <Link to="/interns" className={`px-2 py-2 rounded-tr-full rounded-br-full transition-colors duration-200 ${window.location.pathname === '/interns' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600 hover:text-white'}`}>
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

            <div className="table-content p-6">
                <h1 className="text-4xl font-bold mb-4">Interns</h1>
                <div className="search-container mb-4">
                    <input
                        type="text"
                        placeholder="Search by first or last name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                </div>

                {currentInterns.length > 0 ? (
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="px-4 py-2">Intern ID</th>
                                <th className="px-4 py-2">First Name</th>
                                <th className="px-4 py-2">Last Name</th>
                                <th className="px-4 py-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInterns.map((intern) => (
                                <tr key={intern._id} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{intern.internID}</td>
                                    <td className="border px-4 py-2">{intern.firstName}</td>
                                    <td className="border px-4 py-2">{intern.lastName}</td>
                                    <td className="border px-4 py-2">{intern.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500">No interns available</p>
                )}

                <div className="flex justify-between mt-4">
                    <button 
                        className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button 
                        className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
                        onClick={nextPage}
                        disabled={currentPage === Math.ceil(filteredInterns.length / internsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Intern;
