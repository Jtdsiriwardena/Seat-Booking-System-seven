/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an intern
 *     description: Log in using intern credentials.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "thisuradilmith99@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */



/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new intern
 *     description: Creates a new intern account with provided details.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               internId:
 *                 type: string
 *                 example: "12345"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Successfully created new intern
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

const express = require('express');
const { signup, login, googleLogin, updateInternId } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/update-intern-id', updateInternId);

module.exports = router;