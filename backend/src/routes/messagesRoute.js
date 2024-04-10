const { Router } = require('express');

const { createMessage } = require('../controllers/messages');
const { userAuth } = require('../middlewares/auth-middleware');

const router = Router();

router.post('/createMessage', userAuth, createMessage);

module.exports = router;