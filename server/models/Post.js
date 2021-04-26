const mongoose = required("mongoose")

const PostSchema = new mongoose.Schema({
    // primary key is automatically created from mongoose/mongodb
    // hence no need to create it in the schema
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type: String
    },
    hashtags: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    },
    strict: true // makes sure the data is valid and data integrity is preserved
})