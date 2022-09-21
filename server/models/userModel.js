const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    wallet_address: {
        type: String,
        required: true
    },
    file_hash_array: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)