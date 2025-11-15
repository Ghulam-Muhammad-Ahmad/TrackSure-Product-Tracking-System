import express from 'express';
const router = express.Router();
import { uploadDocument } from '../controllers/upload.controller.js';
import authMiddleWare from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure temp directory exists
const tempDir = './temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Keep the original filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  },
});

const uploadDocumentMulter = multer({ 
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit for documents
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for document center
    cb(null, true);
  }
});

const uploadProductImageMulter = multer({ 
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit for product images
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files for products
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for product images'), false);
    }
  }
});

router.post('/document', authMiddleWare, uploadDocumentMulter.single('file'), uploadDocument);
router.post('/product-image', authMiddleWare, uploadProductImageMulter.single('file'), uploadDocument);

export default router;