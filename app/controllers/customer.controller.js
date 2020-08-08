const Customer = require('../models/customer.model')
const HttpStatus = require('http-status-codes')

/**
 * Save new customer to the database.
 * Return OK for success
 * Return BAD_REQUEST for invalid requests.
 * Return SERVER_ERROR for any exceptions.
 * @param {Object} req - Http Request
 * @param {Object} res - Http Response
 **/
exports.create = (req, res) => {
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
        .then(createdCustomer => sendSucessResponse(res, createdCustomer, "Customer created successfully"))
        .catch(err => sendErorResponse(res, err))
}
/**
 * Retrieve all customers from the database.
 * Return OK for success
 * Return SERVER_ERROR for other exceptions.
 * @param {Object} req - Http Request
 * @param {Object} res - Http Response
 **/
exports.findAll = (req, res) => {
    Customer.paginate({}, prepareFindOptions(req.query))
        .then(customers => sendSucessResponse(res, customers, "Customer retrieved successfully"))
        .catch(err => sendErorResponse(res, err))
}

/**
 * Find a single customer based on Id.
 * Return OK for success
 * Return NOT_FOUND reponse if ID is not present in the database.
 * Return SERVER_ERROR for any other exceptions. 
 * @param {Object} req - Http Request
 * @param {Object} res - Http Response
 **/
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
        .then(customer => {
            if (!customer) { //This occurs when a record is deleted and subsequently queried upon.
                sendErorResponse(res, new Error("not found"))
            }
            sendSucessResponse(res, customer, "Customer retrieved successfully")
        }
        ).catch(err => sendErorResponse(res, err))

}
/**
 * Update a customer based on Id.
 * Return OK for success
 * Return NOT_FOUND reponse if ID is not present in the database.
 * Return SERVER_ERROR for any exceptions.
 * @param {Object} req - Http Request
 * @param {Object} res - Http Response
 **/
exports.update = (req, res) => {
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
                    sendErorResponse(res, new Error("not found"))
                }
                sendSucessResponse(res, customer, "Customer updated successfully")
            }
        ).catch(err => sendErorResponse(res, err))
}


/**
 * Delete a customer based on Id
 * Return OK for success
 * Return NOT_FOUND reponse if ID is not present in the database.
 * Return SERVER_ERROR for any exceptions
 * @param {Object} req - Http Request
 * @param {Object} res - Http Response
 */
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if (!customer) { //This occurs when a record is deleted and subsequently queried upon.
                sendErorResponse(res, new Error("not found"))
            }
            sendSucessResponse(res, customer, "Customer deleted successfully")
        }).catch(err => sendErorResponse(res, err))
}


/**
 * Default sorting of the results is by last updated timestamp in descending order.
 * Default values for offset is 0 and limit is 25.
 * Maximum value of limit is 100 to avoid attacks like Denial of Service
 * @param {Object} reqQuery - query parameter object from the request
 */
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

/**
 * 
 * @param {Object} res - Http Response
 * @param {Object} data - Data to be sent in the payload
 * @param {String} message - Brief description of the operation
 */
function sendSucessResponse(res, data, message) {
    return res.status(HttpStatus.OK).send(
        prepareResponseObject(HttpStatus.OK,
            HttpStatus.getStatusText(HttpStatus.OK),
            message,
            data))
}
/** 
 * @param {Object} res - Http Response
 * @param {Object} error - Error Object 
 */

function sendErorResponse(res, error) {
    if ('bad request' === error.message || 'ValidationError' === error.name) {
        return res.status(HttpStatus.BAD_REQUEST).send(
            prepareResponseObject(HttpStatus.BAD_REQUEST,
                HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
                error.message,
                null))
    }
    if ('not found' === error.message || 'ObjectId' === error.kind) {
        return res.status(HttpStatus.NOT_FOUND).send(
            prepareResponseObject(HttpStatus.NOT_FOUND,
                HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
                "Customer not found in Database",
                null))
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        prepareResponseObject(HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
            error.message || "Error occurred during the operation",
            null))
}
/**
 * Prepare response object with the arguments
 * @param {number} code - Http Status Code
 * @param {string} status - Http Status
 * @param {string} message - Brief Description of the operation
 * @param {Object[]} payload - Array of Customer objects. Null in case of errors
 */
function prepareResponseObject(code, status, message, payload) {
    return {
        code,
        status,
        message,
        payload
    }

}