


/**
 * @swagger
 * /holidays:
 *   post:
 *     summary: Add a new holiday
 *     description: Creates a new holiday with the specified date and reason.
 *     tags:
 *       - Holidays
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
 *                 example: "2024-12-25"
 *               reason:
 *                 type: string
 *                 example: "Christmas Day"
 *     responses:
 *       201:
 *         description: Successfully created holiday
 *       500:
 *         description: Server error - Could not create holiday
 */



/**
 * @swagger
 * /holidays:
 *   get:
 *     summary: Retrieve all holidays
 *     description: Fetches a list of all holidays.
 *     tags:
 *       - Holidays
 *     responses:
 *       200:
 *         description: Successfully retrieved holidays
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
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-25"
 *                   reason:
 *                     type: string
 *                     example: "Christmas Day"
 *       500:
 *         description: Server error - Could not retrieve holidays
 */



/**
 * @swagger
 * /holidays/67113ab156676e875c8b0dd2:
 *   delete:
 *     summary: Delete a holiday
 *     description: Deletes a specific holiday identified by ID.
 *     tags:
 *       - Holidays
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the holiday to delete
 *         schema:
 *           type: string
 *           example: "60e4c3f4f16f542f4e5f8d63"
 *     responses:
 *       200:
 *         description: Successfully deleted holiday
 *       404:
 *         description: Not found - Holiday does not exist
 *       500:
 *         description: Server error - Could not delete holiday
 */


const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday'); 


router.post('/holidays', async (req, res) => {
    try {
        const { date, reason } = req.body;
        const holiday = new Holiday({ date, reason });
        await holiday.save();
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/holidays', async (req, res) => {
    try {
        const holidays = await Holiday.find();
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/holidays/:id', async (req, res) => {
    try {
        const holiday = await Holiday.findByIdAndDelete(req.params.id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
