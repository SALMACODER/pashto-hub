/**
 * Category routes.
 *
 * Public:
 *   GET  /api/categories          — list (frontend dropdowns / filters)
 *
 * Admin:
 *   POST   /api/admin/categories
 *   PUT    /api/admin/categories/:id
 *   DELETE /api/admin/categories/:id
 */
const express = require('express');

const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { createRules, updateRules, idParam } = require('../validators/categoryValidator');

const publicRouter = express.Router();
publicRouter.get('/', listCategories);

const adminRouter = express.Router();
adminRouter.use(protect, admin);
adminRouter.get('/',       listCategories);
adminRouter.post('/',      createRules, validate, createCategory);
adminRouter.put('/:id',    idParam, updateRules, validate, updateCategory);
adminRouter.delete('/:id', idParam, validate, deleteCategory);

module.exports = { publicRouter, adminRouter };
