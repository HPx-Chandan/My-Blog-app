const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },

  email: {
    type: String,
    required: [true, 'User must have a Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: [8, 'Password should be at least 8 characters.'],
    select: false,
  },

  confirmPassword: {
    type: String,
    require: [true, 'Please enter confirm password'],
    validate: {
      //This only works on Create and SAVE!!!
      validator: function (confirmPassword) {
        return confirmPassword === this.password;
      },
      message: 'Passwords are not same',
    },
  },

  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dezkpe10i/image/upload/v1724929204/avatar-default_aekewx.jpg',
  },

  posts: {
    type: Number,
    default: 0,
  },

  passwordCreatedAt: Date,
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPasswodrd,
) {
  return await bcrypt.compare(candidatePassword, userPasswodrd);
};

userSchema.methods.passwordChangedAfter = function (jwtTimeStemp) {
  const passwordCreatedTimeStemp = parseInt(
    this.passwordCreatedAt.getTime() / 1000,
    10,
  );

  return jwtTimeStemp < passwordCreatedTimeStemp;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
