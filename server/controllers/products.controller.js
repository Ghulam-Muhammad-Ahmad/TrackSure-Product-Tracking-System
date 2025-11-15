import { 
    createProduct as createProductService, 
    getProducts as getProductsService, 
    updateProduct as updateProductService, 
    deleteProduct as deleteProductService,
    bulkProductUpdate as bulkProductUpdateService
  } from '../services/products.service.js';
import jwt from 'jsonwebtoken';
  
  const createProduct = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url } = req.body;
      if (!product_name || !category_id || !manufacturer_id || !current_owner_id || !product_status_id || !image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await createProductService(userId, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, tenantId);
      res.status(201).json(result);
    } catch (error) {
      console.error('Create Product Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getProducts = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const products = await getProductsService(userId, tenantId);
      res.status(200).json(products);
    } catch (error) {
      console.error('Get Products Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updateProduct = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { product_id, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url } = req.body;
      if (!product_id || !product_name || !category_id || !manufacturer_id || !current_owner_id || !product_status_id || !image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const result = await updateProductService(product_id, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Update Product Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteProduct = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }
      const { id } = req.params; // Get id from the URL
      const result = await deleteProductService(id, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Delete Product Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const bulkProductUpdate = async (req, res) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Invalid user ID" });
      }
      const { ids, updates } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No product IDs provided" });
      }
      if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: "No updates provided" });
      }
      const result = await bulkProductUpdateService(ids, updates, userId, tenantId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Bulk Product Update Controller Error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
  export default {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    bulkProductUpdate,
  };