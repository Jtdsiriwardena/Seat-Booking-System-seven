import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarLink = ({ to, icon, label }) => {
    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-3 my-4 rounded-full text-white hover:bg-white hover:text-blue-900 transition-colors duration-200 ${window.location.pathname === to ? 'bg-blue-700 text-white' : ''}`}
        >
            <FontAwesomeIcon icon={icon} className="mr-3" />
            {label}
        </Link>
    );
};

// Add prop types validation
SidebarLink.propTypes = {
    to: PropTypes.string.isRequired,       // 'to' is a required string
    icon: PropTypes.object.isRequired,     // 'icon' should be an object (FontAwesomeIcon)
    label: PropTypes.string.isRequired,    // 'label' should be a string
};

export default SidebarLink;
