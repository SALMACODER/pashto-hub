const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

/**
 * @desc   List all categories — public so the storefront can render filters.
 * @route  GET /api/categories
 */
const listCategories = asyncHandler(async (_req, res) => {
  const items = await Category.find().sort({ order: 1, 'name.en': 1 }).lean();
  res.json({ success: true, data: { items }, items });
});

const createCategory = asyncHandler(async (req, res) => {
  const cat = await Category.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Category created', data: { category: cat }, category: cat });
});

const updateCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  Object.assign(cat, req.body);
  const updated = await cat.save();
  res.json({ success: true, message: 'Category updated', data: { category: updated }, category: updated });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  await cat.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
