import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import { broadcastNotification } from "../config/websocket.js";

export const addNotification = async (userId, title, description, tags) => {
  if (!userId || !title || !description || !tags) {
    console.log("Missing required notification data");
    return { success: false, message: "Missing required fields" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) {
      console.log("User does not exist");
      return { success: false, message: "User does not exist" };
    }

    const newNotification = await prisma.notification.create({
      data: {
        title: title,
        description: description,
        tags: tags,
        user_id: userId,
        read: false
      },
    });

    console.log("Notification added successfully", newNotification.id);
    const notifications = await getNotifications(userId);
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === newNotification.id) {
        notification.toShow = true;
      }
      return notification;
    });
    broadcastNotification(userId, updatedNotifications); // Broadcast all notifications with userId
    return {
      success: true,
      message: "Notification added successfully",
      id: newNotification.id,
    };
  } catch (error) {
    console.error("Add Notification Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const getNotifications = async (userId) => {
  if (!userId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Get Notifications Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const updateRead = async (ids, userId) => {
  if (!ids || !userId) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }

    const notifications = await prisma.notification.findMany({
      where: { id: Array.isArray(ids) ? { in: ids.map(id => parseInt(id)) } : { equals: parseInt(ids) } },
    });

    if (notifications.some(notification => notification.user_id !== userId)) {
      return { success: false, message: "Unauthorized to update these notifications" };
    }

    await prisma.notification.updateMany({
      where: { id: Array.isArray(ids) ? { in: ids.map(id => parseInt(id)) } : { equals: parseInt(ids) } },
      data: {
        read: true,
      },
    });

    console.log("Notifications updated successfully");
    const updatedNotifications = await getNotifications(userId);
    broadcastNotification(userId, updatedNotifications); // Broadcast all notifications with userId
    return { success: true, message: "Notifications updated successfully" };
  } catch (error) {
    console.error("Update Notifications Service Error:", error);
    return { success: false, message: "Database error" };
  }
};
