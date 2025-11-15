import express from "express";
const router = express.Router();
import { createQRCodeHandler, scanQRCodeHandler } from '../controllers/qrCode.controller.js';
import {getScanConfigHandler, updateScanConfigHandler} from '../controllers/qrScannerConfig.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// QR Code Routes
router.post('/create-qr-code', authMiddleWare, (req, res) => {
  createQRCodeHandler(req, res);
});

router.post('/scan-qr-code', (req, res) => {
  scanQRCodeHandler(req, res);
});

router.post('/save-scan-config', authMiddleWare, (req, res) => {
  updateScanConfigHandler(req, res);
});

router.get('/get-scan-config', authMiddleWare, (req, res) => {
  getScanConfigHandler(req, res);
});


export default router;