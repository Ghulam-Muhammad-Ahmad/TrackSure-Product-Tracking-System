import { createQRCodeService, scanQRCodeService } from '../services/qrCode.service.js';

const createQRCodeHandler = async (req, res) => {
    try {
        const { product_id, qr_name, view_permission, qr_details } = req.body;
        const { tenantId } = req.user;

        const qrCode = await createQRCodeService({
            product_id,
            qr_name,
            view_permission,
            qr_details,
            tenantId
        });

        res.status(201).json(qrCode);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const scanQRCodeHandler = async (req, res) => {
    try {
        const { qr_token } = req.body;
        const { tenantId } = req.body;

        const scanResult = await scanQRCodeService({
            qr_token,
            tenantId
        });

        if (scanResult.success) {
            res.status(200).json(scanResult);
        } else {
            res.status(404).json(scanResult);
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export { createQRCodeHandler, scanQRCodeHandler };