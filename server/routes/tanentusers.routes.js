import express from "express";
const router = express.Router();
import TanentUsersController from '../controllers/tanentusers.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// Role Routes
router.post('/add-role', authMiddleWare, TanentUsersController.addUserRole  );
router.get('/get-roles', authMiddleWare, TanentUsersController.getUserRoles  );
router.put('/update-role', authMiddleWare, TanentUsersController.updateRole  );
router.delete('/delete-role/:id', authMiddleWare, TanentUsersController.deleteRole  );

// User Routes
router.post('/add-tanentuser', authMiddleWare, TanentUsersController.addTanentUser  );
router.get('/get-tanentusers', authMiddleWare, TanentUsersController.getTanentUser  );
router.put('/update-tanentuser', authMiddleWare, TanentUsersController.updateTanentUser  );
router.delete('/delete-tanentuser/:id', authMiddleWare, TanentUsersController.deleteTanentUser  );

export default router;
