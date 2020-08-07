const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/customer_db'
//const mongoUrl = process.env.MONGO_URL

module.exports = {
    url: mongoUrl
}