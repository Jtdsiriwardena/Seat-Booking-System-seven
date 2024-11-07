import React from 'react';
import { Link } from 'react-router-dom';
import mobile from './images/z.jpg';
import sltLogo from './images/logo.png';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <img src={sltLogo} alt="SLT Logo" className="logo" />
        <div className="button-group">
          <Link to="/signup">
            <button className="login-button">Sign Up</button>
          </Link>
        </div>
      </header>

      <div className="main-content">
        <div className="text-section">
          <h1>Your Gateway to Easy and Quick Seat Booking!</h1>
          <p>Experience seamless seat reservations with just a few clicks.</p>
          <Link to="/login">
            <button className="book-now-button">Book Now</button>
          </Link>
        </div>
        <div className="image-section">
          <div className="image-wrapper">
            <img src={mobile} alt="Woman booking a seat" />
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2024 Sri Lanka Telecom. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
