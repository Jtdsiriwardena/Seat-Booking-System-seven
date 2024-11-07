

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (to, firstName, lastName, bookingDate, seatNumber, specialRequest) => {
    try {
        const subject = 'Booking Confirmation for Your Seat Reservation';
        const text = `
Dear ${firstName} ${lastName},

We are pleased to inform you that your seat booking has been successfully confirmed.

**Booking Details:**
- **Date:** ${new Date(bookingDate).toLocaleDateString()}
- **Seat Number:** ${seatNumber}
- **Special Request:** ${specialRequest || 'None'}

If you have any questions or need further assistance, please do not hesitate to contact us.

Best regards,

Sri Lanka Telecom PLC

        `;
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject, 
            text: text,
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}; 

module.exports = { sendEmail };
