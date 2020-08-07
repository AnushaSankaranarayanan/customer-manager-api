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

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Customer.paginate({}, prepareFindOptions(req.query))
        .then(
            customers => res.status(HttpStatus.OK).send(
                prepareResponse(HttpStatus.OK,
                    HttpStatus.getStatusText(HttpStatus.OK),
                    "Customer retrieved successfully",
                    customers)
            )
        ).catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                prepareResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
                    err.message || "Error occurred when retrieving customer",
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

// Update a customer based on Id
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(HttpStatus.BAD_REQUEST).send(
            prepareResponse(HttpStatus.BAD_REQUEST,
                HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
                "Customer cannot be null",
                null))
    }

    // Find customer and update it with the request body
    Customer.findOneAndUpdate(
        {
            _id: req.params.customerId
        },
        {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            initials: req.body.initials,
            mobile: req.body.mobile,
            lastupdated: new Date()
        },
        {
            new: true,
            runValidators: true
        })
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
                        "Customer updated successfully",
                        customer))
            }
        )
        .catch(err => {
            if ('ObjectId' === err.kind) {
                return res.status(HttpStatus.NOT_FOUND).send(
                    prepareResponse(HttpStatus.NOT_FOUND,
                        HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
                        `Customer not found in Database: ${req.params.customerId}`,
                        null))
            }
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
                    err.message || "Error occurred when updating customer",
                    null))
        }
        )
}

// Delete a customer based on Id
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
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
                    "Customer deleted successfully",
                    customer))
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(HttpStatus.NOT_FOUND).send(
                    prepareResponse(HttpStatus.NOT_FOUND,
                        HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
                        `Customer not found in Database: ${req.params.customerId}`,
                        null))
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                prepareResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                    HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
                    err.message || "Error occurred when deleting customer",
                    null))
        })
}

/**
 * Default sorting of the results is by last updated timestamp in descending order.
 * Default values for offset is 0 and limit is 25.
 * Maximum value of limit is 100 to avoid attacks like Denial of Service
 **/
function prepareFindOptions(reqQuery) {
    const LIMIT_RECORD_LISTING = 100
    const defaultSortBy = 'lastupdated'
    // Check if the sort key is one of the DB columns
    const sortKey = reqQuery.sortkey ? (
        Object.keys(Customer.schema.paths).some(v => reqQuery.sortkey === v) ? reqQuery.sortkey : defaultSortBy)
        : defaultSortBy

    const sortDir = reqQuery.sortdir === 'asc' ? 1 : -1
    const offset = reqQuery.offset || 0
    let limit = reqQuery.limit || 25
    if (limit > LIMIT_RECORD_LISTING) {
        limit = LIMIT_RECORD_LISTING
    }
    return {
        sort: { [sortKey]: sortDir },
        offset,
        limit
    }
}

function prepareResponse(code, status, message, payload) {
    return {
        code,
        status,
        message,
        payload
    }

}