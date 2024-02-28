const { Router } = require('express');
const { 
    verifyEmail, 
    getUsers, 
    register, 
    login, 
    logout, 
    getUserProfile, 
    updateUserProfile, 
    updateUserLocation
} = require('../controllers/auth');
const { 
    createDonationRequest, 
    getDonationRequests, 
    updateDonationRequest,
    findNearbyDonors 
} = require('../controllers/donationRequest');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/auth-middleware');
const router = Router();

router.get('/users', getUsers);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', userAuth, logout);
router.get('/profile', userAuth, getUserProfile);
router.put('/profile', userAuth, updateUserProfile);
router.get('/verifyEmail/:code', verifyEmail);
router.post('/donationRequest', userAuth, createDonationRequest);
router.get('/donationRequest', userAuth, getDonationRequests);
router.put('/donationRequest/:requestId', userAuth, updateDonationRequest);
router.put('/user/location', userAuth, updateUserLocation);
router.post('/donors/find', userAuth, findNearbyDonors);


module.exports = router;
