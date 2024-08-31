const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../utils/catchAsync');
const AppErr = require('../utils/AppErr');

const cloudinary = require('cloudinary').v2;

const paginate = (pageVal, limitVal) => {
  const page = pageVal * 1 || 1;
  const limit = limitVal;
  return (page - 1) * limit;
};
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//register a new user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    passwordCreatedAt: Date.now() - 1000,
  });

  newUser.password = undefined;

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      posts: newUser.posts,
      avatar: newUser.avatar,
    },
  });
});

//login a register user
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppErr('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new AppErr('No user found with this Email. Please register first.', 404),
    );
  }

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppErr('Incorrect email or password!', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      posts: user.posts,
      avatar: user.avatar,
    },
  });
});

// user profile
exports.getUser = (req, res, next) => {
  const cruntUser = req.user;

  res.status(200).json({
    status: 'success',
    user: cruntUser,
  });
};

//get all authors
exports.getAllAuthors = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;

  const skip = paginate(req.query.page, limit);

  const totalPosts = await User.countDocuments();

  const authors = await User.find().sort({ posts: -1 }).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.status(200).json({
    status: 'success',
    total: authors.length,
    totalPages,
    authors,
  });
});

// change avatar
exports.changeAvatar = catchAsync(async (req, res, next) => {
  let avatar;
  const { id } = req.user;

  if (req.file) {
    avatar = req.file.path; // Cloudinary's URL of the uploaded image

    // Delete old avatar from Cloudinary
    const oldAvatarUrl = req.user.avatar;

    if (oldAvatarUrl && !oldAvatarUrl.includes('avatar-default')) {
      // Extract public_id from the old URL (assuming the format includes Cloudinary details)
      const oldPublicId = oldAvatarUrl.split('/').slice(-1)[0].split('.')[0]; // Adjust if your URLs are different
      await cloudinary.uploader.destroy(
        `user/${oldPublicId}`,
        (error, result) => {
          if (error) {
            console.error('Error deleting old avatar from Cloudinary:', error);
          } else {
            console.log('Old avatar deleted from Cloudinary:', result);
          }
        },
      );
    }
  } else {
    let oldAvatarDefault = req.user.avatar;
    avatar = oldAvatarDefault;
  }

  // Update user with the new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

//edit user details
exports.editUser = catchAsync(async (req, res, next) => {
  let { name, email, currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  user.name = name;
  user.email = email;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(
      new AppErr(
        'Please correctly enter currentPassword , new password and confirm password!',
        400,
      ),
    );
  }

  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppErr('Invalid Current Password!', 400));
  }
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  user.passwordCreatedAt = Date.now() - 2000;

  const updatedUser = await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    user: updatedUser,
  });
});
