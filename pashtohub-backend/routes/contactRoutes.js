const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  submitContact,
  getContacts,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// Public — submit form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  submitContact,
);

// Admin — manage messages
router.get('/', protect, admin, getContacts);
router.put('/:id', protect, admin, updateContact);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;