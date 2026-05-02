const { body, param } = require('express-validator');

const createRules = [
  body('name.en').trim().isLength({ min: 1, max: 60 }).withMessage('English name 1–60 chars'),
  body('name.ps').trim().isLength({ min: 1, max: 60 }).withMessage('Pashto name 1–60 chars'),
  body('icon').optional().isString().isLength({ max: 10 }),
  body('color').optional().isString().isLength({ max: 100 }),
  body('order').optional().isInt({ min: 0, max: 9999 }),
];

const updateRules = createRules.map((r) => r.optional({ values: 'undefined' }));

const idParam = [param('id').isMongoId().withMessage('Invalid id')];

module.exports = { createRules, updateRules, idParam };
