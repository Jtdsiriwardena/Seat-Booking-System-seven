
const Intern = require('../models/Intern');

const getAllInterns = async (req, res) => {
    try {
        const interns = await Intern.find({}, 'internID firstName lastName email');
        res.json(interns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllInterns };
