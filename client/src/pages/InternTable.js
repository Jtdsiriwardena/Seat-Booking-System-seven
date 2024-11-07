// InternTable.js
import React from 'react';

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

export default InternTable;
