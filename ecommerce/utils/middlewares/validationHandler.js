const Joi = require('joi')
const boom = require('boom')

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema)
  return error
}

const validationHandler = (schema, check = 'body') => {
  return (req, res, next) => {
    const error = validate(req[check], schema)
    error ? next(new Error(boom.badRequest(error))) : next()
  }
}

module.exports = validationHandler