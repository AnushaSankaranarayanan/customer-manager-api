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
            data => res.status(HttpStatus.CREATED).send(
                prepareResponse(HttpStatus.CREATED,
                    HttpStatus.getStatusText(HttpStatus.CREATED),
                    "Customer created successfully",
                    data)
            )
        ).catch(
            err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                prepareResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
                    err.message || "Error occurred when saving customer",
                    null)
            )
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