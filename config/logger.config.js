const winston = require('winston')

/**
 * Create Application wide logger configuration.
 * Can also be configured to write to files.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'customer-manager-api' },
  transports: [
    new winston.transports.Console()
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

/**
 * export the logger config
 */
module.exports = {
    logger
}
