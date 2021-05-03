const mongoose = require("mongoose")

// we can decouple imgBinData to another schema
// e.g. Media, so we can have multiple pictures per post (slide posts/carousel)
const PostSchema = new mongoose.Schema({
    // primary key is automatically created from mongoose/mongodb
    // hence no need to create it in the schema
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    imgBinData: {
        type: Buffer,
        required: true
    },
    caption: {
        type: String
    },
    hashtags: {
        type: String
    },
    marketplaceItem: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
     // makes sure the data is valid and data integrity is preserved
})

module.exports = Post = mongoose.model('Posts', PostSchema);