const Post = require('./../models/postModel');
const User = require('./../models/userModel');
const fs = require('fs');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');
const AppErr = require('../utils/AppErr');
const cloudinary = require('cloudinary').v2;
const paginate = (pageVal, limitVal) => {
  const page = pageVal * 1 || 1;
  const limit = limitVal;
  return (page - 1) * limit;
};

exports.createPost = catchAsync(async (req, res, next) => {
  let thumbnail;
  if (req.file) {
    thumbnail = req.file.path;
  }

  if (!req.file) {
    thumbnail =
      'https://res.cloudinary.com/dezkpe10i/image/upload/v1724929261/thumbnail-default_elipjl.jpg';
  }

  const { title, category, description } = req.body;
  const creator = req.user.id;
  const createdAt = Date.now();

  const createPost = {
    thumbnail,
    title,
    description,
    category,
    creator,
    createdAt,
  };

  const newPost = await Post.create(createPost);
  if (!newPost) {
    return next(new AppErr('Post is not created ! please try again leter'));
  }

  const currentUser = await User.findById(req.user.id);
  const userPostCount = currentUser.posts + 1;
  await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

  res.status(201).json({
    sattus: 'success',
    data: newPost,
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;

  const skip = paginate(req.query.page, limit);

  const totalPosts = await Post.countDocuments();

  const allposts = await Post.find()
    .populate({ path: 'creator', select: '-__v -passwordCreatedAt' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.status(200).json({
    status: 'success',
    results: allposts.length,
    totalPages,
    data: allposts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'creator',
    select: '-__v -passwordCreatedAt',
  });

  if (!post) {
    return next(new AppErr('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: post,
  });
});

exports.getCategoryPost = async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;

  const skip = paginate(req.query.page, limit);

  const totalPosts = await Post.countDocuments({
    category: req.params.category,
  });

  const categoryPost = await Post.find({ category: req.params.category })
    .populate({ path: 'creator', select: '-__v -passwordCreatedAt' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.status(200).json({
    status: 'success',
    result: categoryPost.length,
    totalPages,
    data: categoryPost,
  });
};

exports.editPost = async (req, res, next) => {
  const currentPost = await Post.findById(req.params.id);

  let newThumbnail;
  const oldThumbnailUrl = currentPost.thumbnail;

  if (req.file) {
    newThumbnail = req.file.path;

    if (oldThumbnailUrl && !oldThumbnailUrl.includes('thumbnail-default')) {
      const oldPublicId = oldThumbnailUrl.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(
        `post/${oldPublicId}`,
        (error, result) => {
          if (error) {
            console.error(
              'Error deleting old thumbnail from Cloudinary:',
              error,
            );
          } else {
            console.log('Old thumbnail deleted from Cloudinary:', result);
          }
        },
      );
    }
  } else {
    newThumbnail = currentPost.thumbnail;
  }

  let editedPost = {
    title: req.body.title || currentPost.title,
    category: req.body.category || currentPost.category,
    description: req.body.description || currentPost.description,
    thumbnail: newThumbnail,
    creator: req.user.id,
    createdAt: Date.now(),
  };

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, editedPost, {
    new: true,
    runValidations: true,
  });

  res.status(201).json({
    status: 'success',
    data: updatedPost,
  });
};

exports.deletePost = catchAsync(async (req, res, next) => {
  const deletePost = await Post.findByIdAndDelete(req.params.id);

  if (!deletePost) {
    return next(new AppErr('No post found with that ID', 404));
  }

  let oldThumbnail = deletePost.thumbnail;

  if (oldThumbnail !== 'thumbnail-default.jpeg') {
    fs.unlink(
      path.join(__dirname, '..', 'public', 'img', 'post', oldThumbnail),
      () => {
        // console.log('delete');
      },
    );
  }

  const currentUser = await User.findById(req.user.id);
  const userPostCount = currentUser.posts - 1;
  await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

  res.status(204).json({
    status: 'success',
  });
});

exports.getUserPost = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;

  const skip = paginate(req.query.page, limit);

  const totalPosts = await Post.countDocuments({ creator: req.params.id });

  const userPost = await Post.find({ creator: req.params.id })
    .populate({ path: 'creator', select: '-__v -passwordCreatedAt' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalPosts / limit);

  res.status(200).json({
    status: 'success',
    result: userPost.length,
    totalPages,
    data: userPost,
  });
});
