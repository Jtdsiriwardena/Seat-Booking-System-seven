const Intern = require('../models/Intern');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
};

exports.signup = async (req, res) => {
    const { internID, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const intern = new Intern({ internID, firstName, lastName, email, password: hashedPassword });
    await intern.save();
    
    res.status(201).json({ message: 'Intern registered successfully!' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const intern = await Intern.findOne({ email });

    if (!intern || !await bcrypt.compare(password, intern.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
    
        const userData = await verifyGoogleToken(token);
        const { email } = userData; 

    
        let intern = await Intern.findOne({ email });

        if (!intern) {
            
            return res.json({ isNewUser: true, email });
        }

    
        const jwtToken = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: jwtToken, isNewUser: false });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Google login failed' });
    }
};

exports.updateInternId = async (req, res) => {
    const { email, internId, firstName, lastName } = req.body;

    try {
     
        let intern = await Intern.findOne({ email });
        if (!intern) {
           
            intern = new Intern({ email, internID: internId, firstName, lastName });
            await intern.save();
        } else {
    
            intern.internID = internId; 
            intern.firstName = firstName;
            intern.lastName = lastName;
            await intern.save();
        }

        const jwtToken = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: jwtToken });
    } catch (error) {
        console.error('Failed to update Intern details:', error);
        res.status(500).json({ message: 'Failed to update intern details' });
    }
};
