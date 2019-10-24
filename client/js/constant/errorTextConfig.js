const errorTextConfig = {
    registrationErrors: {
        userNameError: 'Username should be 3-20 alphanumeric',
        userNameLengthError: 'Username should be 3 or more characters',
        userNameExistError: 'Username already exists',
        userNameReserved: 'Username is reserved',
        passwordLengthError: 'Password should be 4 or more characters',
        passwordConfirmError: 'Password should be the same'
    },
    exceptions: {
        processingError: 'There was an error in processing.'
    }
};

module.exports = errorTextConfig;
