const swaggerJSDoc = require('swagger-jsdoc')

/**
 * Configure Swagger Doc Options
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Customer Manager API',
            version: '1.0.0',
        },
        basePath: '/api/v1'
    },
    apis: ['./app/controllers/*.js'],
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
module.exports = swaggerJSDoc(options)