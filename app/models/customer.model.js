const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const { isEmail, isMobilePhone } = require('validator')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required',
        trim: true
    },
    surname: {
        type: String,
        required: 'Surname is required',
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: { validator: isEmail, message: 'Invalid email.' }
    },
    initials: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true,
        validate: { validator: isMobilePhone, message: 'Invalid mobile.' }
    },
    lastupdated: {
        type: Date
    }

})
customerSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Customer', customerSchema)
