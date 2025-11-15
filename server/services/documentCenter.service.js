import { PrismaClient } from "../src/generated/prisma/index.js";
import { logActivity } from "../config/logActivity.js";

const prisma = new PrismaClient();

async function checkPermission(userId, tenantId, requiredPermission) {
  const user = await prisma.users.findUnique({
    where: { user_id: parseInt(userId) },
    include: { roles_users_role_idToroles: true },
  });
  
  if (!user || user.tenant_id !== tenantId) {
    return { allowed: false, reason: "Unauthorized tenant scope" };
  }
  const hasPermission = (user.roles_users_role_idToroles.permissions || []).includes(requiredPermission);
  return { allowed: hasPermission, user };
}

async function addDocumentService(userId, filename, file_url, file_type, file_size, folder_id, tenantId, tags, permissions, product_id) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_CREATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const document = await prisma.documents.create({
    data: { 
      tenant_id: tenantId, 
      filename, 
      file_url, 
      file_type, 
      file_size, 
      folder_id, 
      uploader_id: userId, 
      tags, 
      permissions, 
      product_id: product_id ? parseInt(product_id) : null, 
    },
  });

  await logActivity({
    activityName: "Document Added",
    activityDetail: `Document '${filename}' added in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Document added", id: document.document_id };
}

async function getDocumentsService(userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_READ");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const documents = await prisma.documents.findMany({
    where: { 
      tenant_id: tenantId,
      OR: [
        { is_deleted: 0 },
        { is_deleted: null }
      ]
    },
    include: {
      uploader: {
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      product: {
        select: {
          product_id: true,
          product_name: true,
        },
      },
      folder: {
        select: {
          folder_id: true,
          name: true,
        },
      },
    },
    orderBy: { uploaded_at: "desc" },
  });

  return documents;
}

async function updateDocumentService(document_id, filename, file_url, file_type, file_size, folder_id, userId, tenantId, tags, permissions, product_id) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_UPDATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const document = await prisma.documents.findUnique({
    where: { document_id: parseInt(document_id) },
  });
  if (!document || document.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to update this document" };
  }
  if (document.is_deleted) {
    return { success: false, message: "Cannot update a document that is in trash" };
  }

  await prisma.documents.update({
    where: { document_id: parseInt(document_id) },
    data: { 
      filename, 
      file_url, 
      file_type, 
      file_size, 
      folder_id, 
      tags, 
      permissions, 
      product_id: product_id ? parseInt(product_id) : null, 
    },
  });

  await logActivity({
    activityName: "Document Updated",
    activityDetail: `Document ID ${document_id} updated in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Document updated successfully" };
}

async function deleteDocumentService(document_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_DELETE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const document = await prisma.documents.findUnique({
    where: { document_id: parseInt(document_id) },
  });
  if (!document || document.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to delete this document" };
  }

  await prisma.documents.update({
    where: { document_id: parseInt(document_id) },
    data: {
      is_deleted: 1,
      deleted_at: new Date(),
    },
  });

  await logActivity({
    activityName: "Document Deleted",
    activityDetail: `Document ID ${document_id} moved to trash in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Document moved to trash" };
}

async function getTrashDocumentsService(userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_READ");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  return prisma.documents.findMany({
    where: { tenant_id: tenantId, is_deleted: 1 },
    include: {
      uploader: {
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      product: {
        select: {
          product_id: true,
          product_name: true,
        },
      },
      folder: {
        select: {
          folder_id: true,
          name: true,
        },
      },
    },
    orderBy: { deleted_at: "desc" },
  });
}

async function restoreDocumentService(document_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_DELETE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const document = await prisma.documents.findUnique({
    where: { document_id: parseInt(document_id) },
  });
  if (!document || document.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to restore this document" };
  }
  if (!document.is_deleted) {
    return { success: false, message: "Document is not in trash" };
  }

  await prisma.documents.update({
    where: { document_id: parseInt(document_id) },
    data: {
      is_deleted: 0,
      deleted_at: null,
    },
  });

  await logActivity({
    activityName: "Document Restored",
    activityDetail: `Document ID ${document_id} restored from trash in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Document restored successfully" };
}

async function permanentDeleteDocumentService(document_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_DELETE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const document = await prisma.documents.findUnique({
    where: { document_id: parseInt(document_id) },
  });
  if (!document || document.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to permanently delete this document" };
  }
  if (!document.is_deleted) {
    return { success: false, message: "Document must be in trash before permanent deletion" };
  }

  await prisma.documents.delete({
    where: { document_id: parseInt(document_id) },
  });

  await logActivity({
    activityName: "Document Permanently Deleted",
    activityDetail: `Document ID ${document_id} permanently deleted in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Document permanently deleted" };
}

async function addFolderService(userId, name, parent_id, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_FOLDER_CREATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const folder = await prisma.document_folders.create({
    data: { tenant_id: tenantId, name, parent_id },
  });

  await logActivity({
    activityName: "Folder Added",
    activityDetail: `Folder '${name}' added in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Folder added", id: folder.folder_id };
}

async function getFoldersService(userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_FOLDER_READ");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const folders = await prisma.document_folders.findMany({
    where: { tenant_id: tenantId },
    orderBy: { created_at: "desc" },
  });

  return folders;
}

async function updateFolderService(folder_id, name, parent_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_FOLDER_UPDATE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const folder = await prisma.document_folders.findUnique({
    where: { folder_id: parseInt(folder_id) },
  });
  if (!folder || folder.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to update this folder" };
  }

  await prisma.document_folders.update({
    where: { folder_id: parseInt(folder_id) },
    data: { name, parent_id },
  });

  await logActivity({
    activityName: "Folder Updated",
    activityDetail: `Folder ID ${folder_id} updated in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Folder updated successfully" };
}

async function deleteFolderService(folder_id, userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_FOLDER_DELETE");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  const folder = await prisma.document_folders.findUnique({
    where: { folder_id: parseInt(folder_id) },
  });
  if (!folder || folder.tenant_id !== tenantId) {
    return { success: false, message: "Unauthorized to delete this folder" };
  }

  // First, move all documents in this folder to root (folder_id = null)
  await prisma.documents.updateMany({
    where: { 
      folder_id: parseInt(folder_id),
      tenant_id: tenantId 
    },
    data: { folder_id: null }
  });

  // Then delete the folder
  await prisma.document_folders.delete({
    where: { folder_id: parseInt(folder_id) },
  });

  await logActivity({
    activityName: "Folder Deleted",
    activityDetail: `Folder ID ${folder_id} deleted and files moved to root in tenant ${tenantId}`,
    userId: parseInt(userId),
  });

  return { success: true, message: "Folder deleted successfully and files moved to root" };
}

async function getFolderFileCountsService(userId, tenantId) {
  const { allowed, reason } = await checkPermission(userId, tenantId, "DOCUMENT_FOLDER_READ");
  if (!allowed) return { success: false, message: reason || "Permission denied" };

  // Get all folders for the tenant
  const folders = await prisma.document_folders.findMany({
    where: { tenant_id: tenantId },
    select: { folder_id: true }
  });

  // Get file counts for each folder including null (root folder)
  const folderIds = folders.map(f => f.folder_id);
  folderIds.push(null); // Include root folder

  const fileCounts = await Promise.all(
    folderIds.map(async (folderId) => {
      const count = await prisma.documents.count({
        where: {
          tenant_id: tenantId,
          folder_id: folderId,
          OR: [
            { is_deleted: 0 },
            { is_deleted: null }
          ]
        }
      });
      return { folder_id: folderId, file_count: count };
    })
  );

  return fileCounts;
}

export {
  addDocumentService,
  getDocumentsService,
  updateDocumentService,
  deleteDocumentService,
  getTrashDocumentsService,
  restoreDocumentService,
  permanentDeleteDocumentService,
  addFolderService,
  getFoldersService,
  updateFolderService,
  deleteFolderService,
  getFolderFileCountsService,
};
