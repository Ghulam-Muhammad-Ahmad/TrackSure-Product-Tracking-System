import express from 'express';
const router = express.Router();
import authMiddleWare from '../middlewares/auth.js';
import TrackBotController from '../controllers/trackbot.controller.js';

router.get('/chats', authMiddleWare, TrackBotController.getChats);
router.post('/chats', authMiddleWare, TrackBotController.createChat);
router.delete('/chats/:chatId', authMiddleWare, TrackBotController.deleteChat);
router.post('/send-message', authMiddleWare, TrackBotController.sendMessage);
export default router;