import { PrismaClient } from "../src/generated/prisma/index.js";
import { logActivity } from "../config/logActivity.js";

const prisma = new PrismaClient();

async function checkPermission(userId, tenantId, requiredPermission) {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
    include: { roles_users_role_idToroles: true },
  });
  
  if (!user || user.tenant_id !== tenantId) {
    return { allowed: false, reason: "Unauthorized tenant scope" };
  }
  const hasPermission = (user.roles_users_role_idToroles.permissions || []).includes(requiredPermission);
  return { allowed: hasPermission, user };
}

async function addCategoryService(userId, category_name, tenantId, is_deleted = 0) {
  const { allowed, user, reason } = await checkPermission(userId, tenantId, "CATEGORY_CREATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const exists = await prisma.categories.findFirst({
    where: { tenant_id: tenantId, category_name, is_deleted: 0 },
  });
  if (exists) {
    return { success: false, message: "Category already exists" };
  }

  const category = await prisma.categories.create({
    data: { tenant_id: tenantId, category_name, is_deleted },
  });

  await logActivity({
    activityName: "Category Added",
    activityDetail: `Category '${category_name}' added in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Category added", id: category.category_id };
}

async function getCategoriesService(userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "CATEGORY_READ");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const categories = await prisma.categories.findMany({
    where: { tenant_id: tenantId, is_deleted: 0 },
    orderBy: { created_at: "desc" },
  });

  return categories;
}

async function updateCategoryService(category_id, category_name, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "CATEGORY_UPDATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const category = await prisma.categories.findUnique({
    where: { category_id: parseInt(category_id) },
  });
  if (!category || category.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to update this category" };
  }

  await prisma.categories.update({
    where: { category_id: parseInt(category_id) },
    data: { category_name },
  });

  await logActivity({
    activityName: "Category Updated",
    activityDetail: `Category ID ${category_id} renamed to '${category_name}' in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Category updated successfully" };
}

async function deleteCategoryService(category_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "CATEGORY_DELETE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const category = await prisma.categories.findUnique({
    where: { category_id: parseInt(category_id) },
  });
  if (!category || category.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to delete this category" };
  }
  if (category.is_deleted === 1) {
    return { success: false, message: "Category already deleted" };
  }

  await prisma.categories.update({
    where: { category_id: parseInt(category_id) },
    data: { is_deleted: 1, deleted_at: new Date() },
  });

  await logActivity({
    activityName: "Category Deleted",
    activityDetail: `Category ID ${category_id} soft-deleted in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Category deleted successfully" };
}

export {
  addCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
};
