import express from 'express';
import NotificationsController from '../controllers/notifications.controller.js';

// Notification Routes
const router = express.Router();
router.post('/add-notification', NotificationsController.addNotification);
router.get('/get-notifications', NotificationsController.getNotifications);
router.put('/update-read', NotificationsController.updateRead);

export default router;
