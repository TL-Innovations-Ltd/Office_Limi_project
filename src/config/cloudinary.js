const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configure Cloudinary
cloudinary.config({
  cloud_name: "drwoekliw",
  api_key: "253749524177665",
  api_secret: "ua-T1KruwcdPtoJoUPX8hztSJkU",
  secure: true
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['model/vnd.usdz+zip', 'application/zip', 'application/octet-stream'];
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || fileExt === 'usdz') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only USDZ files are allowed.'), false);
    }
  }
});

// Function to upload to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const public_id = `3d-models/${uuidv4()}`;
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: public_id,
        folder: '3d-models',
        format: 'usdz',
        // type: 'upload',
      },
      (error, result) => {
        if (error) return reject(error);
        console.log('Cloudinary upload success:', result); // ✅ Add this line
        resolve(result);
      }
    ).end(buffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };