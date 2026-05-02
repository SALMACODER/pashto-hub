/**
 * Centralized error handlers.
 *
 * Standard response envelope (every API response uses this shape):
 *   success:        { success: true,  data: { ... }, [message] }
 *   client error:   { success: false, error: { code, message, [details] } }
 *   server error:   { success: false, error: { code: 'INTERNAL', message }, [stack in dev] }
 */

const notFound = (req, _res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  err.code = 'NOT_FOUND';
  next(err);
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let code = err.code || 'INTERNAL';
  let message = err.message || 'Internal Server Error';
  let details;

  // Mongoose — bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    code = 'INVALID_ID';
    message = 'Resource not found — invalid ID';
  }

  // Mongoose — duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for '${field}'.`;
    details = { field, value: err.keyValue?.[field] };
  }

  // Mongoose — validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_FAILED';
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // CSRF rejection
  if (err.code === 'EBADCSRFTOKEN' || err.code === 'csrf-csrf-invalid-csrf-token') {
    statusCode = 403;
    code = 'CSRF_INVALID';
    message = 'Invalid or missing CSRF token';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    // Keep top-level "message" for legacy clients
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};

module.exports = { notFound, errorHandler };
