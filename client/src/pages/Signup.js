import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from './images/image.png';
import logo from './images/logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        internID: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, formData);
            alert('Signup successful!');
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="flex-1 flex items-center justify-center bg-blue-950">
                <div className="w-96 p-8 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-44" />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            name="internID" 
                            placeholder="Enter your Intern ID" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <input 
                            name="firstName" 
                            placeholder="First Name" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <input 
                            name="lastName" 
                            placeholder="Last Name" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        />
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
                            Signup
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        Already have an account? <a href="/login" className="text-blue-500">Login</a>
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
        </div>
    );
};

export default Signup;
