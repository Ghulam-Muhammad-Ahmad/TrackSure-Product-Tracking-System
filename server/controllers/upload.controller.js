import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path'; // Import path module to get file extension

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadDocument = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary configuration missing. Please check environment variables.' });
    }

    console.log('Uploading file:', req.file.path);

    // Upload as auto so PDFs are handled as raw behind the scenes
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tracksure_documents',
      resource_type: 'auto',       // key for PDFs
      use_filename: true,
      unique_filename: true,
    });

    // Clean up local temp file (ignore errors)
    await fs.unlink(req.file.path).catch(() => {});

    return res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      bytes: result.bytes,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Clean up local temp file on error (ignore errors)
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    
    return res.status(500).json({
      message: 'Error uploading file to Cloudinary',
      error: error.message,
    });
  }
};
