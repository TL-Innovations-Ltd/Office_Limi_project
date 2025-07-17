const fs = require('fs');
const path = require('path');
const Model3D = require('../models/model3d_model');
const { v4: uuidv4 } = require('uuid');
const WebConfigurator = require('../models/web_configurator');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), '3d-models');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadModel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  try {
    const fileExtension = path.extname(req.file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Move the file to the upload directory
    await fs.promises.writeFile(filePath, req.file.buffer);

    // Create model data
    const modelData = {
      userId: req.user._id,
      filename: req.file.originalname,
      path: filePath,
      size: req.file.size,
      mimetype: req.file.mimetype,
      metadata: req.body.metadata || {}
    };

    const savedModel = await Model3D.create(modelData);

    // Return relative path for client
    const responseModel = savedModel.toObject();
    responseModel.downloadUrl = `/3d-models/download/${savedModel._id}`;

    return res.status(201).json({
      success: true,
      data: responseModel
    });

  } catch (error) {
    console.error('Error uploading 3D model:', error);

    // Cleanup on error
    if (req.file) {
      try {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process 3D model',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserModels = async (req, res) => {
  try {
    const models = await Model3D.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Error fetching 3D models:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.downloadModel = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model3D.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: '3D model not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(model.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Set headers for file download
    res.download(model.path, model.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Error in downloadModel:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await Model3D.findById(id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: '3D model not found'
      });
    }

    // // Check ownership
    // if (model.userId.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to delete this model'
    //   });
    // }

    // Delete file
    if (fs.existsSync(model.path)) {
      fs.unlinkSync(model.path);
    }

    // Delete from database
    await Model3D.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error('Error deleting 3D model:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.webConfiguratoruplodaModel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file provided'
    });
  }

  try {
    // The file is already saved to disk by multer.diskStorage
    // Use req.file.path and req.file.filename directly
    const modelData = {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    const savedModel = await WebConfigurator.create(modelData);

    // Return relative path for client
    const responseModel = savedModel.toObject();
    responseModel.download_Id = savedModel._id;

    return res.status(201).json({
      success: true,
      data: responseModel
    });
  } catch (error) {
    console.error('Error uploading 3D model:', error);

    // Cleanup on error
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process 3D model',
      error: error.message
    });
  }
};

exports.webConfiguratordownloadModel = async (req, res) => {

  try {
    const { id } = req.params;
    const model = await WebConfigurator.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: '3D model not found'
      });
    }

    // Check if file exists
    if (!fs.existsSync(model.path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Set headers for file download
    res.download(model.path, model.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file'
          });
        }
      }
    });
  } catch (error) {
    console.error('Error in downloadModel:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }

}
