const {body, validationResult} = require('express-validator');

const getErrorMessage = (req) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorArray = errors.array();
        return errorArray.reduce((message, error) => {
            return message + error.msg + "<br/>"
        }, '')
    }
    return null
}

module.exports = {body, getErrorMessage}