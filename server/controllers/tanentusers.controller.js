import { 
  addUserRole as addUserRoleService, 
  getUserRoles as getUserRolesService, 
  updateRole as updateRoleService, 
  deleteRole as deleteRoleService,
  addTanentUser as addTanentUserService, 
  getTanentUser as getTanentUserService, 
  updateTanentUser as updateTanentUserService, 
  deleteTanentUser as deleteTanentUserService
} from '../services/tanentusers.service.js';
import jwt from 'jsonwebtoken';
const addUserRole = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const role_name = req.body.role_name.toLowerCase().trim();
    const permissions = req.body.permissions;
    if (role_name === 'user' || role_name === 'admin') {
      return res.status(400).json({ error: 'Role cannot be User or Admin' });
    }
    const result = await addUserRoleService(userId, tenantId, role_name, permissions);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create Tenant User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserRoles = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const userRoles = await getUserRolesService(userId, tenantId);
    res.status(200).json(userRoles);
  } catch (error) {
    console.error('Get User Roles Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { role_id, role_name, permissions } = req.body;
    const result = await updateRoleService(role_id, role_name, permissions, userId, tenantId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Update Role Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

 const deleteRole = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { id } = req.params; // Get id from the URL
    const result = await deleteRoleService(id, userId, tenantId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete Role Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const addTanentUser = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { username, password, email, location, first_name, last_name, phone_number, role_id } = req.body;
    if (!username || !password || !email || !first_name || !last_name || !role_id) {
      return res.status(400).json({ error: 'Missing required fields from controller' });
    }
    const result = await addTanentUserService(userId, tenantId, username, password, email, location, first_name, last_name, phone_number, role_id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create Tanent User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTanentUser = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const tanentUser = await getTanentUserService(userId, tenantId);
    res.status(200).json(tanentUser);
  } catch (error) {
    console.error('Get Tanent User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTanentUser = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { user_id, location, first_name, last_name, phone_number, role_id } = req.body;
    const result = await updateTanentUserService(user_id, location, first_name, last_name, phone_number, role_id, userId, tenantId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Update Tanent User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTanentUser = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { id } = req.params;
    const result = await deleteTanentUserService(id, userId, tenantId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete Tanent User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export default {
  addUserRole,
  getUserRoles,
  updateRole,
  deleteRole,
  addTanentUser,
  getTanentUser,
  updateTanentUser,
  deleteTanentUser,
};
