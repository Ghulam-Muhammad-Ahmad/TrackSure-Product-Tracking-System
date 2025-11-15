  import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

const getActivityLogsService = async (userId, tenantId) => {
  if (!tenantId) {
    return { success: false, message: "Missing required fields" };
  }
  try {
    // Check if the tenant has any activity logs
    const activityLogs = await prisma.ActivityLog.findMany({
      where: {
        tenant_id: tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (activityLogs.length === 0) {
      return { success: false, message: "No activity logs found for this tenant" };
    }
    return activityLogs;
  } catch (error) {
    console.error("Get Activity Logs Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export { getActivityLogsService };
