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
    getDonors,
    deleteRequest,
    findRequestByBloodType
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
router.post('/passwordResetRequest', passwordResetRequest);
router.post('/passwordReset', resetPasswordValidation, validationMiddleware,resetPassword);
router.put('/user/location', userAuth, updateUserLocation);

// requests
router.post('/donationRequest', userAuth, createDonationRequest);
router.get('/donationRequest', userAuth, getDonationRequests);
router.get('/donationRequest/:userId', userAuth, getDonationRequestByUserId);
router.put('/donationRequest/:requestId', userAuth, updateDonationRequest);
router.delete('/donationRequest/:requestId', userAuth, deleteRequest);
router.get('/donationReq', userAuth, findRequestByBloodType);

// donors
router.post('/donors/find', userAuth, findNearbyDonors);
router.get('/donors', userAuth, getDonors);



module.exports = router;
