const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require('../validators/authValidator');

router.post('/register', registerRules, validate, registerUser);
router.post('/login',    loginRules,    validate, loginUser);
router.post('/refresh',  refreshToken);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

// Password reset — both endpoints are public (the user has no session yet)
// and share the auth rate limiter mounted in server.js. CSRF is exempted in
// server.js because the user can't possibly have a CSRF cookie at this point.
router.post('/forgot-password',       forgotPasswordRules, validate, forgotPassword);
router.put('/reset-password/:token',  resetPasswordRules,  validate, resetPassword);

module.exports = router;
