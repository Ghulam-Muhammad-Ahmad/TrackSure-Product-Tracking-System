  import {getActivityLogsService } from '../services/activitylog.service.js';
  import jwt from 'jsonwebtoken';
  
  const getActivityLogs = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      const activityLogs = await getActivityLogsService(userId, tenantId);
      res.status(200).json(activityLogs);
    } catch (error) {
      console.error('Get Activity Logs Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  export default { getActivityLogs };