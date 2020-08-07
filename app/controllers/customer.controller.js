const Customer = require('../models/customer.model')
var HttpStatus = require('http-status-codes')

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(HttpStatus.BAD_REQUEST).send(
            prepareResponse(HttpStatus.BAD_REQUEST,
                HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
                "Customer cannot be null",
                null)
        )
    }

    // Create a Customer
    const customer = new Customer({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        initials: req.body.initials,
        mobile: req.body.mobile,
        lastupdated: new Date()
    })

    // Save Customer in DB
    customer.save()
        .then(
            customer => res.status(HttpStatus.CREATED).send(
                prepareResponse(HttpStatus.CREATED,
                    HttpStatus.getStatusText(HttpStatus.CREATED),
                    "Customer created successfully",
                    customer)
            )
        ).catch(err => {
            if ('ValidationError' === err.name) {
                return res.status(HttpStatus.BAD_REQUEST).send(
                    prepareResponse(HttpStatus.BAD_REQUEST,
                        HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
                        err.message || "Validation Error",
                        null))
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                prepareResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
                    err.message || "Error occurred when saving customer",
                    null))
        }
        )

}

//Find a single customer based on Id
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
        .then(
            customer => {
                if (!customer) { //This occurs when a record is deleted and subsequently queried upon.
                    return res.status(HttpStatus.NOT_FOUND).send(
                        prepareResponse(HttpStatus.NOT_FOUND,
                            HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
                            `Customer not found in Database ${req.params.customerId}`,
                            null))
                }
                return res.status(HttpStatus.OK).send(
                    prepareResponse(HttpStatus.OK,
                        HttpStatus.getStatusText(HttpStatus.OK),
                        "Customer retrieved successfully",
                        customer))
            }
        )
        .catch(err => {
            if ('ObjectId' === err.kind) {
                return res.status(HttpStatus.NOT_FOUND).send(
                    prepareResponse(HttpStatus.NOT_FOUND,
                        HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
                        `Customer not found in Database ${req.params.customerId}`,
                        null))
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                prepareResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
                    err.message || "Error occurred when retrieving customer",
                    null))
        }

        )

}

function prepareResponse(code, status, message, payload) {
    return {
        code,
        status,
        message,
        payload
    }

}