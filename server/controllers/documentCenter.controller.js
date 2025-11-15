import { 
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
    getFolderFileCountsService
} from '../services/documentCenter.service.js';

const addDocument = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { filename, file_url, file_type, file_size, folder_id, tags, permissions, product_id } = req.body;
        if (!filename || !file_url || !file_type || !file_size) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await addDocumentService(userId, filename, file_url, file_type, file_size, folder_id, tenantId, tags, permissions, product_id);
        res.status(201).json(result);
    } catch (error) {
        console.error('Add Document Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const documents = await getDocumentsService(userId, tenantId);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Get Documents Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateDocument = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { document_id, filename, file_url, file_type, file_size, folder_id, tags, permissions, product_id } = req.body;
        if (!document_id || !filename || !file_url || !file_type || !file_size) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await updateDocumentService(document_id, filename, file_url, file_type, file_size, folder_id, userId, tenantId, tags, permissions, product_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Update Document Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { id } = req.params; // Get id from the URL
        const result = await deleteDocumentService(id, userId, tenantId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete Document Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getTrashDocuments = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const documents = await getTrashDocumentsService(userId, tenantId);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Get Trash Documents Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const restoreDocument = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { id } = req.params;
        const result = await restoreDocumentService(id, userId, tenantId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Restore Document Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const permanentDeleteDocument = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { id } = req.params;
        const result = await permanentDeleteDocumentService(id, userId, tenantId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Permanent Delete Document Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const addFolder = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { name, parent_id } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await addFolderService(userId, name, parent_id, tenantId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getFolders = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const folders = await getFoldersService(userId, tenantId);
        res.status(200).json(folders);
    } catch (error) {
        console.error('Get Folders Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateFolder = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { folder_id, name, parent_id } = req.body;
        if (!folder_id || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await updateFolderService(folder_id, name, parent_id, userId, tenantId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Update Folder Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteFolder = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const { id } = req.params; // Get id from the URL
        const result = await deleteFolderService(id, userId, tenantId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete Folder Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getFolderFileCounts = async (req, res, next) => {
    try {
        const { id: userId, tenantId } = req.user;
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user ID' });
        }
        const fileCounts = await getFolderFileCountsService(userId, tenantId);
        res.status(200).json(fileCounts);
    } catch (error) {
        console.error('Get Folder File Counts Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export default {
    addDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
    getTrashDocuments,
    restoreDocument,
    permanentDeleteDocument,
    addFolder,
    getFolders,
    updateFolder,
    deleteFolder,
    getFolderFileCounts,
};