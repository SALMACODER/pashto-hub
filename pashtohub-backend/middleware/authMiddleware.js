/**
 * JWT auth middleware.
 *  - `protect` : verifies the access token (read from httpOnly cookie OR Bearer header).
 *               The Bearer fallback keeps Postman/cURL workflows usable.
 *  - `admin`   : requires role === 'admin'
 */
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { verifyAccessToken, ACCESS_COOKIE } = require('../utils/generateToken');

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[ACCESS_COOKIE];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = verifyAccessToken(token);
    if (decoded.type !== 'access') {
      res.status(401);
      throw new Error('Not authorized — wrong token type');
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  throw new Error('Access denied — admin privileges required');
};

module.exports = { protect, admin };
