const express = require('express')
const customerBaseUrl = '/customer'
const customerUrlById = `${customerBaseUrl}/:customerId`
const customerController = require('../controllers/customer.controller')
const router = express.Router()

router.post(customerBaseUrl, customerController.create)

// Retrieve all customers
router.get(customerBaseUrl, customerController.findAll)

// Retrieve a single customer by customerId
router.get(customerUrlById, customerController.findOne)

// Update a customer by customerId
router.put(customerUrlById, customerController.update)

// Delete a customer by customerId
router.delete(customerUrlById, customerController.delete)

module.exports = router
