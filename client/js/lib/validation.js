const reservedNameDict = require("../constant/reservedUserNames");
const errorTextConfig = require("../constant/errorTextConfig");

const validateUserName = (username) => {
    if(reservedNameDict[username]) {
        return { result: false, text: errorTextConfig.registrationErrors.userNameReserved };
    }
    const reg = /^[a-zA-Z0-9]{3,20}$/;
    if(!reg.test(username)) {
        return { result: false, text: errorTextConfig.registrationErrors.userNameError };
    }
    return { result: true, text: "" };
};

const validatePassword = (password) => {
    const reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+){4,20}$/;
    if(!reg.test(password)) {
        return { result: false, text: errorTextConfig.registrationErrors.passwordLengthError };
    }
    return { result: true, text: "" };
};

const validateConfirmPassword = (password, confirmPassword) => ({ result: password === confirmPassword, text: errorTextConfig.registrationErrors.passwordConfirmError });

module.exports = { validateUserName, validatePassword, validateConfirmPassword };
