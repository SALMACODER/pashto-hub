/**
 * Wrapper around express-validator to return a clean 400 response
 * whenever any validator rule fails.
 */
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_FAILED',
      message: 'Validation failed',
      details,
    },
    // Legacy fields retained so older callers keep working
    message: 'Validation failed',
    errors: details,
  });
};

module.exports = validate;