const { Router } = require('express');
const router = Router();

const controller = require('./../controllers/userController');
const protect = require('../controllers/authController');
const { uploadImage } = require('./../controllers/multer.js');

router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser);
router.get('/', controller.getAllAuthors);

router.get('/current-user', protect, controller.getUser);

router.patch(
  '/change-avatar',
  protect,
  uploadImage('user', 'avatar'),
  controller.changeAvatar,
);
router.patch('/edit-user', protect, controller.editUser);

module.exports = router;
