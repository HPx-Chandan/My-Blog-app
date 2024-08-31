const multer = require('multer');
const path = require('path');
const fs = require('fs');

const multerConfiguration = (dest, fileName) => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'public', 'img', dest);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${fileName}-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  };

  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

exports.uploadImage = (dest, fileName) => {
  const upload = multerConfiguration(dest, fileName);
  return (req, res, next) => {
    upload.single(fileName)(req, res, (err) => {
      if (err) {
        // console.error('Upload Error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        // console.log('No file uploaded');
      }
      // console.log('File uploaded:', req.file);
      next();
    });
  };
};

// multer  original configration from DOCs...
// ...
// ...
// ...
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/user');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb('error!!!!', false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });
