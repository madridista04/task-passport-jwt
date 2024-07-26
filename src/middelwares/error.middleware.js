const { createError } = require('http-errors');
const { getFailuerResponse } = require('../utils/response');
const { ValidationError } = require('express-validation')


exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  res.status(status).json(getFailuerResponse(status, errorMessage));
}

exports.notFoundHandler = (req, res, next) => {
  return next(createError(404, "Data not Found"));
}


const getErrorMessage = (err) => {
  for(let entity of ['query', 'body', 'params']) {
    if (err.details[entity]) {
      return err.details[entity][0].message;
    } 
  }
}

exports.validationError = function (err, req, res, next) {
  if (err instanceof ValidationError) {

    let errorMessage = getErrorMessage(err);
    const status = err.statusCode;
    // if (err.details.params) {
    //   errorMessage = err.details.params[0].message; 
    // }else{
    //   errorMessage =  err.details.body[0].message;
    // }
    const errName = err.name;
    return res.status(err.statusCode).json(getFailuerResponse(status, errorMessage, errName));
    // return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err)
}