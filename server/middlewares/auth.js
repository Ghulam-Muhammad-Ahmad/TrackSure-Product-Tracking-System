// middleware/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  const token = req.headers['x-jwt-bearer'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id || !decoded?.tenant_id) 
      {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }
    // Verify that the tenant and user exist
    const tenantExists = await prisma.tenants.findUnique({
      where: { tenant_id: decoded.tenant_id },
    });
    if (!tenantExists) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    const userExists = await prisma.users.findUnique({
      where: { user_id: parseInt(decoded.id) },
    });
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    req.user = { id: decoded.id, tenantId: decoded.tenant_id };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export default authMiddleware;