import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import backgroundImage from './images/image.png';
import logo from './images/logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isInternIdPopupOpen, setIsInternIdPopupOpen] = useState(false);
    const [googleEmail, setGoogleEmail] = useState('');
    const [internId, setInternId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: 'Welcome back!',
            });
            navigate('/Dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: 'Please try again.',
            });
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google-login`, {
                token: response.credential,
            });

            if (res.data.isNewUser) {
                setIsInternIdPopupOpen(true);
                setGoogleEmail(res.data.email);
            } else {
                localStorage.setItem('token', res.data.token);
                Swal.fire({
                    icon: 'success',
                    title: 'Google Login successful!',
                    text: 'Welcome back!',
                });
                navigate('/Dashboard');
            }
        } catch (error) {
            console.error('Google Login failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Google Login failed',
                text: 'Please try again.',
            });
        }
    };

    const handleInternIdSubmit = async () => {
        if (!internId || !firstName || !lastName) {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'All fields are required to proceed.',
            });
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/update-intern-id`, {
                email: googleEmail,
                internId,
                firstName,
                lastName
            });

            localStorage.setItem('token', res.data.token);
            Swal.fire({
                icon: 'success',
                title: 'Intern details updated!',
                text: 'Login successful!',
            });
            setIsInternIdPopupOpen(false);
            navigate('/Dashboard');
        } catch (error) {
            console.error('Failed to create intern record:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to create intern record',
                text: 'Please try again.',
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="flex-1 flex items-center justify-center bg-blue-950">
                <div className="w-96 p-8 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-44" />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="Email" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <button 
                            type="submit" 
                            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                    <div className="my-4 text-center">
                        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={(error) => console.error('Google Login error:', error)}
                                useOneTap
                            />
                        </GoogleOAuthProvider>
                    </div>
                    <div className="text-center">
                        Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative">
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="flex flex-col items-center justify-center h-full bg-blue-950 bg-opacity-60">
                        <img src={logo} alt="Logo" className="w-44 mb-4" />
                        <h2 className="text-white text-2xl">Book Your Seat with Ease!</h2>
                    </div>
                </div>
            </div>

            {isInternIdPopupOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-20">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
                            <input 
                                type="text" 
                                placeholder="First Name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <input 
                                type="text" 
                                placeholder="Last Name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <input 
                                type="text" 
                                placeholder="Intern ID" 
                                value={internId} 
                                onChange={(e) => setInternId(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <button 
                                onClick={handleInternIdSubmit} 
                                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;
