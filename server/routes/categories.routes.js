import express from "express";
const router = express.Router();
import CategoriesController from '../controllers/categories.controller.js';
import authMiddleWare from '../middlewares/auth.js';

router.post('/add-category', authMiddleWare, CategoriesController.addCategory);
router.get('/get-categories', authMiddleWare, CategoriesController.getCategories);
router.put('/update-category', authMiddleWare, CategoriesController.updateCategory);
router.delete('/delete-category/:id', authMiddleWare, CategoriesController.deleteCategory);

export default router;
