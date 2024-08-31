const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration using Cloudinary
const multerConfiguration = (folder, fileName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder, // Destination folder in Cloudinary
      format: async (req, file) => {
        const ext = file.mimetype.split('/')[1]; // Automatically set the file format based on mimetype
        return ext;
      },
      public_id: (req, file) => `${fileName}-${req.user.id}-${Date.now()}`, // Unique file name
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
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 1MB
  });
};

exports.uploadImage = (dest, fileName) => {
  const upload = multerConfiguration(dest, fileName);
  return (req, res, next) => {
    upload.single(fileName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // if (!req.file) {
      //   return res.status(400).json({ error: 'No file uploaded!' });
      // }
      next();
    });
  };
};
