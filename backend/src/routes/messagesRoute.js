const { Router } = require('express');

const { 
    createMessage, 
    getMessagesByConversation,
    getConversationsByUser,
    getMessagesByUser,
    updateMessage,
    deleteMessage,
 } = require('../controllers/messages');
const { userAuth } = require('../middlewares/auth-middleware');

const router = Router();

router.post('/createMessage', userAuth, createMessage);
router.get('/messages/:conversationId', userAuth, getMessagesByConversation);
router.get('/conversations/:userId', userAuth, getConversationsByUser);
router.get('/messages/user/:userId', userAuth, getMessagesByUser);
router.put('/updateMessage/:messageId', userAuth, updateMessage);
router.delete('/deleteMessage/:messageId', userAuth, deleteMessage); 

module.exports = router;