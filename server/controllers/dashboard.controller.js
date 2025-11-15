import { 
  getCardDataService,
  getRecentProductsService,
  getRecentActivitiesService,
  getRecentDocumentsService,
  getProductsByCategoryService
} from '../services/dashboard.service.js';

const cardData = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const dashboardData = await getCardDataService(userId, tenantId); 
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Dashboard Card Data Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const recentProducts = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const limit = parseInt(req.query.limit) || 5;
    const products = await getRecentProductsService(userId, tenantId, limit);
    res.status(200).json(products);
  } catch (error) {
    console.error('Recent Products Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const recentActivities = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const limit = parseInt(req.query.limit) || 10;
    const activities = await getRecentActivitiesService(userId, tenantId, limit);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Recent Activities Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const recentDocuments = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const limit = parseInt(req.query.limit) || 5;
    const documents = await getRecentDocumentsService(userId, tenantId, limit);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Recent Documents Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const productsByCategory = async (req, res, next) => {
  try {
    const { id: userId, tenantId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }
    const categories = await getProductsByCategoryService(userId, tenantId);
    res.status(200).json(categories);
  } catch (error) {
    console.error('Products By Category Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default {
  cardData,
  recentProducts,
  recentActivities,
  recentDocuments,
  productsByCategory,
};