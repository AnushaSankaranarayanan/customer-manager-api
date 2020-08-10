const Customer = require('../models/customer.model')
const HttpStatus = require('http-status-codes')
const { logger } = require('../../config/logger.config')

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestCustomer:
 *       type: object
 *       required:
 *           - name
 *           - surname
 *           - email
 *       properties:         
 *           name:
 *               type: string
 *           surname:
 *               type: string
 *           email:
 *               type: string
 *           initials:
 *               type: string
 *           mobile:
 *               type: string
 *     CustomerInDB:
 *         allOf:
 *           - $ref: '#/components/schemas/RequestCustomer'
 *           - type: object
 *             properties:
 *                id:
 *                  type: string            
 *                lastupdated:
 *                  type: string
 *     PaginatedCustomerData:
 *       type: object
 *       properties:
 *           docs:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/CustomerInDB'         
 *           totalDocs:
 *               type: number
 *           offset:
 *               type: number
 *           limit:
 *               type: number
 *           totalPages:
 *               type: number
 *           page:
 *               type: number
 *           pagingCounter:
 *               type: number
 *           hasPrevPage:
 *               type: boolean
 *           hasNextPage:
 *               type: boolean
 *           prevPage:
 *               type: number
 *           nextPage:
 *               type: number
 *     BaseResponse:
 *         type: object
 *         properties:
 *             code:
 *                 type: number            
 *             status:
 *                 type: string
 *             message:
 *                 type: string
 *     SuccessResponse:
 *         allOf:
 *           - $ref: '#/components/schemas/BaseResponse'
 *           - type: object
 *             properties:
 *               payload:
 *                 allOf:
 *                   - $ref: '#/components/schemas/CustomerInDB'
 *     SuccessPaginationResponse:
 *         allOf:
 *           - $ref: '#/components/schemas/BaseResponse'
 *           - type: object
 *             properties:
 *               payload:
 *                 allOf:
 *                   - $ref: '#/components/schemas/PaginatedCustomerData'
 *     ErrorResponse:
 *         allOf:
 *           - $ref: '#/components/schemas/BaseResponse'
 *           - type: object
 *             properties:
 *               payload:
 *                 type: string
 *                 nullable: true
 *                     
 *   parameters:
 *         idParam:
 *               name: customerId
 *               in: formData
 *               description: Customer Id.
 *               required: true
 *               type: string
 *         customerParam:
 *               name: customer
 *               description: Customer object
 *               in:  body
 *               required: true
 *               type: string
 *               schema:
 *                  $ref: '#/components/schemas/RequestCustomer'
 *         offsetParam:
 *               name: offset
 *               in: query
 *               description: Number of items to skip before returning the results.
 *               required: false
 *               schema:
 *                 type: integer
 *                 format: number
 *                 minimum: 0
 *                 default: 0
 *         limitParam:
 *               name: limit
 *               in: query
 *               description: Maximum number of items to return.
 *               required: false
 *               schema:
 *                 type: integer
 *                 format: number
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 25
 *         sortKeyParam:
 *               name: sortkey
 *               in: query
 *               description: Sort Key.
 *               required: false
 *               schema:
 *                 type: string
 *                 enum: [name, surname, email, initials]
 *                 default: lastupdated
 *         sortDirParam:
 *               name: sortdir
 *               in: query
 *               description: Sort Direction.
 *               required: false
 *               schema:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: desc
 *
 *   responses:
 *        200Ok:
 *            description: Success
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SuccessResponse'
 *        200ListingOk:
 *            description: Success
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SuccessPaginationResponse'
 *        400BadRequest:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ErrorResponse'       
 *        401Unauthorized:
 *            description: Unauthorized access. 
 *        404NotFound:
 *           description: The specified resource was not found.
 *           content:
 *              application/json:
 *                 schema:
 *                      $ref: '#/components/schemas/ErrorResponse'
 *        500ServerError:
 *           description: Server Error
 *           content:
 *              application/json:
 *                 schema:
 *                      $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 *
 * /customer:
 *   post:
 *     summary: Creates a customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: customer
 *         $ref: '#/components/parameters/customerParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200Ok'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *          $ref: '#/components/responses/401Unauthorized'
 *       500:
 *         $ref: '#/components/responses/500ServerError'
 */
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
        .catch(err => sendErrorResponse(req, res, err))
}

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Get all customers
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: offset
 *         $ref: '#/components/parameters/offsetParam'
 *       - id: limit
 *         $ref: '#/components/parameters/limitParam'
 *       - id: sortkey
 *         $ref: '#/components/parameters/sortKeyParam'
 *       - id: sortDir
 *         $ref: '#/components/parameters/sortDirParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200ListingOk'
 *       401:
 *          $ref: '#/components/responses/401Unauthorized'
 *       500:
 *         $ref: '#/components/responses/500ServerError'
 */
exports.findAll = (req, res) => {
    Customer.paginate({}, prepareFindOptions(req.query))
        .then(customers => sendSucessResponse(res, customers, "Customer retrieved successfully"))
        .catch(err => sendErrorResponse(req, res, err))
}

/**
 * @swagger
 * /customer/{customerId}:
 *   get:
 *     summary: Get a customer by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: customerId
 *         $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *          $ref: '#/components/responses/200Ok'
 *       401:
 *          $ref: '#/components/responses/401Unauthorized'
 *       404:
 *          $ref: '#/components/responses/404NotFound'
 *       500:
 *          $ref: '#/components/responses/500ServerError'
 */
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
        .then(customer => {
            if (!customer) { //This occurs when a record is deleted and subsequently queried upon.
                return sendErrorResponse(req, res, new Error("not found"))
            }
            sendSucessResponse(res, customer, "Customer retrieved successfully")
        }).catch(err => sendErrorResponse(req, res, err))

}

/**
 * @swagger
 *
 * /customer/{customerId}:
 *   put:
 *     summary: Update a customer by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: customerId
 *         $ref: '#/components/parameters/idParam'
 *       - id: customer
 *         $ref: '#/components/parameters/customerParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200Ok'
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *          $ref: '#/components/responses/401Unauthorized'
 *       404:
 *          $ref: '#/components/responses/404NotFound'
 *       500:
 *         $ref: '#/components/responses/500ServerError'
 */
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
                    return sendErrorResponse(req, res, new Error("not found"))
                }
                sendSucessResponse(res, customer, "Customer updated successfully")
            }
        ).catch(err => sendErrorResponse(req, res, err))
}


/**
 * @swagger
 *
 * /customer/{customerId}:
 *   delete:
 *     summary: Delete a customer by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - id: customerId
 *         $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/200Ok'
 *       401:
 *          $ref: '#/components/responses/401Unauthorized'
 *       404:
 *          $ref: '#/components/responses/404NotFound'
 *       500:
 *         $ref: '#/components/responses/500ServerError'
 */
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if (!customer) { //This occurs when a record is deleted and subsequently queried upon.
                return sendErrorResponse(req, res, new Error("not found"))
            }
            sendSucessResponse(res, customer, "Customer deleted successfully")
        }).catch(err => sendErrorResponse(req, res, err))
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
        logger.warn(`Listing Limit chosen beyond the permissible limit: ${limit} `)
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

function sendErrorResponse(req, res, error) {
    logger.error(`Error Occurred during processing. Message : ${error.message}`)
    if ('ValidationError' === error.name) {
        return res.status(HttpStatus.BAD_REQUEST).send(
            prepareResponseObject(HttpStatus.BAD_REQUEST,
                HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
                error.message,
                null))
    }
    if (error.message.includes('duplicate')) {
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