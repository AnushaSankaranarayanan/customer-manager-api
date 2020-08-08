const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config')
const mongoose = require('mongoose')
const { logger } = require('./config/logger.config')
mongoose.Promise = global.Promise

/**
 * create express app
 */
const app = express();

/**
 * parse requests of content-type - application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * parse requests of content-type - application/json
 */
app.use(bodyParser.json())

/**
 * Connecting to the database
 */
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    logger.info(`Successfully connected to the database`)
}).catch(err => {
    logger.error('Could not connect to the database. Exiting now...', err)
    process.exit();
});

/**
 * Require Customer Routes
 */
require('./app/routes/customer.routes')(app)

const port = process.env.APP_PORT || 9000

/**
 * listen for requests
 */
app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
});