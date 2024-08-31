const { Router } = require('express');
const router = Router();

const controller = require('./../controllers/postController');
const protect = require('./../controllers/authController');
const { uploadImage } = require('./../controllers/multer');

router
  .route('/')
  .get(controller.getAllPosts)
  .post(protect, uploadImage('post', 'thumbnail'), controller.createPost);

router
  .route('/:id')
  .get(controller.getPost)
  .patch(protect, uploadImage('post', 'thumbnail'), controller.editPost)
  .delete(protect, controller.deletePost);

router.get('/categories/:category', controller.getCategoryPost);
router.get('/users/:id', controller.getUserPost);

module.exports = router;
