const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/customer_db'
/**
 * export the database config
 */
module.exports = {
    url: mongoUrl
}