import { getScanConfigService, updateScanConfigService } from '../services/qrScannerConfig.service.js';

const updateScanConfigHandler = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const {brandName, logoUrl, redirectUrl, themeColor, description } = req.body;

        const scanConfig = await updateScanConfigService({
            tenantId,
            brandName,
            logoUrl,
            redirectUrl,
            themeColor,
            description
        });

        res.status(200).json(scanConfig);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getScanConfigHandler = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;

        const scanConfig = await getScanConfigService(tenantId);

        res.status(200).json(scanConfig);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export { updateScanConfigHandler, getScanConfigHandler };