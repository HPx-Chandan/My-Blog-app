const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post must have a Title!'],
    maxlength: [30, 'Post Title should be under 30 characters!'],
  },
  category: {
    type: String,
    enum: [
      'Agriculture',
      'Business',
      'Education',
      'Entertainment',
      'Art',
      'Investment',
      'Uncategorised',
      'Weather',
    ],
    message: '{Value is not supported}',
  },
  description: {
    type: String,
    required: [true, 'Post must have a Desc!'],
    minlength: [90, 'Description should be under 90 characters!'],
  },
  thumbnail: {
    type: String,
    default: 'default.jpeg',
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
