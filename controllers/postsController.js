const config = '../config';
const multer = require('multer');


module.exports = {
    uploadFile: multer({
        limits: {
            fileSize: 3162 * 3162
        },
        fileFilter (req, file, callback) {
            var ext = file.originalname.split('.');

            ext = ext[ext.length - 1];
            if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
                return callback(null, false);
            }
            callback(null, true);
        }
    }),

    postMapper: function(queryResult, currentUser) {
        mapResult = queryResult.map(data => {
            return {
                caption: data.caption,
                id: data._id,
                price: data.price,
                hashtags: data.hashtags,
                imgBinData: data.imgBinData.toString('base64'),
                owner: data.owner.email.split('@')[0],
                marketplaceItem: data.marketplaceItem,
                currentUserIsOwner: data.owner._id.equals(currentUser),
            }
        });
        return mapResult;
    }
}

