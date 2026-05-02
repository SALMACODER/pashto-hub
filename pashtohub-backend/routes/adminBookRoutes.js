/**
 * Admin book routes.
 *
 * Same controllers as the public read endpoints, but the write endpoints
 * are explicitly mounted under /api/admin/books for clarity. The Cloudinary
 * cleanup logic for update/delete lives in the shared bookController.
 */
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  getBooks,
  getBookByIdOrSlug,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const {
  createBookRules,
  updateBookRules,
  searchBookRules,
  idParamRule,
} = require('../validators/bookValidator');

router.use(protect, admin);

router.get('/',           searchBookRules, validate, getBooks);
router.get('/:idOrSlug',  getBookByIdOrSlug);
router.post('/',          createBookRules, validate, createBook);
router.put('/:id',        idParamRule, updateBookRules, validate, updateBook);
router.delete('/:id',     idParamRule, validate, deleteBook);

module.exports = router;
