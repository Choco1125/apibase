const { ValidationError } = require('sequelize');

function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function ormHandlerError(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.message,
      errors: err.errors,
    });
  }

  next(err);
}

function boomErrorHandler(err, req, res, next) {
  if (!err.isBoom) return next(err);

  const { output } = err;
  res.status(output.statusCode).json(output.payload);
}

module.exports = { logErrors, errorHandler, ormHandlerError, boomErrorHandler };
