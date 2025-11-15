import express from "express";
const router = express.Router();
import ActivityLogController from '../controllers/activitylog.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// Activity Log Routes
router.get('/get-logs', authMiddleWare, ActivityLogController.getActivityLogs);

export default router;

