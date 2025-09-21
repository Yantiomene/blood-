const { Router } = require("express");
const {
  verifyEmail,
  getUsers,
  register,
  login,
  logout,
  getUserProfile,
  getUserById,
  updateUserProfile,
  updateUserLocation,
  passwordResetRequest,
  resetPassword,
  requestNewToken,
} = require("../controllers/auth");
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
} = require("../controllers/donationRequest");
const {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
} = require("../validators/auth");
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const { userAuth, verifiedOnly } = require("../middlewares/auth-middleware");
const router = Router();

// user
router.get("/users", getUsers);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", userAuth, logout);
router.get("/profile", userAuth, getUserProfile);
router.get("/user/:userId", userAuth, getUserById);
router.put("/profile", userAuth, updateUserProfile);
router.post("/requestNewToken", requestNewToken);
router.get("/verifyEmail/:code", verifyEmail);
router.post("/passwordResetRequest", passwordResetRequest);
router.post(
  "/passwordReset",
  resetPasswordValidation,
  validationMiddleware,
  resetPassword
);
router.put("/user/location", userAuth, updateUserLocation);

// requests
router.post("/donationRequest", userAuth, verifiedOnly, createDonationRequest);
router.get("/donationRequest", userAuth, verifiedOnly, getDonationRequests);
router.get("/donationRequest/:userId", userAuth, verifiedOnly, getDonationRequestByUserId);
router.put("/donationRequest/:requestId", userAuth, verifiedOnly, updateDonationRequest);
router.delete("/donationRequest/:requestId", userAuth, verifiedOnly, deleteRequest);
// find requests
router.get("/donationReq", userAuth, verifiedOnly, findRequestByBloodType);
router.post("/donationReqByDate", userAuth, verifiedOnly, findRequestByDate);
router.get("/donationReqByPriority/:urgent", userAuth, verifiedOnly, findRequestByPriority);
router.post("/donationReqByLocation", userAuth, verifiedOnly, findRequestByLocation);
// request interactions
router.post("/denyRequest", userAuth, verifiedOnly, denyRequest);
router.post("/acceptRequest/:requestId", userAuth, verifiedOnly, acceptRequest);
router.get("/incrementView/:requestId", userAuth, verifiedOnly, incrementViewCount);

// donors
router.post("/donors/find", userAuth, verifiedOnly, findNearbyDonors);
router.get("/donors", userAuth, verifiedOnly, getDonors);

module.exports = router;
