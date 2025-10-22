const { Router } = require('express');

const { 
    createMessage, 
    getMessagesByConversation,
    getConversationsByUser,
    getMessagesByUser,
    updateMessage,
    deleteMessage,
    getUnreadCount,
    markConversationRead,
    getUnreadCountsByConversation,
    markAllMessagesRead,
    reactToMessage,
    uploadMessageFile,
 } = require('../controllers/messages');
const { userAuth } = require('../middlewares/auth-middleware');

const router = Router();

router.post('/createMessage', userAuth, createMessage);
router.get('/messages/:conversationId', userAuth, getMessagesByConversation);
router.get('/conversations/:userId', userAuth, getConversationsByUser);
router.get('/messages/user/:userId', userAuth, getMessagesByUser);
router.get('/messages/unread-count', userAuth, getUnreadCount);
router.get('/conversations/unread-counts', userAuth, getUnreadCountsByConversation);
router.put('/messages/mark-all-read', userAuth, markAllMessagesRead);
router.put('/conversations/:id/read', userAuth, markConversationRead);
router.put('/updateMessage/:messageId', userAuth, updateMessage);
router.delete('/deleteMessage/:messageId', userAuth, deleteMessage);

// Emoji reactions
router.post('/messages/:messageId/reactions', userAuth, reactToMessage);

// Base64 file upload for message attachments
router.post('/messages/upload', userAuth, uploadMessageFile);

module.exports = router;