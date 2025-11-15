import {
    chatService,
    getChatsService,
    createChatService,
    deleteChatService,
  } from '../services/trackbot.service.js';
  const getChats = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId || !tenantId) {
        return res.status(401).json({ error: 'Invalid user ID or tenant ID' });
      }
      const chats = await getChatsService(userId, tenantId);
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Server error', message: error.message });
    }
  };

  const createChat = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId || !tenantId) {
        return res.status(401).json({ error: 'Invalid user ID or tenant ID' });
      }
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Missing required fields: title' });
      }
      const newChat = await createChatService(userId, tenantId, title);
      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ error: 'Server error', message: error.message });
    }
  };

  const deleteChat = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId || !tenantId) {
        return res.status(401).json({ error: 'Invalid user ID or tenant ID' });
      }
      const { chatId } = req.params;
      if (!chatId) {
        return res.status(400).json({ error: 'Missing required fields: chatId' });
      }
      const result = await deleteChatService(chatId, userId, tenantId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error', message: error.message });
    }
  };

  const sendMessage = async (req, res, next) => {
    try {
      const { id: userId, tenantId } = req.user;
      if (!userId || !tenantId) { // Added tenantId check for consistency and service requirement
        return res.status(401).json({ error: 'Invalid user ID or tenant ID' });
      }
      const { message, chatId } = req.body;
      if (!message || !chatId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // The chatService expects chatId, userId, tenantId, userMessage
      const result = await chatService(chatId, userId, tenantId, message);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error', message: error.message });
    }
  };

  export default {
    sendMessage,
    getChats,
    createChat,
    deleteChat,
  };