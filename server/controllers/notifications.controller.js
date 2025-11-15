import { 
  addNotification as addNotificationService, 
  getNotifications as getNotificationsService, 
  updateRead as updateReadService
} from '../services/notification.service.js';
import jwt from 'jsonwebtoken';

const addNotification = async (req, res, next) => {
  try {
    const token = req.headers['x-jwt-bearer'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.error) {
      return res.status(401).json({ error: decodedToken.error.message });
    }
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const { title, description, tags } = req.body;
    if (!title || !description || !tags) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await addNotificationService(userId, title, description, tags);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const token = req.headers['x-jwt-bearer'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.error) {
      return res.status(401).json({ error: decodedToken.error.message });
    }
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const notifications = await getNotificationsService(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRead = async (req, res, next) => {
  try {
    const token = req.headers['x-jwt-bearer'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.error) {
      return res.status(401).json({ error: decodedToken.error.message });
    }
    const userId = decodedToken.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const { ids } = req.body; // Assuming the array of IDs is now named 'ids'
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await updateReadService(ids, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Update Read Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  addNotification,
  getNotifications,
  updateRead,
};