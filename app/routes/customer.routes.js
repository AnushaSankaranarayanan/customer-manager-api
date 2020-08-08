/**
 * Define and handle routes of the application.
 * @param {*} app - express app
 */
module.exports = (app) => {
    const customerController = require('../controllers/customer.controller');

    // Create a new customer
    app.post('/customer', customerController.create);

    // Retrieve all customers
    app.get('/customer', customerController.findAll);

    // Retrieve a single customer by customerId
    app.get('/customer/:customerId', customerController.findOne);

    // Update a customer by customerId
    app.put('/customer/:customerId', customerController.update);

    // Delete a customer by customerId
    app.delete('/customer/:customerId', customerController.delete);
}