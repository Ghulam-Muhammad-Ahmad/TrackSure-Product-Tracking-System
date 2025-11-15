/**
 * File validation utilities
 */

export const FILE_SIZE_LIMITS = {
  PRODUCT_IMAGE: 3 * 1024 * 1024, // 3MB
  DOCUMENT: 30 * 1024 * 1024, // 30MB
};

export const validateFileSize = (file, maxSize) => {
  if (!file) return { valid: false, error: "No file provided" };
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
};

export const validateImageFile = (file, maxSize = FILE_SIZE_LIMITS.PRODUCT_IMAGE) => {
  if (!file) return { valid: false, error: "No file provided" };
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: "Only image files are allowed" };
  }
  
  // Check file size
  return validateFileSize(file, maxSize);
};

export const validateDocumentFile = (file) => {
  return validateFileSize(file, FILE_SIZE_LIMITS.DOCUMENT);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Map long MIME types to shorter identifiers for database storage
export const getShortFileType = (mimeType) => {
  const typeMap = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/avi': 'avi',
    'video/mov': 'mov',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'text/plain': 'txt',
    'text/csv': 'csv'
  };
  
  return typeMap[mimeType] || mimeType;
};
