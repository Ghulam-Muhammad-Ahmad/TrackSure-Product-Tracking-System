import express from "express";
const router = express.Router();
import ProductStatusController from '../controllers/product_status.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// Status Routes
router.post('/add-status', authMiddleWare, ProductStatusController.addStatus);
router.get('/get-statuses', authMiddleWare, ProductStatusController.getStatuses);
router.put('/update-status', authMiddleWare, ProductStatusController.updateStatus);
router.delete('/delete-status/:id', authMiddleWare, ProductStatusController.deleteStatus);

export default router;
