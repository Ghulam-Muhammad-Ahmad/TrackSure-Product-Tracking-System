import { 
    addCategoryService, 
    getCategoriesService, 
    updateCategoryService, 
    deleteCategoryService
  } from '../services/categories.service.js';
  
  const addCategory = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { category_name } = req.body;
      if (!category_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await addCategoryService(userId, category_name, tenantId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getCategories = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const categories = await getCategoriesService(userId, tenantId);
      res.status(200).json(categories);
    } catch (error) {
      console.error('Get Categories Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updateCategory = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { category_id, category_name } = req.body;
      if (!category_id || !category_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await updateCategoryService(category_id, category_name, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Update Category Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteCategory = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { id } = req.params; // Get id from the URL
      const result = await deleteCategoryService(id, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Delete Category Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  export default {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
  };