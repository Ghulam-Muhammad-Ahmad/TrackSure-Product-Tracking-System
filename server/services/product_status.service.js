import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import { logActivity } from "../config/logActivity.js";

export const checkPermission = async (userId, tenantId, permission) => {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
    include: {
      roles_users_role_idToroles: true,
    },
  });
  if (!user || user.tenant_id !== tenantId) return { allowed: false, reason: "Unauthorized tenant scope" };

  const role = user.roles_users_role_idToroles;
  const permissions = role.permissions || [];
  return { allowed: permissions.includes(permission), user };
};

export const getParentId = (user) => {
  return user.created_by ? user.created_by : user.user_id;
};

export const addStatusService = async (userId, status, tenantId, colorHex = "#6B7280") => {
  if (!userId || !tenantId || !status) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "PRODUCT_STATUS_CREATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const existingStatus = await prisma.product_status.findFirst({
      where: {
        status: status,
        is_deleted: 0,
        tenant_id: tenantId,
      },
    });
    if (existingStatus) {
      return { success: false, message: "Status already exists" };
    }

    const newStatus = await prisma.product_status.create({
      data: {
        status: status,
        color_hex: colorHex,
        is_deleted: 0,
        tenant_id: tenantId,
      },
    });

    await logActivity({
      activityName: "Status Added",
      activityDetail: `Status "${status}" added by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return {
      success: true,
      message: "Status added successfully",
      id: newStatus.id,
    };
  } catch (error) {
    console.error("Add Status Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const getStatusesService = async (userId, tenantId) => {
  if (!userId || !tenantId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "PRODUCT_STATUS_READ");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const statuses = await prisma.product_status.findMany({
      where: {
        tenant_id: tenantId,
        is_deleted: 0,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return statuses;
  } catch (error) {
    console.error("Get Statuses Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const updateStatusService = async (id, status, userId, tenantId, colorHex) => {
  if (!id || !status || !userId || !tenantId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "PRODUCT_STATUS_UPDATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const statusRecord = await prisma.product_status.findUnique({
      where: { id: parseInt(id) },
    });

    if (!statusRecord || statusRecord.tenant_id !== tenantId) {
      return { success: false, message: "Unauthorized to update this status" };
    }

    const updateData = {
      status: status,
    };
    
    if (colorHex) {
      updateData.color_hex = colorHex;
    }

    await prisma.product_status.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    await logActivity({
      activityName: "Status Updated",
      activityDetail: `Status ID ${id} updated by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Status updated successfully" };
  } catch (error) {
    console.error("Update Status Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const deleteStatusService = async (id, userId, tenantId) => {
  if (!id || !userId || !tenantId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "PRODUCT_STATUS_DELETE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const status = await prisma.product_status.findUnique({
      where: { id: parseInt(id) },
    });

    if (!status || status.tenant_id !== tenantId || status.is_deleted === 1) {
      return { success: false, message: "Unauthorized or already deleted" };
    }

    await prisma.product_status.update({
      where: { id: parseInt(id) },
      data: {
        is_deleted: 1,
        updated_at: new Date(),
      },
    });

    await logActivity({
      activityName: "Status Deleted",
      activityDetail: `Status ID ${id} deleted by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Status deleted successfully" };
  } catch (error) {
    console.error("Delete Status Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export default {
  addStatus: addStatusService,
  getStatuses: getStatusesService,
  updateStatus: updateStatusService,
  deleteStatus: deleteStatusService,
};
