const { validateUserName, validatePassword } = require('../../client/js/lib/validation');

const validate = (username, password) => {
    return validateUserName(username).result && validatePassword(password).result;
};

module.exports = validate;
