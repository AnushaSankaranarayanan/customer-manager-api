const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/customer_db'

module.exports = {
    url: mongoUrl
}