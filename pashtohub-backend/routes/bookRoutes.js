const express = require('express');
const router = express.Router();

const {
  getBooks,
  getBookByIdOrSlug,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createBookRules,
  updateBookRules,
  searchBookRules,
  idParamRule,
} = require('../validators/bookValidator');

// Public
router.get('/', searchBookRules, validate, getBooks);

// Accept either Mongo id (24-hex) or slug (a-z 0-9 -)
router.get('/:idOrSlug', getBookByIdOrSlug);

// Admin
router.post('/',      protect, admin, createBookRules, validate, createBook);
router.put('/:id',    protect, admin, idParamRule, updateBookRules, validate, updateBook);
router.delete('/:id', protect, admin, idParamRule, validate, deleteBook);

module.exports = router;
