const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const {
  setAuthCookies,
  clearAuthCookies,
  signAccessToken,
  verifyRefreshToken,
  REFRESH_COOKIE,
} = require('../utils/generateToken');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, preferredLanguage } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    preferredLanguage: preferredLanguage || 'en',
  });

  setAuthCookies(res, user._id);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user },
  });
});

/**
 * @desc   Authenticate user & set httpOnly cookies
 * @route  POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  setAuthCookies(res, user._id);
  res.json({
    success: true,
    message: 'Signed in successfully',
    data: { user },
  });
});

/**
 * @desc   Mint a new access token from a valid refresh cookie
 * @route  POST /api/auth/refresh
 * @access Public (but only succeeds if refresh cookie is valid)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    res.status(401);
    throw new Error('No refresh token');
  }
  try {
    const decoded = verifyRefreshToken(token);
    if (decoded.type !== 'refresh') throw new Error('Wrong token type');

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }

    setAuthCookies(res, user._id);
    res.json({ success: true, data: { user } });
  } catch {
    clearAuthCookies(res);
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
});

/**
 * @desc   Log out — clear cookies
 * @route  POST /api/auth/logout
 * @access Public
 */
const logoutUser = asyncHandler(async (_req, res) => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Signed out' });
});

/**
 * @desc   Get current logged-in user
 * @route  GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

module.exports = { registerUser, loginUser, refreshToken, logoutUser, getMe };
