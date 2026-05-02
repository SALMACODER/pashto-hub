const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const { deleteByPublicId, RESOURCE } = require('../services/uploadService');
const { isLocalPublicId, deleteLocal } = require('../services/localUploadService');

/**
 * Asset cleanup that handles BOTH storage backends — picks local-disk vs
 * Cloudinary by inspecting the publicId prefix. Best-effort, never throws.
 */
const cleanupAsset = (publicId, resourceType = RESOURCE.IMAGE) => {
  if (!publicId) return;
  if (isLocalPublicId(publicId)) deleteLocal(publicId);
  else deleteByPublicId(publicId, resourceType);
};

const cleanupRemovedMedia = (before = [], after = []) => {
  const keep = new Set((after || []).map((m) => m?.publicId).filter(Boolean));
  for (const item of before) {
    if (item?.publicId && !keep.has(item.publicId)) {
      cleanupAsset(item.publicId, item.resourceType || RESOURCE.IMAGE);
    }
  }
};

/**
 * @desc   List lessons.
 * @route  GET /api/lessons
 * @access Public
 * @query  level, q, page, limit
 */
const getLessons = asyncHandler(async (req, res) => {
  const { level, q, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (level && level !== 'all') filter.level = level;
  if (q && q.trim()) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ 'title.en': rx }, { 'title.ps': rx }, { slug: rx }];
  }
  const pageNum  = Math.max(parseInt(page, 10)  || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

  const [total, lessons] = await Promise.all([
    Lesson.countDocuments(filter),
    Lesson.find(filter)
      .sort({ order: 1, createdAt: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
  ]);

  res.json({
    success: true,
    data: { items: lessons, pagination: { page: pageNum, pageSize: limitNum, total, pages: Math.ceil(total / limitNum) } },
    lessons,                                              // legacy
    count: lessons.length,
    total,
  });
});

/**
 * @desc   Fetch one lesson by Mongo id OR slug. The slug path is what makes
 *         /learn/grammar-basics work in the React Router; the id path keeps
 *         legacy admin tooling that references _id functional.
 * @route  GET /api/lessons/:idOrSlug
 * @access Public
 */
const getLessonByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) && /^[a-f0-9]{24}$/i.test(idOrSlug);

  const lesson = isObjectId
    ? await Lesson.findById(idOrSlug)
    : await Lesson.findOne({ slug: String(idOrSlug).toLowerCase() });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }
  res.json({ success: true, data: { lesson }, lesson });
});

const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, message: 'Lesson created', data: { lesson }, lesson });
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }

  const prev = {
    coverPublicId: lesson.coverPublicId,
    media: Array.isArray(lesson.media) ? lesson.media.map((m) => m.toObject?.() || m) : [],
  };

  Object.assign(lesson, req.body);
  const updated = await lesson.save();

  if (prev.coverPublicId && prev.coverPublicId !== updated.coverPublicId) {
    cleanupAsset(prev.coverPublicId, RESOURCE.IMAGE);
  }
  cleanupRemovedMedia(prev.media, updated.media);

  res.json({ success: true, message: 'Lesson updated', data: { lesson: updated }, lesson: updated });
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }

  const toDelete = {
    cover: lesson.coverPublicId,
    media: (lesson.media || []).map((m) => ({ publicId: m.publicId, resourceType: m.resourceType })).filter((m) => m.publicId),
  };

  await lesson.deleteOne();

  if (toDelete.cover) cleanupAsset(toDelete.cover, RESOURCE.IMAGE);
  for (const m of toDelete.media) cleanupAsset(m.publicId, m.resourceType || RESOURCE.IMAGE);

  res.json({ success: true, message: 'Lesson deleted' });
});

module.exports = {
  getLessons,
  getLesson: getLessonByIdOrSlug,    // legacy alias
  getLessonById: getLessonByIdOrSlug, // legacy alias
  getLessonByIdOrSlug,
  createLesson,
  updateLesson,
  deleteLesson,
};
