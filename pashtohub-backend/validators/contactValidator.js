const { body } = require('express-validator');

const contactRules = [
  body('name').trim().isLength({ min: 2, max: 60 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 200 }).escape(),
  body('message').trim().isLength({ min: 5, max: 2000 }).escape(),
];

module.exports = { contactRules };
