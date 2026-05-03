const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const {
  setAuthCookies,
  clearAuthCookies,
  signAccessToken,
  verifyRefreshToken,
  REFRESH_COOKIE,
} = require('../utils/generateToken');
const { sendMail, buildResetEmail } = require('../services/emailService');

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

/**
 * @desc   Send password-reset email.
 * @route  POST /api/auth/forgot-password
 * @access Public
 *
 * Always returns 200 with the same message regardless of whether the email
 * exists in the DB. This is intentional — revealing "no such user" lets an
 * attacker enumerate valid accounts. The actual email is only sent when the
 * user is found.
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const genericResponse = {
    success: true,
    message: 'If that email is registered, a reset link is on its way.',
  };

  const user = await User.findOne({ email });
  if (!user) return res.json(genericResponse);

  // Mint and persist the token (hash on doc, plain in URL)
  const plainToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });   // skip validators — we're not changing user-edited fields

  const clientUrl = (process.env.CLIENT_URL || '').split(',')[0].trim() || 'http://localhost:5173';
  const resetUrl  = `${clientUrl.replace(/\/+$/, '')}/reset-password/${plainToken}`;

  try {
    const { text, html } = buildResetEmail({ name: user.name, resetUrl });
    await sendMail({
      to: user.email,
      subject: 'Reset your PashtoHub password',
      text,
      html,
    });
    res.json(genericResponse);
  } catch (err) {
    // Email failed → wipe the token so the user can try again immediately.
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    console.error('[auth] reset email send failed:', err.message);
    res.status(500);
    throw new Error('Could not send reset email — please try again later.');
  }
});

/**
 * @desc   Set a new password using a valid reset token.
 * @route  PUT /api/auth/reset-password/:token
 * @access Public
 *
 * The :token in the URL is the PLAIN token from the email. We hash it and
 * look up by hash + unexpired expiry. The User model's pre('save') hook
 * bcrypts the new password, so we just set it directly.
 *
 * On success we DON'T auto-login — we want the user to consciously sign in
 * with their new password. This also avoids minting auth cookies via a
 * link an attacker controls (defence in depth).
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash('sha256').update(String(token)).digest('hex');
  const user = await User.findOne({
    resetPasswordToken:  hashed,
    resetPasswordExpire: { $gt: new Date() },
  }).select('+password +resetPasswordToken +resetPasswordExpire');

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or has expired. Request a new one.');
  }

  user.password = password;                 // pre('save') hook bcrypts it
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated. You can now sign in with your new password.',
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
};
