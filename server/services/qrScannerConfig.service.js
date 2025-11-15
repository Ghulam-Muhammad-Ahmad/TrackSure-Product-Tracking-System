 import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

// ✅ UPDATE QR SCANNER CONFIG
const updateScanConfigService = async ({ tenantId, brandName, logoUrl, redirectUrl, themeColor, description }) => {
  if (!tenantId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // 1. Validate tenant exists
    const tenant = await prisma.tenants.findUnique({
      where: { tenant_id: tenantId },
      select: {
        tenant_id: true,
        tenant_name: true,
        brandName: true,
        logoUrl: true,
        redirectUrl: true,
        themeColor: true,
        description: true,
        is_deleted: true,
        deleted_at: true,
        created_at: true,
      }
    });
    if (!tenant) return { success: false, message: "Tenant not found" };

    // 2. Update scan config
    const scanConfig = await prisma.tenants.update({
      where: { tenant_id: tenantId },
      data: {
        brandName,
        logoUrl,
        redirectUrl,
        themeColor,
        description
      }
    });

    return { success: true, message: "Scan config updated successfully", scanConfig };
  } catch (error) {
    console.error("Update Scan Config Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ GET QR SCANNER CONFIG
const getScanConfigService = async (tenantId) => {
  if (!tenantId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // 1. Validate tenant exists and get scan config
    const tenant = await prisma.tenants.findUnique({
      where: { tenant_id: tenantId },
      select: {
        tenant_id: true,
        brandName: true,
        logoUrl: true,
        redirectUrl: true,
        themeColor: true,
        description: true,
      }
    });
    if (!tenant) return { success: false, message: "Tenant not found" };

    return { success: true, message: "Scan config fetched successfully", scanConfig: tenant };
  } catch (error) {
    console.error("Get Scan Config Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export { updateScanConfigService, getScanConfigService };
