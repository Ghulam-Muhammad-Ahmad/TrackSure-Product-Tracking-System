import { 
    addStatusService, 
    getStatusesService, 
   updateStatusService, 
   deleteStatusService
  } from '../services/product_status.service.js';
import jwt from 'jsonwebtoken';
  
  const addStatus = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { status, color_hex } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await addStatusService(userId, status, tenantId, color_hex);
      res.status(201).json(result);
    } catch (error) {
      console.error('Create Status Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getStatuses = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const statuses = await getStatusesService(userId, tenantId);
      res.status(200).json(statuses);
    } catch (error) {
      console.error('Get Statuses Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updateStatus = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { id, status, color_hex } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await updateStatusService(id, status, userId, tenantId, color_hex);
      res.status(200).json(result);
    } catch (error) {
      console.error('Update Status Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteStatus = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { id } = req.params; // Get id from the URL
      const result = await deleteStatusService(id, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Delete Status Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  export default {
    addStatus,
    getStatuses,
    updateStatus,
    deleteStatus,
  };