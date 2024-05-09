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
    resetPassword,
    requestNewToken
} = require('../controllers/auth');
const { 
    createDonationRequest, 
    getDonationRequests, 
    updateDonationRequest,
    findNearbyDonors,
    getDonationRequestByUserId,
    getDonors,
    deleteRequest,
    findRequestByBloodType,
    denyRequest,
    acceptRequest,
    findRequestByDate,
    findRequestByPriority,
    findRequestByLocation,
    incrementViewCount,
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
router.post('/requestNewToken', requestNewToken);
router.get('/verifyEmail/:code', verifyEmail);
router.post('/passwordResetRequest', passwordResetRequest);
router.post('/passwordReset', resetPasswordValidation, validationMiddleware, resetPassword);
router.put('/user/location', userAuth, updateUserLocation);

// requests
router.post('/donationRequest', userAuth, createDonationRequest);
router.get('/donationRequest', userAuth, getDonationRequests);
router.get('/donationRequest/:userId', userAuth, getDonationRequestByUserId);
router.put('/donationRequest/:requestId', userAuth, updateDonationRequest);
router.delete('/donationRequest/:requestId', userAuth, deleteRequest);
// find requests
router.get('/donationReq', userAuth, findRequestByBloodType);
router.post('/donationReqByDate', userAuth, findRequestByDate);
router.get('/donationReqByPriority/:urgent', userAuth, findRequestByPriority);
router.post('/donationReqByLocation', userAuth, findRequestByLocation);
// request interactions
router.post('/denyRequest', userAuth, denyRequest);
router.get('/acceptRequest/:requestId', userAuth, acceptRequest);
router.get('/incrementView/:requestId', userAuth, incrementViewCount);

// donors
router.post('/donors/find', userAuth, findNearbyDonors);
router.get('/donors', userAuth, getDonors);



module.exports = router;
