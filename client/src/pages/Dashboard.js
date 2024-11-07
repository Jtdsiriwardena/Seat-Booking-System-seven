import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Dashboard.css';
import logo from './images/logo.png';

const MySwal = withReactContent(Swal);

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [date, setDate] = useState('');
    const [seatNumber, setSeatNumber] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const token = localStorage.getItem('token');
    const internId = localStorage.getItem('internId');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/bookings/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching all bookings:', error.response ? error.response.data : error.message);
            }
        };

        const fetchHolidays = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/holidays`);
                setHolidays(response.data);
                console.log('Holidays fetched:', response.data);
            } catch (error) {
                console.error('Error fetching holidays:', error.response ? error.response.data : error.message);
            }
        };

        if (date) {
            fetchBookings();
        }
        fetchHolidays();
    }, [date, token, internId]);

    const handleBooking = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/bookings`, {
                internId,
                date,
                seatNumber,
                specialRequest
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Booking successful:', response);
    
            MySwal.fire({
                title: 'Booking Successful!',
                text: `You have booked seat number ${seatNumber} for ${date}.`,
                icon: 'success',
                confirmButtonText: 'Ok',
            });
    
           
    
    
        } catch (error) {
            console.error('Error booking seat:', error.response ? error.response.data : error.message);
    
        }
    };
    
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const dayOfWeek = new Date(selectedDate).getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            MySwal.fire({
                title: 'Invalid Date',
                text: 'Booking is not allowed on weekends.',
                icon: 'warning',
                confirmButtonText: 'Ok',
            });
            setDate('');
        } else {
            setDate(selectedDate);
        }
    };

    const getSeatColor = (seat) => {
        if (!date) return 'bg-green-400';

        const isBooked = bookings.some(booking =>
            booking.seatNumber === seat &&
            new Date(booking.date).toDateString() === new Date(date).toDateString()
        );

        const isHoliday = holidays.some(holiday =>
            new Date(holiday.date).toDateString() === new Date(date).toDateString()
        );

        if (isHoliday) return 'bg-yellow-400';
        if (isBooked) return 'bg-red-500';
        if (seat === seatNumber) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const handleSeatClick = (seat) => {
        const color = getSeatColor(seat);
        if (color === 'bg-yellow-400') {
            const holiday = holidays.find(h =>
                new Date(h.date).toDateString() === new Date(date).toDateString()
            );
            if (holiday) {
                MySwal.fire({
                    title: 'Holiday Info',
                    text: `Holiday Reason: ${holiday.reason}`,
                    icon: 'info',
                    confirmButtonText: 'Ok',
                });
            }
        } else if (color !== 'bg-red-500') { 
            setSeatNumber(seat);
        }
    };

    return (
        <div className="intern-dashboard-container text-gray-100 min-h-screen p-1">
            <header className="dashboard-header flex items-center justify-between mb-6">
                <img src={logo} alt="logo" className="dashboard-logo h-13" />
                <nav className="flex space-x-4">
                    <a 
                        href="/Dashboard" 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${window.location.pathname === '/Dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-blue-400 hover:text-white'}`}
                    >
                        Book a Seat
                    </a>
                    <a 
                        href="/ViewBookings" 
                        className={`px-4 py-2 rounded transition-colors duration-200 ${window.location.pathname === '/ViewBookings' ? 'bg-blue-600 text-white' : 'hover:bg-blue-400 hover:text-white'}`}
                    >
                        My Bookings
                    </a>
                </nav>
                <button className="logout-button bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500">Log Out</button>
            </header>


            <div className="dashboard-content bg-transparent p-6 rounded-lg shadow-lg">
                <div className="seat-selection bg-transparent-40">
                    <h4 className="text-lg font-bold mb-4">Select a Seat for Booking</h4>
                    <form onSubmit={handleBooking}>
                        <div className="form-group mb-4">
                            <label htmlFor="date" className="block text-sm mb-1">Select the date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={handleDateChange}
                                required
                                className="border rounded p-2 w-full text-gray-800"
                            />
                            <div className="legend flex justify-between mt-2">
                                <span className="legend-item booked text-red-600">Booked Seats</span>
                                <span className="legend-item available text-green-500">Available Seats</span>
                                <span className="legend-item holiday text-yellow-400">Holidays</span>
                            </div>
                        </div>

                        <div className="seat-grid grid grid-cols-5 gap-2">
    {Array.from({ length: 20 }, (_, i) => i + 1).map(seat => (
        <button
            key={seat}
            type="button" // Button type to avoid form submission
            aria-pressed={seatNumber === seat} // Accessibility state to indicate if the seat is selected
            className={`seat w-12 h-12 flex items-center justify-center rounded-md font-bold text-white ${getSeatColor(seat)} cursor-pointer`}
            onClick={() => handleSeatClick(seat)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent page scroll when pressing space
                    handleSeatClick(seat); // Handle keyboard interaction
                }
            }}
        >
            {seat}
        </button>
    ))}
</div>



                        <button type="submit" className="confirm-button mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">Confirm Booking</button>
                    </form>
                </div>

                <div className="special-request mt-0">
                    <h4 className="text-lg font-bold mb-2">Make a Special Request</h4>
                    <textarea
                        placeholder="If you have any special requests or requirements for your seating arrangement, please specify them in the box below:"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        className="w-full p-2 border rounded h-24 bg-gray-100 text-gray-900"
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
