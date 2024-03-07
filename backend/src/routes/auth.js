const { Router } = require('express');
const { 
    verifyEmail, 
    getUsers, 
    register, 
    login, 
    logout, 
    getUserProfile, 
    updateUserProfile, 
    updateUserLocation,
    passwordResetRequest,
    resetPassword
} = require('../controllers/auth');
const { 
    createDonationRequest, 
    getDonationRequests, 
    updateDonationRequest,
    findNearbyDonors,
    getDonationRequestByUserId,
    getDonors
} = require('../controllers/donationRequest');
const { registerValidation, loginValidation, resetPasswordValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validations-middleware');
const { userAuth } = require('../middlewares/auth-middleware');
const router = Router();

// user
router.get('/users', getUsers);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', userAuth, logout);
router.get('/profile', userAuth, getUserProfile);
router.put('/profile', userAuth, updateUserProfile);
router.get('/verifyEmail/:code', verifyEmail);
// donation
router.post('/donationRequest', userAuth, createDonationRequest);
router.get('/donationRequest', userAuth, getDonationRequests);
router.get('/donationRequest/:userId', userAuth, getDonationRequestByUserId);
router.put('/donationRequest/:requestId', userAuth, updateDonationRequest);
// update
router.put('/user/location', userAuth, updateUserLocation);
router.post('/donors/find', userAuth, findNearbyDonors);
router.get('/donors', userAuth, getDonors);
router.post('/passwordResetRequest', passwordResetRequest);
router.post('/passwordReset', resetPasswordValidation, validationMiddleware,resetPassword);


module.exports = router;
