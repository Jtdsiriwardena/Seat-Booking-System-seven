const Intern = require('../models/Intern');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify Google token
const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
};

// Signup function
exports.signup = async (req, res) => {
    const { internID, firstName, lastName, email, password } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName || !internID) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure email is properly formatted
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure internID is a string and no special characters
        const sanitizedInternID = String(internID).trim();

        // Create intern instance safely
        const intern = new Intern({
            internID: sanitizedInternID,
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            email: String(email).trim(),
            password: hashedPassword
        });

        // Save intern to database
        await intern.save();
        res.status(201).json({ message: 'Intern registered successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error during signup' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Ensure email is a string and no special characters
        const sanitizedEmail = String(email).trim();

        // Use safe querying techniques with parameterized queries
        const intern = await Intern.findOne({ email: sanitizedEmail });

        // Check if intern exists and password matches
        if (!intern || !await bcrypt.compare(password, intern.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token for authentication
        const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
};

// Google Login function
exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const userData = await verifyGoogleToken(token);
        const { email } = userData;

        // Ensure email is a string and no special characters
        const sanitizedEmail = String(email).trim();

        // Find intern by email (parameterized query)
        let intern = await Intern.findOne({ email: sanitizedEmail });

        if (!intern) {
            return res.json({ isNewUser: true, email });
        }

        // Generate JWT token for the existing intern
        const jwtToken = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: jwtToken, isNewUser: false });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Google login failed' });
    }
};

// Update Intern ID function
exports.updateInternId = async (req, res) => {
    const { email, internId, firstName, lastName } = req.body;

    // Input validation
    if (!email || !internId || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Ensure email is a string and no special characters
        const sanitizedEmail = String(email).trim();
        const sanitizedInternId = String(internId).trim();

        let intern = await Intern.findOne({ email: sanitizedEmail });

        if (!intern) {
            // If intern doesn't exist, create a new one
            intern = new Intern({
                email: sanitizedEmail,
                internID: sanitizedInternId,
                firstName: String(firstName).trim(),
                lastName: String(lastName).trim()
            });
            await intern.save();
        } else {
            // Update intern details
            intern.internID = sanitizedInternId;
            intern.firstName = String(firstName).trim();
            intern.lastName = String(lastName).trim();
            await intern.save();
        }

        // Generate JWT token after updating
        const jwtToken = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: jwtToken });
    } catch (error) {
        console.error('Failed to update Intern details:', error);
        res.status(500).json({ message: 'Failed to update intern details' });
    }
};
