// server/services/trackbot.tools.js
import {
  addCategoryService,
  getCategoriesService,
  updateCategoryService,
  // deleteCategoryService, // Removed as per instruction
} from "../services/categories.service.js";

import {
  addStatusService,
  getStatusesService,
  updateStatusService,
  // deleteStatusService, // Removed as per instruction
} from "../services/product_status.service.js";

// Assuming a products.service.js exists based on the pattern of other services
// and the products.routes.js context which implies CRUD operations for products.
import {
  createProduct, // Corrected name from createProductService
  getProducts,    // Corrected name from getProductsService
  updateProduct,  // Corrected name from updateProductService
  // bulkProductUpdate, // Corrected name from bulkProductUpdateService, currently commented out
  // deleteProduct,   // Corrected name from deleteProductService, currently commented out
} from "../services/products.service.js";

// New imports for QR Code services - Corrected service names
import {
  createQRCodeService, // Changed from createQRCodeService
  // scanQRCode,   // Changed from scanQRCodeService
} from "../services/qrCode.service.js";

// New imports for Document Center services (assuming these exist based on client-side context) - Corrected service names
// Note: Only get operations are allowed for documents and folders - no add/edit/delete
import {
  getDocumentsService as getDocuments,   // Changed from getDocumentsService
  getFoldersService as getFolders,     // Changed from getFoldersService
} from "../services/documentCenter.service.js"; // Assuming a document.service.js

// New imports for Tenant User services - Corrected service names and spelling
import {
  addTanentUser,    // Changed from addTanentUserService
  getTanentUser,   // Changed from getTanentUserService
  updateTanentUser, // Changed from updateTanentUserService
  addUserRole,   // New: Added for roles
  getUserRoles,  // New: Added for roles
  updateRole, // New: Added for roles
} from "../services/tanentusers.service.js";

export const CUSTOM_TOOLS = {
  addCategory: {
    description: "Adds a new product category to the system.",
    parameters: {
      type: "object",
      properties: {
        category_name: { type: "string", description: "The name of the category to add" },
        // userId and tenantId are passed implicitly by the service layer
      },
      required: ["category_name"],
    },
    execute: async ({ category_name, userId, tenantId }) => {
      console.log("Executing addCategory with:", { category_name, userId, tenantId });
      return await addCategoryService(userId, category_name, tenantId);
    },
  },

  getCategories: {
    description: "Retrieves all product categories for the current tenant.",
    parameters: {
      type: "object",
      properties: {
        // userId and tenantId are passed implicitly by the service layer
      },
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getCategories with:", { userId, tenantId });
      return await getCategoriesService(userId, tenantId);
    },
  },

  updateCategory: {
    description: "Updates an existing product category.",
    parameters: {
      type: "object",
      properties: {
        category_id: { type: "integer", description: "The ID of the category to update" },
        category_name: { type: "string", description: "The new name for the category" },
        // userId and tenantId are passed implicitly by the service layer
      },
      required: ["category_id", "category_name"],
    },
    execute: async ({ category_id, category_name, userId, tenantId }) => {
      console.log("Executing updateCategory with:", { category_id, category_name, userId, tenantId });
      return await updateCategoryService(category_id, category_name, userId, tenantId);
    },
  },

  // Product Status Tools
  addStatus: {
    description: "Adds a new product status to the system.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", description: "The name of the status to add" },
      },
      required: ["status"],
    },
    execute: async ({ status, userId, tenantId }) => {
      console.log("Executing addStatus with:", { status, userId, tenantId });
      return await addStatusService(userId, status, tenantId);
    },
  },

  getStatuses: {
    description: "Retrieves all product statuses for the current tenant.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getStatuses with:", { userId, tenantId });
      return await getStatusesService(userId, tenantId);
    },
  },

  updateStatus: {
    description: "Updates an existing product status.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "integer", description: "The ID of the status to update" },
        status: { type: "string", description: "The new name for the status" },
      },
      required: ["id", "status"],
    },
    execute: async ({ id, status, userId, tenantId }) => {
      console.log("Executing updateStatus with:", { id, status, userId, tenantId });
      return await updateStatusService(id, status, userId, tenantId);
    },
  },

  // deleteStatus tool removed as per instruction

  // Product Tools
  createProduct: {
    description: "Creates a new product in the system with required details.",
    parameters: {
      type: "object",
      properties: {
        product_name: { type: "string", description: "The name of the product" },
        category_id: { type: "integer", description: "The ID of the product's category" },
        manufacturer_id: { type: "integer", description: "The ID of the product's manufacturer" },
        current_owner_id: { type: "integer", description: "The ID of the product's current owner" },
        product_status_id: { type: "integer", description: "The ID of the product's status" },
        image_url: { type: "string", description: "Optional: The URL of the product's image" },
      },
      required: ["product_name", "category_id", "manufacturer_id", "current_owner_id", "product_status_id"],
    },
    execute: async ({ product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId }) => {
      console.log("Executing createProduct with:", { product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId });
      // Corrected function name and parameter passing to match products.service.js
      return await createProduct(userId, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, tenantId);
    },
  },

  getProducts: {
    description: "Retrieves all products for the current tenant. Note: Filters are not supported by the underlying service.",
    parameters: {
      type: "object",
      properties: {
        // The underlying getProductsService does not support filters like search_term, category_id, status_id, limit, offset.
        // It only retrieves all products for the tenant.
      },
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getProducts with:", { userId, tenantId });
      // Corrected function name and parameter passing to match products.service.js
      return await getProducts(userId, tenantId);
    },
  },

  updateProduct: {
    description: "Updates an existing product with all required details. All fields are required by the underlying service for an an update.",
    parameters: {
      type: "object",
      properties: {
        product_id: { type: "integer", description: "The ID of the product to update" },
        product_name: { type: "string", description: "The new name of the product" },
        category_id: { type: "integer", description: "The new category ID for the product" },
        manufacturer_id: { type: "integer", description: "The new manufacturer ID for the product" },
        current_owner_id: { type: "integer", description: "The new current owner ID for the product" },
        product_status_id: { type: "integer", description: "The new status ID for the product" },
        image_url: { type: "string", description: "Optional: The new image URL for the product" },
      },
      required: ["product_id", "product_name", "category_id", "manufacturer_id", "current_owner_id", "product_status_id"],
    },
    execute: async ({ product_id, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId }) => {
      console.log("Executing updateProduct with:", { product_id, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId });
      // Corrected function name and parameter passing to match products.service.js
      return await updateProduct(product_id, product_name, category_id, manufacturer_id, current_owner_id, product_status_id, image_url, userId, tenantId);
    },
  },

  // deleteProduct tool removed as per instruction

  // QR Code Tools - Updated service calls
  createQRCode: {
    description: "Creates a new QR code for a product with specified details and view permissions.",
    parameters: {
      type: "object",
      properties: {
        product_id: { type: "integer", description: "The ID of the product this QR code is associated with." },
        qr_name: { type: "string", description: "A descriptive name for the QR code." },
        view_permission: { type: "integer", description: "The permission level for viewing the QR code. Use -1 for public, or a user_id for restricted access." },
        qr_details: { type: "string", description: "Comma-separated list of product details to include in the QR code scan response (e.g., 'productName,currentOwner,manufacturer,productImage,productStatus,productCategory')." },
      },
      required: ["product_id", "qr_name", "view_permission", "qr_details"],
    },
    execute: async ({ product_id, qr_name, view_permission, qr_details, userId, tenantId }) => {
      console.log("Executing createQRCode with:", { product_id, qr_name, view_permission, qr_details, userId, tenantId });
      return await createQRCodeService({ product_id, qr_name, view_permission, qr_details, tenantId }); // Changed from createQRCodeService
    },
  },

  // Document Center Tools (Read-only: Get only, no add/edit/delete)
  getDocuments: {
    description: "Retrieves all documents for the current tenant. Note: Documents can only be viewed, not added or edited through TrackBot.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getDocuments with:", { userId, tenantId });
      return await getDocuments(userId, tenantId); // Changed from getDocumentsService
    },
  },

  getFolders: {
    description: "Retrieves all folders for the current tenant. Note: Folders can only be viewed, not added or edited through TrackBot.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getFolders with:", { userId, tenantId });
      return await getFolders(userId, tenantId); // Changed from getFoldersService
    },
  },

  // Tenant User Tools (Add, Get, Update, no delete) - Updated service calls and spelling
  addTenantUser: {
    description: "Adds a new user to the current tenant.",
    parameters: {
      type: "object",
      properties: {
        username: { type: "string", description: "The unique username for the new user." },
        email: { type: "string", description: "The email address of the new user." },
        password: { type: "string", description: "The initial password for the new user." },
        location: { type: "string", description: "The location of the new user." },
        first_name: { type: "string", description: "The first name of the new user." },
        last_name: { type: "string", description: "The last name of the new user." },
        phone_number: { type: "string", description: "The phone number of the new user." },
        role_id: { type: "integer", description: "The ID of the role to assign to the new user." },
      },
      required: ["username", "email", "password", "location", "first_name", "last_name", "phone_number", "role_id"],
    },
    execute: async ({ username, email, password, location, first_name, last_name, phone_number, role_id, userId, tenantId }) => {
      console.log("Executing addTenantUser with:", { username, email, password, location, first_name, last_name, phone_number, role_id, userId, tenantId });
      return await addTanentUser(username, email, password, location, first_name, last_name, phone_number, role_id, userId, tenantId); // Changed from addTanentUserService
    },
  },

  getTenantUsers: {
    description: "Retrieves all users for the current tenant.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getTenantUsers with:", { userId, tenantId });
      return await getTanentUser(userId, tenantId); // Changed from getTanentUserService
    },
  },

  updateTenantUser: {
    description: "Updates an existing user's details within the current tenant.",
    parameters: {
      type: "object",
      properties: {
        user_id: { type: "integer", description: "The ID of the user to update." },
        location: { type: "string", description: "The new location of the user." },
        first_name: { type: "string", description: "The new first name of the user." },
        last_name: { type: "string", description: "The new last name of the user." },
        phone_number: { type: "string", description: "The new phone number of the user." },
        role_id: { type: "integer", description: "The new role ID to assign to the user." },
      },
      required: ["user_id", "location", "first_name", "last_name", "phone_number", "role_id"],
    },
    execute: async ({ user_id, location, first_name, last_name, phone_number, role_id, userId, tenantId }) => {
      console.log("Executing updateTenantUser with:", { user_id, location, first_name, last_name, phone_number, role_id, userId, tenantId });
      return await updateTanentUser(user_id, location, first_name, last_name, phone_number, role_id, userId, tenantId); // Changed from updateTanentUserService
    },
  },

  // Tenant Role Tools (New)
  addRole: {
    description: "Adds a new role to the current tenant.",
    parameters: {
      type: "object",
      properties: {
        role_name: { type: "string", description: "The name of the role to add." },
        description: { type: "string", description: "A description for the role (optional)." },
      },
      required: ["role_name"],
    },
    execute: async ({ role_name, description, userId, tenantId }) => {
      console.log("Executing addRole with:", { role_name, description, userId, tenantId });
      return await addUserRole(userId, tenantId, role_name, description);
    },
  },

  getRoles: {
    description: "Retrieves all roles for the current tenant.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async ({ userId, tenantId }) => {
      console.log("Executing getRoles with:", { userId, tenantId });
      return await getUserRoles(userId, tenantId);
    },
  },

  updateRole: {
    description: "Updates an existing role's details within the current tenant.",
    parameters: {
      type: "object",
      properties: {
        role_id: { type: "integer", description: "The ID of the role to update." },
        role_name: { type: "string", description: "The new name for the role." },
        description: { type: "string", description: "The new description for the role (optional)." },
      },
      required: ["role_id", "role_name"],
    },
    execute: async ({ role_id, role_name, description, userId, tenantId }) => {
      console.log("Executing updateRole with:", { role_id, role_name, description, userId, tenantId });
      return await updateRole(userId, tenantId, role_id, role_name, description);
    },
  },
};
