import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const InternTable = ({ interns }) => {
    return (
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
                {interns.map((intern) => (
                    <tr key={intern._id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{intern.internID}</td>
                        <td className="border px-4 py-2">{intern.firstName}</td>
                        <td className="border px-4 py-2">{intern.lastName}</td>
                        <td className="border px-4 py-2">{intern.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// PropTypes Validation
InternTable.propTypes = {
    interns: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired, // Assuming '_id' is a string
            internID: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired
        })
    ).isRequired
};

export default InternTable;
