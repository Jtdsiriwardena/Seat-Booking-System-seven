
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Seat Booking API',
      version: '1.0.0',
      description: 'API for the Seat Booking System',
      contact: {
        name: 'Dilmith Siriwardena',
        email: 'jtdsiriwardena@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server'
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
