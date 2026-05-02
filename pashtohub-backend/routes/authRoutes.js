const express = require('express');
const router = express.Router();

const { registerUser, loginUser, refreshToken, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerRules, loginRules } = require('../validators/authValidator');

router.post('/register', registerRules, validate, registerUser);
router.post('/login',    loginRules,    validate, loginUser);
router.post('/refresh',  refreshToken);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

module.exports = router;
