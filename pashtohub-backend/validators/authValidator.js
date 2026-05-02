const { body } = require('express-validator');

const registerRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters')
    .escape(),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
  body('preferredLanguage')
    .optional()
    .isIn(['en', 'ps']).withMessage('preferredLanguage must be en or ps'),
];

const loginRules = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 128 }),
];

module.exports = { registerRules, loginRules };
