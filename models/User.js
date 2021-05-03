const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    // primary key is automatically created from mongoose/mongodb
    // hence no need to create it in the schema
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    credits: {
        type: Number,
        default: 100,
        required: true
    }
    // makes sure the data is valid and data integrity is preserved
})

module.exports = User = mongoose.model('Users', UserSchema);