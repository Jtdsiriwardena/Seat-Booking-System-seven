import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faPlusCircle, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Admin = () => {
    const [bookings, setBookings] = useState([]);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalInterns, setTotalInterns] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmed, setShowConfirmed] = useState(false);
    const token = localStorage.getItem('token');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 8;

    // Function to sort bookings by confirmation status
    const sortBookingsByConfirmation = (a, b) => {
        if (a.isConfirmed === b.isConfirmed) return 0;
        return a.isConfirmed ? 1 : -1;
    };

    useEffect(() => {
        const fetchBookingsAndStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const sortedBookings = response.data.sort(sortBookingsByConfirmation);
                setBookings(sortedBookings);
                setTotalBookings(sortedBookings.length);
                setTotalInterns(new Set(sortedBookings.map(booking => booking.intern._id)).size);
            } catch (error) {
                console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
            }
        };

        fetchBookingsAndStats();
    }, [token]);

    const MySwal = withReactContent(Swal);

    const confirmBooking = async (bookingId) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            MySwal.fire({
                title: 'Confirmed!',
                text: 'Seat booking has been confirmed.',
                icon: 'success',
                confirmButtonText: 'Ok'
            });

            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingId ? { ...booking, isConfirmed: true } : booking
                )
            );
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            MySwal.fire({
                title: 'Error!',
                text: 'Failed to confirm booking. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredBookings = bookings.filter(booking =>
        booking.intern &&
        (booking.intern.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.intern.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const confirmedBookings = filteredBookings.filter(booking => booking.isConfirmed);
    const upcomingBookings = filteredBookings.filter(booking => !booking.isConfirmed);

    const totalPages = Math.ceil((showConfirmed ? confirmedBookings.length : upcomingBookings.length) / bookingsPerPage);
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = showConfirmed ? confirmedBookings.slice(indexOfFirstBooking, indexOfLastBooking) : upcomingBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`mx-1 px-3 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="bg-gray-200 min-h-screen">
            <aside className="ad-sidebar-unique">
                <img src={logo} alt="logo" className="ad-sidebar-logo-unique" />
                <nav className="ad-sidebar-nav-unique">
                    <Link to="/admin" className={`px-4 py-2 rounded-tr-full rounded-br-full transition-colors duration-200 ${window.location.pathname === '/admin' ? 'bg-blue-600 text-white' : 'hover:bg-slate-600 hover:text-white'}`}>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="card bg-blue-900 text-white p-4 rounded shadow-lg">
                        <h3 className="text-xl">Total Bookings</h3>
                        <p className="text-2xl">{totalBookings}</p>
                    </div>
                    <div className="card bg-blue-800 text-white p-4 rounded shadow-lg">
                        <h3 className="text-xl">Pending Bookings</h3>
                        <p className="text-2xl">{upcomingBookings.length}</p>
                    </div>
                    <div className="card bg-blue-700 text-white p-4 rounded shadow-lg">
                        <h3 className="text-xl">Confirmed Bookings</h3>
                        <p className="text-2xl">{confirmedBookings.length}</p>
                    </div>
                    <div className="card bg-blue-600 text-white p-4 rounded shadow-lg">
                        <h3 className="text-xl">Total Interns</h3>
                        <p className="text-2xl">{totalInterns}</p>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search by First Name or Last Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="p-2 mb-4 border rounded w-full"
                />

                <div className="mb-4">
                    <button
                        className={`mr-2 py-2 px-4 rounded ${showConfirmed ? 'bg-blue-200' : 'bg-blue-900 text-white'} hover:opacity-90`}
                        onClick={() => {
                            setShowConfirmed(false);
                            setCurrentPage(1);
                        }}
                    >
                        Upcoming Bookings
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${showConfirmed ? 'bg-blue-900 text-white' : 'bg-blue-200'} hover:opacity-90`}
                        onClick={() => {
                            setShowConfirmed(true);
                            setCurrentPage(1);
                        }}
                    >
                        Confirm Bookings
                    </button>
                </div>

                {currentBookings.length > 0 ? (
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg mb-4">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="px-4 py-2">Intern ID</th>
                                <th className="px-4 py-2">First Name</th>
                                <th className="px-4 py-2">Last Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="px-4 py-2">{booking.intern.internID}</td>
                                    <td className="px-4 py-2">{booking.intern.firstName}</td>
                                    <td className="px-4 py-2">{booking.intern.lastName}</td>
                                    <td className="px-4 py-2">{booking.intern.email}</td>
                                    <td className="px-4 py-2">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{booking.isConfirmed ? 'Confirmed' : 'Pending'}</td>
                                    <td className="px-4 py-2">
                                        {!booking.isConfirmed && (
                                            <button
                                                onClick={() => confirmBooking(booking._id)}
                                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-600">No bookings found.</p>
                )}

                <div className="flex justify-center mt-4">
                    {renderPageNumbers()}
                </div>
            </div>
        </div>
    );
};

export default Admin;
