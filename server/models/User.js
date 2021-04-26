const mongoose = required("mongoose")

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
    date: {
        type: Date,
        default: Date.now
    },
    favoritePictureType: {
        type: String,
        enum: ['animals', 'nature', 'memes', 'educational'],
        required: true
    },
    strict: true // makes sure the data is valid and data integrity is preserved
})