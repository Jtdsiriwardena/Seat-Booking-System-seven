
const mongoose = require('mongoose');

const confirmBookingSchema = new mongoose.Schema({
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    date: { type: Date, required: true },
    seatNumber: { type: Number, required: true },
    specialRequest: { type: String },
    confirmedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('ConfirmBooking', confirmBookingSchema);
