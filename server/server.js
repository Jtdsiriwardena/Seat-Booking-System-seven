const cluster = require('cluster');
const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const jwt = require('jsonwebtoken');
const internRoutes = require('./routes/internRoutes');
require('dotenv').config();

const { swaggerUi, swaggerDocs } = require('./swagger');

const app = express();

if (cluster.isMaster) {
  
    const numCPUs = os.cpus().length;
    console.log(`Master process is running with PID: ${process.pid}`);
    console.log(`Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); 
    }

    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
        cluster.fork();
    });

} else {
    
    

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }));

    app.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
    });

    app.use(bodyParser.json());

    const authMiddleware = (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) return res.status(401).json({ message: 'No token provided' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.internId = decoded.id; 
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };

    app.use('/api/auth', authRoutes);
    app.use('/api/bookings', authMiddleware, bookingRoutes); 
    app.use('/api/interns', internRoutes); 

    const holidayRoutes = require('./routes/holidayRoutes');
    app.use('/api', holidayRoutes);

    app.use((req, res, next) => {
        console.log(`Request URL: ${req.originalUrl}`);
        next();
    });


app.use('/api/bookings', bookingRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });
}
