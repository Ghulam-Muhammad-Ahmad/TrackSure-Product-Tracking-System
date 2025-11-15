 import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import { logActivity } from "../config/logActivity.js";
import { sendUserCreationEmail } from "../config/nodeMailerConfig.js";

// 🔹 Shared helper functions
const checkPermission = async (userId, tenantId, requiredPermission) => {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
    include: { roles_users_role_idToroles: true },
  });
  if (!user || user.tenant_id !== tenantId) {
    return { allowed: false, reason: "Unauthorized tenant scope" };
  }
  const role = user.roles_users_role_idToroles;
  const permissions = role.permissions || [];
  return { allowed: permissions.includes(requiredPermission), user };
};

// ✅ Add Role
const addUserRoleService = async (userId, tenantId, role_name, permissions) => {
  if (!userId || !tenantId || !role_name || !permissions)
    return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "ROLE_CREATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const existingRole = await prisma.roles.findFirst({
      where: { tenant_id: tenantId, role_name },
    });

    if (existingRole) {
      if (existingRole.is_deleted === 1) {
        await prisma.roles.update({
          where: { role_id: existingRole.role_id },
          data: {
            is_deleted: 0,
            permissions,
          },
        });

        await logActivity({
          activityName: "Role Updated",
          activityDetail: `Role ${role_name} updated by user ${userId} in tenant ${tenantId}`,
          userId: parseInt(userId),
        });

        return { success: true, message: "Role updated successfully", id: existingRole.role_id };
      } else {
        return { success: false, message: "Role already exists and is not deleted" };
      }
    } else {
      const role = await prisma.roles.create({
        data: {
          tenant_id: tenantId,
          role_name,
          permissions,
        },
      });

      await logActivity({
        activityName: "Role Added",
        activityDetail: `Role ${role_name} added by user ${userId} in tenant ${tenantId}`,
        userId: parseInt(userId),
      });

      return { success: true, message: "Role added successfully", id: role.role_id };
    }
  } catch (error) {
    console.error("Add Role Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Get Roles
const getUserRolesService = async (userId, tenantId) => {
  if (!userId || !tenantId) return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "ROLE_READ");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    return await prisma.roles.findMany({
      where: { tenant_id: tenantId, is_deleted: 0 },
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Update Role
const updateRoleService = async (role_id, role_name, permissions, userId, tenantId) => {
  if (!role_id || !role_name || !permissions || !userId || !tenantId)
    return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "ROLE_UPDATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const role = await prisma.roles.findUnique({ where: { role_id: parseInt(role_id) } });
    if (!role || role.tenant_id !== tenantId)
      return { success: false, message: "Unauthorized to update this role" };

    await prisma.roles.update({
      where: { role_id: parseInt(role_id) },
      data: { role_name, permissions },
    });

    await logActivity({
      activityName: "Role Updated",
      activityDetail: `Role ${role_name} updated by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Role updated successfully" };
  } catch (error) {
    console.error("Update Role Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Delete Role
const deleteRoleService = async (id, userId, tenantId) => {
  if (!id || !userId || !tenantId) return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "ROLE_DELETE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const role = await prisma.roles.findUnique({ where: { role_id: parseInt(id) } });
    if (!role || role.tenant_id !== tenantId)
      return { success: false, message: "Unauthorized to delete this role" };

    await prisma.roles.update({
      where: { role_id: parseInt(id) },
      data: { is_deleted: 1, deleted_at: new Date() },
    });

    await logActivity({
      activityName: "Role Deleted",
      activityDetail: `Role ${id} deleted by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Role deleted successfully" };
  } catch (error) {
    console.error("Delete Role Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Add Tenant User
const addTanentUserService = async (
  userId,
  tenantId,
  username,
  password,
  email,
  location,
  first_name,
  last_name,
  phone_number,
  role_id
) => {
  if (!userId || !tenantId || !username || !password || !email || !first_name || !last_name || !role_id)
    return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "USER_CREATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure unique username/email
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.is_deleted === 1) {
        const updatedUser = await prisma.users.update({
          where: { user_id: existingUser.user_id },
          data: {
            username: username.trim().toLowerCase(),
            password_hash: hashedPassword,
            email: email.trim().toLowerCase(),
            location,
            first_name,
            last_name,
            phone_number,
            role_id: parseInt(role_id),
            email_verified: true,
            is_deleted: 0,
            tenant_id: tenantId,
          },
        });

        await logActivity({
          activityName: "User Updated",
          activityDetail: `Existing user ${username} reactivated by user ${userId} in tenant ${tenantId}`,
          userId: parseInt(userId),
        });

        await sendUserCreationEmail(username, email, password);
        return { success: true, message: "User updated successfully", user: updatedUser };
      } else if (existingUser.tenant_id === tenantId) {
        return { success: false, message: "User already exists." };
      } else {
        const updatedUser = await prisma.users.update({
          where: { user_id: existingUser.user_id },
          data: {
            username: username.trim().toLowerCase(),
            password_hash: hashedPassword,
            email: email.trim().toLowerCase(),
            location,
            first_name,
            last_name,
            phone_number,
            role_id: parseInt(role_id),
            email_verified: true,
            is_deleted: 0,
            tenant_id: tenantId,
          },
        });

        await logActivity({
          activityName: "User Updated",
          activityDetail: `Existing user ${username} reactivated by user ${userId} in tenant ${tenantId}`,
          userId: parseInt(userId),
        });

        await sendUserCreationEmail(username, email, password);
        return { success: true, message: "User updated successfully", user: updatedUser };
      }
    } else {
      const newUser = await prisma.users.create({
        data: {
          username: username.trim().toLowerCase(),
          password_hash: hashedPassword,
          email: email.trim().toLowerCase(),
          location,
          first_name,
          last_name,
          phone_number,
          role_id: parseInt(role_id),
          email_verified: true,
          tenant_id: tenantId,
        },
      });

      await logActivity({
        activityName: "User Added",
        activityDetail: `User ${username} added by user ${userId} in tenant ${tenantId}`,
        userId: parseInt(userId),
      });

      await sendUserCreationEmail(username, email, password);
      return { success: true, message: "User added successfully", user: newUser };
    }
  } catch (error) {
    console.error("Add Tenant User Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Get Tenant Users
const getTanentUserService = async (userId, tenantId) => {
  if (!userId || !tenantId) return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "USER_READ");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    return await prisma.users.findMany({
      where: { tenant_id: tenantId, is_deleted: 0 },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Get Tenant User Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Update Tenant User
const updateTanentUserService = async (
  user_id,
  location,
  first_name,
  last_name,
  phone_number,
  role_id,
  ownerUserId,
  tenantId
) => {
  if (!user_id || !location || !first_name || !last_name || !phone_number || !role_id || !ownerUserId || !tenantId)
    return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(ownerUserId, tenantId, "USER_UPDATE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const targetUser = await prisma.users.findUnique({ where: { user_id: parseInt(user_id) } });
    if (!targetUser || targetUser.tenant_id !== tenantId)
      return { success: false, message: "Unauthorized to update this user" };

    await prisma.users.update({
      where: { user_id: parseInt(user_id) },
      data: { location, first_name, last_name, phone_number, role_id: parseInt(role_id) },
    });

    await logActivity({
      activityName: "User Updated",
      activityDetail: `User ${first_name} ${last_name} updated by user ${ownerUserId} in tenant ${tenantId}`,
      userId: parseInt(ownerUserId),
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Update Tenant User Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ Delete Tenant User
const deleteTanentUserService = async (id, userId, tenantId) => {
  if (!id || !userId || !tenantId) return { success: false, message: "Missing required fields" };

  try {
    const { allowed, user } = await checkPermission(userId, tenantId, "USER_DELETE");
    if (!allowed) return { success: false, message: allowed.reason || "Permission denied" };

    const targetUser = await prisma.users.findUnique({ where: { user_id: parseInt(id) } });
    if (!targetUser || targetUser.tenant_id !== tenantId)
      return { success: false, message: "Unauthorized to delete this user" };

    await prisma.users.update({
      where: { user_id: parseInt(id) },
      data: { is_deleted: 1, deleted_at: new Date() },
    });

    await logActivity({
      activityName: "User Deleted",
      activityDetail: `User ${id} deleted by user ${userId} in tenant ${tenantId}`,
      userId: parseInt(userId),
    });

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete Tenant User Error:", error);
    return { success: false, message: "Database error" };
  }
};

export {
  addUserRoleService as addUserRole,
  getUserRolesService as getUserRoles,
  updateRoleService as updateRole,
  deleteRoleService as deleteRole,
  addTanentUserService as addTanentUser,
  getTanentUserService as getTanentUser,
  updateTanentUserService as updateTanentUser,
  deleteTanentUserService as deleteTanentUser,
};
