import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

/**
 * Logs an activity for a user by their ID.
 * @param {Object} param0
 * @param {string} param0.activityName
 * @param {string} param0.activityDetail
 * @param {number} param0.userId
 */
const logActivity = async ({ activityName, activityDetail, userId }) => {
    console.log(userId + " " + activityDetail);
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { username: true, email: true, tenant_id: true },
    });

    if (!user) {
      console.warn(`No user found for userId: ${userId}`);
      return;
    }

    await prisma.activityLog.create({
      data: {
        activityName,
        userName: user.username,
        email: user.email,
        activityDetail,
        tenant_id: user.tenant_id,
      },
    });
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
};

export { logActivity };