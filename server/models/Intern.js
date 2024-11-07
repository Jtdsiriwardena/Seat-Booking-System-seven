const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    internID: { type: String, required: false }, 
    firstName: { type: String, required: false }, 
    lastName: { type: String, required: false }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('Intern', internSchema);
