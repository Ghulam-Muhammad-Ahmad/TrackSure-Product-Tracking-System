import express from "express";
const router = express.Router();
import ProductsController from '../controllers/products.controller.js';
import authMiddleWare from '../middlewares/auth.js';

// Product Routes
router.post('/create-product', authMiddleWare, ProductsController.createProduct);
router.get('/get-products', authMiddleWare, ProductsController.getProducts);
router.put('/update-product/', authMiddleWare, ProductsController.updateProduct);
router.put('/bulk-product-update/', authMiddleWare, ProductsController.bulkProductUpdate);
router.delete('/delete-product/:id', authMiddleWare, ProductsController.deleteProduct);

export default router;
