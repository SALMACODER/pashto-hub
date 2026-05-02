const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { deleteByPublicId, RESOURCE } = require('../services/uploadService');
const { isLocalPublicId, deleteLocal } = require('../services/localUploadService');

/**
 * Delete one asset by publicId, dispatching to local-disk or Cloudinary based
 * on the publicId prefix. Both are fire-and-forget — Cloudinary outages or a
 * missing local file must NEVER roll back a DB write.
 */
const deleteAssetByPublicId = (publicId, resourceType = RESOURCE.IMAGE) => {
  if (!publicId) return;
  if (isLocalPublicId(publicId)) {
    deleteLocal(publicId);
  } else {
    deleteByPublicId(publicId, resourceType);
  }
};

/**
 * Diff two arrays of {publicId} entries and delete any asset that was in
 * `before` but isn't in `after`. Works for local + Cloudinary mixed lists.
 */
const cleanupRemovedImages = (beforeArr = [], afterArr = []) => {
  const keep = new Set((afterArr || []).map((i) => i?.publicId).filter(Boolean));
  for (const item of beforeArr) {
    if (item?.publicId && !keep.has(item.publicId)) {
      deleteAssetByPublicId(item.publicId, RESOURCE.IMAGE);
    }
  }
};

/**
 * @desc   List / search books
 * @route  GET /api/books
 * @access Public
 * @query  q, category, lang, page, limit, sort
 */
const getBooks = asyncHandler(async (req, res) => {
  const { q, search, category, lang, page = 1, limit = 20, sort } = req.query;
  const queryText = (q || search || '').trim();

  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (lang) filter.language = lang;

  if (queryText) {
    filter.$text = { $search: queryText };
  }

  const pageNum  = Math.max(parseInt(page, 10)  || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const sortSpec = queryText
    ? { score: { $meta: 'textScore' }, createdAt: -1 }
    : (sort === 'popular' ? { views: -1 } : { createdAt: -1 });

  const projection = queryText ? { score: { $meta: 'textScore' } } : {};

  const [total, books] = await Promise.all([
    Book.countDocuments(filter),
    Book.find(filter, projection)
      .sort(sortSpec)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
  ]);

  res.json({
    success: true,
    data: {
      items: books,
      pagination: { page: pageNum, pageSize: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
    books,
    count: books.length,
    total,
  });
});

/**
 * @desc   Get a single book by Mongo id OR slug
 * @route  GET /api/books/:idOrSlug
 * @access Public
 */
const getBookByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) && /^[a-f0-9]{24}$/i.test(idOrSlug);

  const book = isObjectId
    ? await Book.findById(idOrSlug)
    : await Book.findOne({ slug: idOrSlug.toLowerCase() });

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  Book.updateOne({ _id: book._id }, { $inc: { views: 1 } }).catch(() => {});
  res.json({ success: true, data: { book }, book });
});

const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Book created', data: { book }, book });
});

/**
 * Update a book. When the cover image, PDF, or any gallery image changes,
 * delete the orphaned Cloudinary asset(s) — fire-and-forget so a Cloudinary
 * outage never rolls back the DB write.
 */
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }

  // Snapshot current asset references BEFORE applying the patch
  const prev = {
    coverPublicId: book.coverPublicId,
    filePublicId:  book.filePublicId,
    images:        Array.isArray(book.images) ? book.images.map((i) => i.toObject?.() || i) : [],
  };

  Object.assign(book, req.body);
  const updated = await book.save();

  // Cover image replaced or removed
  if (prev.coverPublicId && prev.coverPublicId !== updated.coverPublicId) {
    deleteAssetByPublicId(prev.coverPublicId, RESOURCE.IMAGE);
  }
  // PDF replaced or removed
  if (prev.filePublicId && prev.filePublicId !== updated.filePublicId) {
    deleteAssetByPublicId(prev.filePublicId, RESOURCE.RAW);
  }
  // Gallery images dropped
  cleanupRemovedImages(prev.images, updated.images);

  res.json({ success: true, message: 'Book updated', data: { book: updated }, book: updated });
});

/**
 * Delete a book + all its Cloudinary assets.
 */
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }

  const toDelete = {
    cover: book.coverPublicId,
    file:  book.filePublicId,
    images: (book.images || []).map((i) => i.publicId).filter(Boolean),
  };

  await book.deleteOne();

  // Asset cleanup AFTER the DB delete succeeds. Each call routes itself to
  // local or Cloudinary based on the publicId prefix.
  if (toDelete.cover) deleteAssetByPublicId(toDelete.cover, RESOURCE.IMAGE);
  if (toDelete.file)  deleteAssetByPublicId(toDelete.file,  RESOURCE.RAW);
  for (const pid of toDelete.images) deleteAssetByPublicId(pid, RESOURCE.IMAGE);

  res.json({ success: true, message: 'Book deleted' });
});

module.exports = {
  getBooks,
  getBookById: getBookByIdOrSlug,
  getBookByIdOrSlug,
  createBook,
  updateBook,
  deleteBook,
};
