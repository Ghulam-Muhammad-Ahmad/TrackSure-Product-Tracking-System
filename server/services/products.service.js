import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();
import { logActivity } from "../config/logActivity.js";
import { addNotification } from "../services/notification.service.js";

// 🔹 Shared permission checker
const checkPermission = async (userId, permission) => {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
    include: {
      roles_users_role_idToroles: true,
    },
  });
  if (!user) return null;

  const role = user.roles_users_role_idToroles;
  const permissions = role.permissions || [];
  return permissions.includes(permission);
};

// 🔹 Helper to get tenant ID
const getTenantId = (user) => {
  return user.tenant_id;
};

// ✅ CREATE PRODUCT
const createProductService = async (
  userId,
  product_name,
  category_id,
  manufacturer_id,
  current_owner_id,
  product_status_id,
  image_url,
  tenantId
) => {
  if (
    !userId ||
    !product_name ||
    !category_id ||
    !manufacturer_id ||
    !current_owner_id ||
    !product_status_id ||
    !image_url
  ) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) return { success: false, message: "User does not exist" };

    const hasPermission = await checkPermission(userId, "PRODUCT_CREATE");
    if (!hasPermission) return { success: false, message: "Permission denied" };

    const tenantId = getTenantId(user);

    // Check if product already exists for this tenant
    const existingProduct = await prisma.products.findFirst({
      where: {
        product_name: product_name,
        is_deleted: 0,
        tenant_id: tenantId,
      },
    });
    if (existingProduct)
      return { success: false, message: "Product already exists" };

    const product = await prisma.products.create({
      data: {
        product_name,
        category_id: parseInt(category_id),
        manufacturer_id: parseInt(manufacturer_id),
        current_owner_id: parseInt(current_owner_id),
        product_status_id: parseInt(product_status_id),
        tenant_id: tenantId,
        image_url,
      },
    });

    // Get product status name
    const productStatus = await prisma.product_status.findUnique({
      where: { id: parseInt(product_status_id) },
    });
    const productStatusName = productStatus ? productStatus.status : "Unknown";

    // Send notification to the current owner and manufacturer
    await addNotification(
      current_owner_id,
      "Product Created",
      `Product "${product_name}" created and assigned to you with status ${productStatusName}`,
      ["product", "new"]
    );
    await addNotification(
      manufacturer_id,
      "Product Created",
      `Product "${product_name}" created and assigned to you with status ${productStatusName}`,
      ["product", "new"]
    );

    await logActivity({
      activityName: "Product Created",
      activityDetail: `Product "${product_name}" created by user ${userId} (tenant ${tenantId})`,
      userId: parseInt(userId),
    });

    return {
      success: true,
      message: "Product added successfully",
      id: product.product_id,
    };
  } catch (error) {
    console.error("Create Product Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ GET PRODUCTS
const getProductsService = async (userId, tenantId) => {
  if (!userId) return { success: false, message: "Missing required fields" };

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) return { success: false, message: "User does not exist" };

    const hasPermission = await checkPermission(userId, "PRODUCT_READ");
    if (!hasPermission) return { success: false, message: "Permission denied" };

    const tenantId = getTenantId(user);

    const products = await prisma.products.findMany({
      where: { tenant_id: tenantId, is_deleted: 0 },
      orderBy: { created_at: "desc" },
      include: {
        categories: true,
        users_products_manufacturer_idTousers: true,
        users_products_current_owner_idTousers: true,
        product_status: true,
        documents: {
          where: { 
            product_id: { not: null }
          },
          select: {
            document_id: true,
            filename: true,
            file_type: true,
            uploaded_at: true
          }
        },
      },
    });

    return products.map((p) => ({
      ...p,
      category_name: p.categories.category_name,
      manufacturer_name: p.users_products_manufacturer_idTousers.username,
      current_owner_name: p.users_products_current_owner_idTousers.username,
      product_status: p.product_status.status,
      image_url: p.image_url,
    }));
  } catch (error) {
    console.error("Get Products Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ UPDATE PRODUCT
const updateProductService = async (
  product_id,
  product_name,
  category_id,
  manufacturer_id,
  current_owner_id,
  product_status_id,
  image_url,
  userId,
  tenantId
) => {
  if (
    !product_id ||
    !product_name ||
    !category_id ||
    !manufacturer_id ||
    !current_owner_id ||
    !product_status_id ||
    !userId ||
    !image_url
  ) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) return { success: false, message: "User does not exist" };

    const hasPermission = await checkPermission(userId, "PRODUCT_UPDATE");
    if (!hasPermission) return { success: false, message: "Permission denied" };

    const tenantId = getTenantId(user);

    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(product_id) },
    });

    if (!product || product.tenant_id !== tenantId)
      return { success: false, message: "Unauthorized to update this product" };

    await prisma.products.update({
      where: { product_id: parseInt(product_id) },
      data: {
        product_name,
        category_id: parseInt(category_id),
        manufacturer_id: parseInt(manufacturer_id),
        current_owner_id: parseInt(current_owner_id),
        product_status_id,
        image_url,
      },
    });

    // Check if current owner has changed and send notification if so
    if (product.current_owner_id !== parseInt(current_owner_id)) {
      // Get product status name
      const productStatus = await prisma.product_status.findUnique({
        where: { id: parseInt(product_status_id) },
      });
      const productStatusName = productStatus
        ? productStatus.status
        : "Unknown";

      await addNotification(
        current_owner_id,
        "Product Ownership Changed",
        `Product "${product_name}" ownership changed to you with status ${productStatusName}`,
        ["product", "ownership"]
      );
    }

    // Check if manufacturer has changed and send notification if so
    if (product.manufacturer_id !== parseInt(manufacturer_id)) {
      await addNotification(
        manufacturer_id,
        "Product Manufacturer Changed",
        `Product "${product_name}" manufacturer changed to you`,
        ["product", "manufacturer"]
      );
    }

    await logActivity({
      activityName: "Product Updated",
      activityDetail: `Product ID ${product_id} updated by user ${userId} (tenant ${tenantId})`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("Update Product Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

// ✅ DELETE PRODUCT
const deleteProductService = async (id, userId, tenantId) => {
  if (!id || !userId)
    return { success: false, message: "Missing required fields" };

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });
    if (!user) return { success: false, message: "User does not exist" };

    const hasPermission = await checkPermission(userId, "PRODUCT_DELETE");
    if (!hasPermission) return { success: false, message: "Permission denied" };

    const tenantId = getTenantId(user);

    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(id) },
    });

    if (
      !product || product.tenant_id !== tenantId || product.is_deleted === 1
    ) {
      return { success: false, message: "Unauthorized or already deleted" };
    }

    await prisma.products.update({
      where: { product_id: parseInt(id) },
      data: { is_deleted: 1, deleted_at: new Date() },
    });

    await logActivity({
      activityName: "Product Deleted",
      activityDetail: `Product ID ${id} deleted by user ${userId} (tenant ${tenantId})`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Delete Product Service Error:", error);
    return { success: false, message: "Database error" };
  }
};

const bulkProductUpdateService = async (ids, updates, userId, tenantId) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(userId) },
    });

    if (!user) {
      return { success: false, message: "User does not exist" };
    }

    const hasPermission = await checkPermission(userId, "PRODUCT_UPDATE");
    if (!hasPermission) {
      return { success: false, message: "Permission denied" };
    }

    const tenantId = getTenantId(user);

    // Group products by current owner for permission and batching
    const productsByOwner = {};
    for (const id of ids) {
      const product = await prisma.products.findUnique({
        where: { product_id: parseInt(id) },
      });

      if (!product || product.tenant_id !== tenantId) {
        return {
          success: false,
          message: `Unauthorized to update product ID ${id}`,
        };
      }

      if (!productsByOwner[product.current_owner_id]) {
        productsByOwner[product.current_owner_id] = [];
      }

      productsByOwner[product.current_owner_id].push(product);
    }

    // Track notifications
    const updatedOwners = {};
    const updatedManufacturers = {};

    // Apply updates
    for (const owner in productsByOwner) {
      const products = productsByOwner[owner];

      const dataToUpdate = {};
      if (updates.category_id) {
        dataToUpdate.category_id = parseInt(updates.category_id);
      }
      if (updates.manufacturer_id) {
        dataToUpdate.manufacturer_id = parseInt(updates.manufacturer_id);
      }
      if (updates.current_owner_id) {
        dataToUpdate.current_owner_id = parseInt(updates.current_owner_id);
      }
      if (updates.product_status_id) {
        dataToUpdate.product_status_id = parseInt(updates.product_status_id);
      }

      if (Object.keys(dataToUpdate).length > 0) {
        await prisma.products.updateMany({
          where: { product_id: { in: products.map(p => p.product_id) } },
          data: dataToUpdate,
        });

        if (updates.current_owner_id) {
          const newOwnerId = parseInt(updates.current_owner_id);
          updatedOwners[newOwnerId] = (updatedOwners[newOwnerId] || 0) + products.length;
        }

        if (updates.manufacturer_id) {
          const newManufacturerId = parseInt(updates.manufacturer_id);
          updatedManufacturers[newManufacturerId] = (updatedManufacturers[newManufacturerId] || 0) + products.length;
        }
      }
    }

    // Send ownership notifications (if current_owner_id was in updates)
    if (updates.current_owner_id) {
      for (const ownerId in updatedOwners) {
        const count = updatedOwners[ownerId];
        await addNotification(
          parseInt(ownerId),
          "Products Ownership Changed",
          `Ownership of ${count} product(s) changed and assigned to you`,
          ["product", "ownership"]
        );
      }
    }

    // Send manufacturer notifications (if manufacturer_id was in updates)
    if (updates.manufacturer_id) {
      for (const manufacturerId in updatedManufacturers) {
        const count = updatedManufacturers[manufacturerId];
        await addNotification(
          parseInt(manufacturerId),
          "Products Manufacturer Changed",
          `You have been assigned as manufacturer for ${count} product(s)`,
          ["product", "manufacturer"]
        );
      }
    }

    await logActivity({
      activityName: "Products Updated",
      activityDetail: `Products ${ids.join(", ")} updated by user ${userId} (tenant ${tenantId})`,
      userId: parseInt(userId),
    });

    return { success: true, message: "Products updated successfully" };
  } catch (error) {
    console.error("Bulk Product Update Service Error:", error);
    return { success: false, message: "Database error" };
  }
};


export {
  createProductService as createProduct,
  getProductsService as getProducts,
  updateProductService as updateProduct,
  deleteProductService as deleteProduct,
  bulkProductUpdateService as bulkProductUpdate,
};
