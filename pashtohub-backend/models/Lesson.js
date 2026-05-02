const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * A lesson groups a set of "chapters" (a.k.a. sections in the legacy frontend).
 * Each chapter has a type (alphabet | phrases | colors | names | rich) and a
 * free-form `items` array whose shape depends on the type. The frontend
 * LessonDetail page renders each type with a dedicated layout.
 *
 * Chapters are EMBEDDED, not a separate collection, because:
 *   - they're always loaded with their parent lesson (one round-trip)
 *   - their count per lesson is small (≤ ~10)
 *   - reorder / atomic update happens on the lesson document
 *
 * If you ever need cross-lesson chapter queries, promote chapters to their
 * own collection then.
 */
const chapterSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true, maxlength: 200 },
      ps: { type: String, default: '', trim: true, maxlength: 200 },
    },
    description: {
      en: { type: String, default: '', maxlength: 1000 },
      ps: { type: String, default: '', maxlength: 1000 },
    },
    /**
     * Render type — drives which UI block the frontend uses for `items`:
     *   alphabet  : items = [{ letter, name, sound }]
     *   phrases   : items = [{ ps, roman, en }]
     *   colors    : items = [{ ps, roman, en, hex }]
     *   names     : items = [{ ps, roman, en }]
     *   rich      : items unused; use `body` for free HTML/markdown content
     */
    type: {
      type: String,
      enum: ['alphabet', 'phrases', 'colors', 'names', 'rich'],
      default: 'phrases',
    },
    items: { type: mongoose.Schema.Types.Mixed, default: [] },
    body: {
      en: { type: String, default: '' },
      ps: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: false },
);

const lessonSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true, maxlength: 200 },
      ps: { type: String, required: true, trim: true, maxlength: 200 },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    description: {
      en: { type: String, default: '', maxlength: 2000 },
      ps: { type: String, default: '', maxlength: 2000 },
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      index: true,
    },
    levelPs:  { type: String, default: '' },
    duration: { type: String, default: '' },
    color:    { type: String, default: 'from-primary-500 to-primary-700' },
    icon:     { type: String, default: '📚' },

    // Free-form intro/conclusion text for the lesson page. Per-chapter
    // content lives inside `chapters[].items` or `chapters[].body`.
    content: {
      en: { type: String, default: '' },
      ps: { type: String, default: '' },
    },
    videoUrl: { type: String, default: '' },

    // Cover image (single, optional)
    coverImage:    { type: String, default: '' },
    coverPublicId: { type: String, default: '' },

    // Inline media gallery (Cloudinary OR local: same shape both sides).
    media: {
      type: [
        new mongoose.Schema(
          {
            url:          { type: String, required: true },
            publicId:     { type: String, required: true },
            resourceType: { type: String, enum: ['image', 'raw', 'video'], default: 'image' },
            caption:      { type: String, default: '' },
          },
          { _id: false },
        ),
      ],
      default: [],
    },

    // ── Chapters / sections (embedded subdocs) ────────────────────────────
    chapters: { type: [chapterSchema], default: [] },

    order:   { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

// Quick helper for the "lessons count" UI badge — derived from chapters.length
// when the caller doesn't manage it manually.
lessonSchema.virtual('chapterCount').get(function () {
  return Array.isArray(this.chapters) ? this.chapters.length : 0;
});
lessonSchema.set('toJSON',   { virtuals: true });
lessonSchema.set('toObject', { virtuals: true });

// ─────────────────────── slug auto-generation ─────────────────────────────
async function generateUniqueSlug(Model, base, currentId) {
  let slug = base, n = 1;
  while (true) {
    const existing = await Model.findOne({ slug }).select('_id').lean();
    if (!existing || (currentId && existing._id.equals(currentId))) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

lessonSchema.pre('validate', async function (next) {
  if (this.slug && !this.isModified('title.en')) return next();
  const source = this.title?.en || this.title?.ps || 'lesson';
  const base   = slugify(source, { lower: true, strict: true, locale: 'en' }) || 'lesson';
  try {
    this.slug = await generateUniqueSlug(this.constructor, base, this._id);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
