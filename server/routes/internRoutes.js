/**
 * @swagger
 * /interns:
 *   get:
 *     summary: Get all interns
 *     description: Retrieves details of all interns.
 *     tags:
 *       - Interns
 *     responses:
 *       200:
 *         description: Successfully retrieved intern details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   internId:
 *                     type: string
 *                     example: "12345"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@gmail.com"
 *                   status:
 *                     type: string
 *                     example: "active"
 *       500:
 *         description: Server error - Could not retrieve intern details
 */


const express = require('express');
const router = express.Router();
const { getAllInterns } = require('../controllers/internController');

router.get('/', getAllInterns);

module.exports = router;
