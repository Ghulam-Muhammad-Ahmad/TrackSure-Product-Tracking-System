import express from "express";
const router = express.Router();
import AuthController from '../controllers/auth.controller.js';

router.post('/verify', AuthController.verify);
router.post('/signup', AuthController.signup);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/login', AuthController.login);
router.post('/reset-password', AuthController.resetPassword);
router.get('/profile', AuthController.getProfile);
router.put('/edit-profile', AuthController.editProfile);

export default router;
