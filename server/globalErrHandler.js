const AppErr = require('./utils/AppErr');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value} `;
  return new AppErr(message, 400);
};

const handleDuplicateErrDB = (err) => {
  const valueObj = err.keyValue;
  const value = Object.values(valueObj);

  const message = `Duplicate field value: "${value}" . Please use another value  `;
  return new AppErr(message, 400);
};

const handelValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. : ${errors.join('. ')} `;
  return new AppErr(message, 400);
};

const handelJWTerror = (err) => {
  err.message = 'Invalid token . Please login again!';

  return new AppErr(err.message, 401);
};

const handelJWTexpired = (err) => {
  err.message = 'Your token has expired. Please login again!';

  return new AppErr(err.message, 401);
};

const sendErrorToProd = (err, res) => {
  if (err.isOprational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Somthig went Wrong!',
    });
  }
};

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    Error: err,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log(process.env.NODE_ENV);
  // console.log(process.env.NODE_ENV === process.env.NODE_ENV_PROD);

  if (process.env.NODE_ENV === process.env.NODE_ENV_DEV) {
    sendErrorToDev(err, res);
  }
  if (process.env.NODE_ENV === process.env.NODE_ENV_PROD) {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
      return sendErrorToProd(error, res);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrDB(error);
      return sendErrorToProd(error, res);
    }

    if (err.name === 'ValidationError') {
      error = handelValidationError(error);
      return sendErrorToProd(error, res);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handelJWTerror(error);
      return sendErrorToProd(error, res);
    }
    if (err.name === 'TokenExpiredError') {
      error = handelJWTexpired(error);
      return sendErrorToProd(error, res);
    }
    sendErrorToProd(err, res);
  }
};
