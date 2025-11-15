const BASE_URL = "http://localhost:5000/"; // Change this if deployed

const API = {
  SIGNUP: `${BASE_URL}auth/signup`,
  LOGIN: `${BASE_URL}auth/login`,
  USER_PROFILE: `${BASE_URL}auth/profile`,
  LOGOUT: `${BASE_URL}logout`,
  VERIFYUSERNAME: `${BASE_URL}auth/verify`,
  VERIFY_EMAIL: `${BASE_URL}auth/verify-email`,
  EDIT_PROFILE: `${BASE_URL}auth/edit-profile`,
  RESET_PASSWORD: `${BASE_URL}auth/reset-password`,
  // Roles Apis
  ADD_ROLE: `${BASE_URL}user/add-role`,
  GET_ROLES: `${BASE_URL}user/get-roles`,
  UPDATE_ROLE: `${BASE_URL}user/update-role`,
  DELETE_ROLE: `${BASE_URL}user/delete-role`,
  // Tanent users Apis
  ADD_TANENTUSER: `${BASE_URL}user/add-tanentuser`,
  GET_TANENTUSERS: `${BASE_URL}user/get-tanentusers`,
  UPDATE_TANENTUSER: `${BASE_URL}user/update-tanentuser`,
  DELETE_TANENTUSER: `${BASE_URL}user/delete-tanentuser`,
  // Tanent categories Apis
  ADD_TANENTCATEGORY: `${BASE_URL}categories/add-category`,
  GET_TANENTCATEGORIES: `${BASE_URL}categories/get-categories`,
  UPDATE_TANENTCATEGORY: `${BASE_URL}categories/update-category`,
  DELETE_TANENTCATEGORY: `${BASE_URL}categories/delete-category`,
  // Products Apis
  CREATE_PRODUCT: `${BASE_URL}products/create-product`,
  GET_PRODUCTS: `${BASE_URL}products/get-products`,
  UPDATE_PRODUCT: `${BASE_URL}products/update-product`,
  DELETE_PRODUCT: `${BASE_URL}products/delete-product`,
  BULK_PRODUCT_EDIT: `${BASE_URL}products/bulk-product-update`,

  // Product Status Apis
  ADD_STATUS: `${BASE_URL}product_status/add-status`,
  GET_STATUSES: `${BASE_URL}product_status/get-statuses`,
  UPDATE_STATUS: `${BASE_URL}product_status/update-status`,
  DELETE_STATUS: `${BASE_URL}product_status/delete-status`,

  // ActivityLogs
  GET_ACTIVITYLOGS:`${BASE_URL}activity-logs/get-logs`,

  //notification ws
  NOTIFY_WS: `ws://localhost:5000`,
  NOTIFICATION_UPDATE_READ:`${BASE_URL}notifications/update-read`,

  //Qr Codes
  QR_GENERATE:`${BASE_URL}qrcode/create-qr-code`,
  QR_SCAN: `${BASE_URL}qrcode/scan-qr-code`,
  QR_SCAN_CONFIG_SAVE: `${BASE_URL}qrcode/save-scan-config`,
  QR_SCAN_CONFIG_GET: `${BASE_URL}qrcode/get-scan-config`,

  //Document Center 
  ADD_DOCUMENT: `${BASE_URL}docs/add-document`,
  GET_DOCUMENTS: `${BASE_URL}docs/get-documents`,
  GET_TRASH_DOCUMENTS: `${BASE_URL}docs/trash-documents`,
  UPDATE_DOCUMENT: `${BASE_URL}docs/update-document`,
  DELETE_DOCUMENT: `${BASE_URL}docs/delete-document`,
  RESTORE_DOCUMENT: `${BASE_URL}docs/restore-document`,
  PERMANENT_DELETE_DOCUMENT: `${BASE_URL}docs/permanent-delete-document`,
  ADD_FOLDER: `${BASE_URL}docs/add-folder`,
  GET_FOLDERS: `${BASE_URL}docs/get-folders`,
  GET_FOLDER_FILE_COUNTS: `${BASE_URL}docs/get-folder-file-counts`,
  UPDATE_FOLDER: `${BASE_URL}docs/update-folder`,
  DELETE_FOLDER: `${BASE_URL}docs/delete-folder`,

  // Cloudinary Upload
  UPLOAD_DOCUMENT_CLOUDINARY: `${BASE_URL}upload/document`,
  UPLOAD_PRODUCT_IMAGE_CLOUDINARY: `${BASE_URL}upload/product-image`,

  // TrackBot Chat Apis
  GET_CHATS: `${BASE_URL}trackbot/chats`,
  CREATE_CHAT: `${BASE_URL}trackbot/chats`,
  DELETE_CHAT: `${BASE_URL}trackbot/chats/`,
  SEND_MESSAGE: `${BASE_URL}trackbot/send-message`,

  // Dashboard Analytics
  DASHBOARD_CARDS: `${BASE_URL}dashboard/cards-data`,
  DASHBOARD_RECENT_PRODUCTS: `${BASE_URL}dashboard/recent-products`,
  DASHBOARD_RECENT_ACTIVITIES: `${BASE_URL}dashboard/recent-activities`,
  DASHBOARD_RECENT_DOCUMENTS: `${BASE_URL}dashboard/recent-documents`,
  DASHBOARD_PRODUCTS_BY_CATEGORY: `${BASE_URL}dashboard/products-by-category`,
};

export { BASE_URL, API };
