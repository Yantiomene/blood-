const { Router } = require('express');
const { 
    verifyEmail, 
    getUsers, 
    register, 
    login, 
    protected,
    logout, 
    getUserProfile, 
    updateUserProfile 
} = require('../controllers/auth');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/auth-middleware');
const router = Router();

router.get('/users', getUsers);
router.get('/protected', userAuth, protected);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', userAuth, logout);
router.get('/profile', userAuth, getUserProfile);
router.put('/profile', userAuth, updateUserProfile);
router.get('/verifyEmail/:code', verifyEmail);


module.exports = router;
