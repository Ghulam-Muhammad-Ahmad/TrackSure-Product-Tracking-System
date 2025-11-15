import { PrismaClient } from "../src/generated/prisma/index.js";
import { logActivity } from "../config/logActivity.js";

const prisma = new PrismaClient();

async function getCardDataService(userId, tenantId) {
  try {
    // Calculate dates for current and last month for product comparison
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Execute all necessary queries concurrently for optimal performance
    const [
      totalUsers,
      totalDocuments,
      totalFolders,
      totalProducts, // All active products
      productsCreatedThisMonth,
      productsCreatedLastMonth,
      productStatusesRaw, // This will now contain product_status_id and count
    ] = await Promise.all([
      // Fetch total number of active users for the tenant
      prisma.users.count({
        where: { tenant_id: tenantId, is_deleted: 0 },
      }),
      // Fetch total number of active documents for the tenant
      prisma.documents.count({
        where: { tenant_id: tenantId},
      }),
      // Fetch total number of active folders for the tenant
      prisma.document_folders.count({
        where: { tenant_id: tenantId, is_deleted: 0 },
      }),
      // Fetch total number of active products for the tenant
      prisma.products.count({
        where: { tenant_id: tenantId, is_deleted: 0 },
      }),
      // Fetch number of products created in the current month
      prisma.products.count({
        where: {
          tenant_id: tenantId,
          is_deleted: 0,
          created_at: { gte: startOfCurrentMonth },
        },
      }),
      // Fetch number of products created in the last month
      prisma.products.count({
        where: {
          tenant_id: tenantId,
          is_deleted: 0,
          created_at: { gte: startOfLastMonth, lt: startOfCurrentMonth },
        },
      }),
      // Fetch product counts grouped by their status ID
      prisma.products.groupBy({
        by: ['product_status_id'], // Corrected: Group by product_status_id as per schema.prisma
        _count: {
          product_id: true,
        },
        where: {
          tenant_id: tenantId,
          is_deleted: 0,
        },
        orderBy: {
          _count: {
            product_id: 'desc', // Order by count descending to easily find the max
          },
        },
      }),
    ]);

    // Calculate product increase/decrease compared to last month
    const productChange = productsCreatedThisMonth - productsCreatedLastMonth;
    const productChangePercentage = productsCreatedLastMonth > 0
      ? ((productChange / productsCreatedLastMonth) * 100).toFixed(2)
      : (productsCreatedThisMonth > 0 ? 100 : 0); // If last month was 0, and this month > 0, it's 100% increase. If both 0, then 0%.

    // Process product statuses: Fetch status names and combine with counts
    const productStatusIds = productStatusesRaw.map(item => item.product_status_id);

    let productStatuses = [];
    let maxProductStatus = null;

    if (productStatusIds.length > 0) {
      // Fetch the actual status names and colors from the product_status table
      const statusDetails = await prisma.product_status.findMany({
        where: {
          id: { in: productStatusIds },
          tenant_id: tenantId, // Ensure tenant scope for status names
        },
        select: {
          id: true,
          status: true,
          color_hex: true,
        },
      });

      // Create a map for quick lookup of status details by ID
      const statusMap = new Map(statusDetails.map(detail => [detail.id, { status: detail.status, color_hex: detail.color_hex }]));

      // Combine the counts with the status names and colors
      productStatuses = productStatusesRaw.map(item => {
        const statusDetail = statusMap.get(item.product_status_id) || { status: 'Unknown', color_hex: '#6B7280' };
        return {
          status: statusDetail.status,
          color_hex: statusDetail.color_hex,
          count: item._count.product_id,
        };
      });

      // The first element is still the max because productStatusesRaw was ordered by count
      maxProductStatus = productStatuses[0];
    }

    // Log activity for dashboard data access (optional, can be enabled if needed)
    // await logActivity({
    //   activityName: "Dashboard Data Accessed",
    //   activityDetail: `User ${userId} accessed dashboard card data for tenant ${tenantId}`,
    //   userId: parseInt(userId),
    // });

    return {
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        totalFolders,
        totalProducts,
        productsThisMonth: productsCreatedThisMonth,
        productsLastMonth: productsCreatedLastMonth,
        productChange: productChange,
        productChangePercentage: parseFloat(productChangePercentage),
        productStatuses,
        maxProductStatus: maxProductStatus ? maxProductStatus.status : null,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard card data:", error);
    return { success: false, message: "Failed to retrieve dashboard data" };
  }
}

async function getRecentProductsService(userId, tenantId, limit = 5) {
  try {
    const products = await prisma.products.findMany({
      where: {
        tenant_id: tenantId,
        is_deleted: 0,
      },
      include: {
        categories: {
          select: {
            category_name: true,
          },
        },
        users_products_current_owner_idTousers: {
          select: {
            username: true,
            first_name: true,
            last_name: true,
          },
        },
        product_status: {
          select: {
            status: true,
            color_hex: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });

    return {
      success: true,
      data: products.map(product => ({
        id: product.product_id,
        name: product.product_name,
        category: product.categories.category_name,
        owner: `${product.users_products_current_owner_idTousers.first_name} ${product.users_products_current_owner_idTousers.last_name}`.trim() || product.users_products_current_owner_idTousers.username,
        status: product.product_status.status,
        status_color: product.product_status.color_hex,
        image_url: product.image_url,
        created_at: product.created_at,
      })),
    };
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return { success: false, message: "Failed to retrieve recent products" };
  }
}

async function getRecentActivitiesService(userId, tenantId, limit = 10) {
  try {
    const activities = await prisma.activityLog.findMany({
      where: {
        tenant_id: tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return {
      success: true,
      data: activities.map(activity => ({
        id: activity.id,
        action: activity.activityName,
        details: activity.activityDetail,
        user: activity.userName,
        email: activity.email,
        time: activity.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return { success: false, message: "Failed to retrieve recent activities" };
  }
}

async function getRecentDocumentsService(userId, tenantId, limit = 5) {
  try {
    const documents = await prisma.documents.findMany({
      where: {
        tenant_id: tenantId,
        is_deleted: 0,
      },
      include: {
        uploader: {
          select: {
            username: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        uploaded_at: 'desc',
      },
      take: limit,
    });

    return {
      success: true,
      data: documents.map(doc => ({
        id: doc.document_id,
        name: doc.filename,
        type: doc.file_type,
        size: doc.file_size,
        uploader: `${doc.uploader.first_name} ${doc.uploader.last_name}`.trim() || doc.uploader.username,
        uploaded_at: doc.uploaded_at,
        file_url: doc.file_url,
      })),
    };
  } catch (error) {
    console.error("Error fetching recent documents:", error);
    return { success: false, message: "Failed to retrieve recent documents" };
  }
}

async function getProductsByCategoryService(userId, tenantId) {
  try {
    const categoriesWithCount = await prisma.products.groupBy({
      by: ['category_id'],
      _count: {
        product_id: true,
      },
      where: {
        tenant_id: tenantId,
        is_deleted: 0,
      },
      orderBy: {
        _count: {
          product_id: 'desc',
        },
      },
    });

    const categoryIds = categoriesWithCount.map(item => item.category_id);
    
    if (categoryIds.length === 0) {
      return { success: true, data: [] };
    }

    const categories = await prisma.categories.findMany({
      where: {
        category_id: { in: categoryIds },
        tenant_id: tenantId,
      },
      select: {
        category_id: true,
        category_name: true,
      },
    });

    const categoryMap = new Map(categories.map(cat => [cat.category_id, cat.category_name]));
    const totalProducts = categoriesWithCount.reduce((sum, item) => sum + item._count.product_id, 0);

    const result = categoriesWithCount.map(item => ({
      category: categoryMap.get(item.category_id) || 'Unknown',
      count: item._count.product_id,
      percentage: ((item._count.product_id / totalProducts) * 100).toFixed(1),
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { success: false, message: "Failed to retrieve products by category" };
  }
}

export {
  getCardDataService,
  getRecentProductsService,
  getRecentActivitiesService,
  getRecentDocumentsService,
  getProductsByCategoryService,
};
