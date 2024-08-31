const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/AppErr');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppErr('you are not logedIn! Please login first.', 401));
  }

  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  //decodedToken contains Id, iat and exp

  const cruntUser = await User.findById(decodeToken.id);

  if (!cruntUser) {
    return next(new AppErr('User not exist ! ', 401));
  }

  if (cruntUser.passwordChangedAfter(decodeToken.iat)) {
    return next(
      new AppErr(
        'Resently you changed your password ! please logIn again. ',
        401,
      ),
    );
  }

  req.user = cruntUser;

  next();
});

module.exports = protect;
