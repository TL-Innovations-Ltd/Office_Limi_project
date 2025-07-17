const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: "drwoekliw",
  api_key: "253749524177665",
  api_secret: "ua-T1KruwcdPtoJoUPX8hztSJkU",
  secure: true
});

// Configure multer for disk storage for 3D models
const model3dDir = path.join(__dirname, '../../3d-models');
if (!fs.existsSync(model3dDir)) {
  fs.mkdirSync(model3dDir, { recursive: true });
}

const storage_model3d = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, model3dDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// For 3D model uploads
const upload = multer({
  storage: storage_model3d,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'model/vnd.usdz+zip', 
      'application/zip', 
      'application/octet-stream',
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream'
    ];
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || ['usdz', 'glb', 'gltf'].includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only USDZ, GLB, or GLTF files are allowed.'), false);
    }
  }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
// For profile picture uploads
const profilePictureUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) && ['jpeg', 'jpg', 'png', 'gif'].includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, or GIF images are allowed.'), false);
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

// Function to upload profile picture to Cloudinary
const uploadProfilePicture = (buffer) => {
  return new Promise((resolve, reject) => {
    const public_id = `profile-pictures/${uuidv4()}`;
    
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: public_id,
        folder: 'profile-pictures',
        transformation: [
          { width: 200, height: 200, gravity: 'face', crop: 'thumb' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

// Function to delete a file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Export all functions
module.exports = {
    cloudinary,
    upload,
    uploadToCloudinary, 
    profilePictureUpload,
    uploadProfilePicture,
    deleteFromCloudinary
};