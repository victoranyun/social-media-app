const bcrypt = require('bcryptjs')

module.exports = {
    checkPassword: async function checkPassword(password, inputted_password, callback) {
        bcrypt.compare(password, inputted_password, (error, isValidated) => {
            if (error) {
                throw error;
            }
            return callback(isValidated);
        })
    }
}