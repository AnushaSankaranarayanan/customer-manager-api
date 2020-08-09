const { baseUrl } = require('../../config/url.config')
const customerBaseUrl = `${baseUrl}/customer`
const customerUrlById = `${customerBaseUrl}/:customerId`
/**
 * Define and handle routes of the application.
 * @param {*} app - express app
 */
module.exports = (app) => {
    const customerController = require('../controllers/customer.controller');

    // Create a new customer
    app.post(customerBaseUrl, customerController.create);

    // Retrieve all customers
    app.get(customerBaseUrl, customerController.findAll);

    // Retrieve a single customer by customerId
    app.get(customerUrlById, customerController.findOne);

    // Update a customer by customerId
    app.put(customerUrlById, customerController.update);

    // Delete a customer by customerId
    app.delete(customerUrlById, customerController.delete);
}