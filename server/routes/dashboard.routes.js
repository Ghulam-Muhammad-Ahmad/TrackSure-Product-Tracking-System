import express from "express";
const router = express.Router();
import DashboardController from '../controllers/dashboard.controller.js';
import authMiddleWare from '../middlewares/auth.js';

router.get('/cards-data', authMiddleWare, DashboardController.cardData);
router.get('/recent-products', authMiddleWare, DashboardController.recentProducts);
router.get('/recent-activities', authMiddleWare, DashboardController.recentActivities);
router.get('/recent-documents', authMiddleWare, DashboardController.recentDocuments);
router.get('/products-by-category', authMiddleWare, DashboardController.productsByCategory);

export default router;