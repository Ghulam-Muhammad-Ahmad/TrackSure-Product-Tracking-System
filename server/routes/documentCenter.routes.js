import express from "express";
const router = express.Router();
import DocumentController from '../controllers/documentCenter.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// Document Routes
router.post('/add-document', authMiddleWare, DocumentController.addDocument);
router.get('/get-documents', authMiddleWare, DocumentController.getDocuments);
router.get('/trash-documents', authMiddleWare, DocumentController.getTrashDocuments);
router.put('/update-document', authMiddleWare, DocumentController.updateDocument);
router.delete('/delete-document/:id', authMiddleWare, DocumentController.deleteDocument);
router.patch('/restore-document/:id', authMiddleWare, DocumentController.restoreDocument);
router.delete('/permanent-delete-document/:id', authMiddleWare, DocumentController.permanentDeleteDocument);

// Folder Routes
router.post('/add-folder', authMiddleWare, DocumentController.addFolder);
router.get('/get-folders', authMiddleWare, DocumentController.getFolders);
router.get('/get-folder-file-counts', authMiddleWare, DocumentController.getFolderFileCounts);
router.put('/update-folder', authMiddleWare, DocumentController.updateFolder);
router.delete('/delete-folder/:id', authMiddleWare, DocumentController.deleteFolder);

export default router;