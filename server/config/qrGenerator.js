import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const generateQRCode = async (secureToken, tenantId) => {
    // Ensure temp folder exists
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create unique file name
    const fileName = `${Date.now()}_qrcode.png`;
    const filePath = path.join(tempDir, fileName);

    // Generate QR code URL
    const qrCodeUrl = `${process.env.FRONTEND_URL}scan/${tenantId}/?token=${secureToken}`;

    // Generate QR code and save to file
    await QRCode.toFile(filePath, qrCodeUrl, {
        type: "png",
        width: 300
    });

    return filePath; // return full path to be used in service
};
