
/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a seat
 *     description: Allows an intern to book a seat by selecting a date, seat number, and adding a special request.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-01"
 *               seatNumber:
 *                 type: integer
 *                 example: 12
 *               specialRequest:
 *                 type: string
 *                 example: "Near window"
 *     responses:
 *       201:
 *         description: Successfully booked seat
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */




/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     description: Fetches a list of all bookings made by interns.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: Successfully retrieved bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60e4c3f4f16f542f4e5f8d63"
 *                   internId:
 *                     type: string
 *                     example: "12345"
 *                   seatNumber:
 *                     type: integer
 *                     example: 12
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-11-01"
 *                   specialRequest:
 *                     type: string
 *                     example: "Near window"
 *       500:
 *         description: Server error - Could not retrieve bookings
 */


/**
 * @swagger
 * /bookings/6711347256676e875c8b0ca2/confirm:
 *   put:
 *     summary: Confirm a booking
 *     description: Confirms a specific booking identified by booking ID.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         description: ID of the booking to confirm
 *         schema:
 *           type: string
 *           example: "671134e356676e875c8b0ca9"
 *     responses:
 *       200:
 *         description: Successfully confirmed booking
 *       400:
 *         description: Bad request - Invalid booking ID
 *       404:
 *         description: Not found - Booking does not exist
 *       500:
 *         description: Server error - Could not confirm booking
 */



/**
 * @swagger
 * /bookings/6711347256676e875c8b0ca2/attendance:
 *   put:
 *     summary: Update intern attendance
 *     description: Marks an intern's attendance as present or absent for a specific booking identified by booking ID.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - name: bookingId
 *         in: path
 *         required: true
 *         description: ID of the booking for which attendance is being marked
 *         schema:
 *           type: string
 *           example: "671134e356676e875c8b0ca9"
 *       - name: attendanceStatus
 *         in: query
 *         required: true
 *         description: Attendance status (present or absent)
 *         schema:
 *           type: string
 *           enum: [present, absent]
 *           example: "present"
 *     responses:
 *       200:
 *         description: Successfully updated attendance status
 *       400:
 *         description: Bad request - Invalid booking ID or attendance status
 *       404:
 *         description: Not found - Booking does not exist
 *       500:
 *         description: Server error - Could not update attendance
 */



/**
 * @swagger
 * /bookings/intern/6711347256676e875c8b0ca2:
 *   get:
 *     summary: Get intern attendance
 *     description: Retrieves attendance records for a specific intern identified by intern ID.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - name: internId
 *         in: path
 *         required: true
 *         description: ID of the intern for whom attendance records are requested
 *         schema:
 *           type: string
 *           example: "INT12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: string
 *                     example: "60e4c3f4f16f542f4e5f8d63"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-11-01"
 *                   attendanceStatus:
 *                     type: string
 *                     enum: [present, absent]
 *                     example: "present"
 *       404:
 *         description: Not found - Intern does not exist
 *       500:
 *         description: Server error - Could not retrieve attendance records
 */

const express = require('express');
const { bookSeat, getBookings, confirmBooking } = require('../controllers/bookingController');
const { getAllBookings } = require('../controllers/bookingController');
const { cancelBooking } = require('../controllers/bookingController');
const bookingController = require('../controllers/bookingController');
const { getConfirmedBookings } = require('../controllers/bookingController');

const { getInternAttendance } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', bookSeat);


router.get('/', getBookings);


router.get('/all', getAllBookings);


router.get('/all', bookingController.getAllBookings);

router.get('/confirmed', getConfirmedBookings);


router.put('/:bookingId/confirm', confirmBooking);


router.delete('/:bookingId', cancelBooking);



router.put('/:bookingId/attendance', bookingController.updateAttendance);

router.get('/intern/:internId', getInternAttendance);

router.post('/book-seat', bookingController.bookSeat);




module.exports = router;
