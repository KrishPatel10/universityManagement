const joi = require('@hapi/joi')

const student_reg = (data) => {
    const schema = {
        student_id: joi.number.required(),
        student_fname: joi.string.min(1).required(),
        student_mname: joi.string.min(1).required(),
        student_lname: joi.string.min(1).required(),
        student_email: joi.string.min(1).required().email(),
        student_login_password: joi.string.min(8).required(),
        cpi: joi.number.min(0).required(),
        weight: joi.number.min(30).required(),
        height: joi.number.min(80).required(),
        date_of_birth: joi.date().required(),
        street: joi.string.min(1).required(),
        city: joi.string.min(1).required(),
        pin: joi.number.min(111111).required()
    }

    const {error} = new joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

const employee_reg = (data) => {
    const schema = {
        employee_id: joi.number.required(),
        employee_fname: joi.string.min(1).required(),
        employee_mname: joi.string.min(1).required(),
        employee_lname: joi.string.min(1).required(),
        employee_email: joi.string.min(1).required().email(),
        employee_login_password: joi.string.min(8).required(),
        salary: joi.number.min(10000).required(),
        joining_date: joi.date().required(),
        date_of_birth: joi.date().required(),
        street: joi.string.min(1).required(),
        city: joi.string.min(1).required(),
        pin: joi.number.min(111111).required()
    }

    const {error} = new joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

const student_log = (data) => {
    const schema = {
        student_email: joi.string.min(1).required().email(),
        student_login_password: joi.string.min(8).required()
    }

    const {error} = new joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

const employee_log = (data) => {
    const schema = {
        employee_id: joi.number.required(),
        employee_login_password: joi.string.min(8).required()
    }

    const {error} = new joi.ValidationError(data, schema);
    if(error) res.status(400).send(error.details[0].message);
}

module.exports.student_reg = student_reg;
module.exports.employee_reg = employee_reg;
module.exports.student_log = student_log; 
module.exports.employee_log = employee_log;