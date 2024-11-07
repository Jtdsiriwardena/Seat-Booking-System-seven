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

// Helper function to validate email format
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Signup function
exports.signup = async (req, res) => {
    const { internID, firstName, lastName, email, password } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName || !internID) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Sanitize and ensure safe data handling before storing
        const intern = new Intern({
            internID: internID.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
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

    // Ensure sanitized email
    const sanitizedEmail = email.trim().toLowerCase();

    try {
        // Use safe query with properly sanitized data
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

        // Ensure email is sanitized
        const sanitizedEmail = email.trim().toLowerCase();

        // Find intern by email with sanitized value
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

    // Ensure email is sanitized
    const sanitizedEmail = email.trim().toLowerCase();

    try {
        // Use sanitized data for the query
        let intern = await Intern.findOne({ email: sanitizedEmail });

        if (!intern) {
            // If intern doesn't exist, create a new one
            intern = new Intern({
                email: sanitizedEmail,
                internID: internId.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });
            await intern.save();
        } else {
            // Update intern details
            intern.internID = internId.trim();
            intern.firstName = firstName.trim();
            intern.lastName = lastName.trim();
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
