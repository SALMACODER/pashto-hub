const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Book schema — bilingual (en/ps).
 * Slug is auto-derived from title.en (fallback title.ps) on create / title-change,
 * with a numeric suffix appended on collision so it stays unique.
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: [true, 'English title is required'], trim: true, maxlength: 200 },
      ps: { type: String, required: [true, 'Pashto title is required'], trim: true, maxlength: 200 },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    author: {
      en: { type: String, required: [true, 'English author is required'], trim: true, maxlength: 120 },
      ps: { type: String, required: [true, 'Pashto author is required'], trim: true, maxlength: 120 },
    },
    description: {
      en: { type: String, default: '', maxlength: 2000 },
      ps: { type: String, default: '', maxlength: 2000 },
    },
    // Category is stored as the slug of a Category document (e.g. "poetry").
    // We keep it as a String (not ObjectId ref) so books survive a category
    // rename and admins can introduce new categories without touching code.
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Category must be a slug (lowercase, digits, hyphens)'],
      maxlength: 50,
      index: true,
    },
    language: { type: String, enum: ['ps', 'en'], default: 'ps' },
    pages: { type: Number, default: 0, min: 0 },
    publishedYear: { type: Number, min: 600, max: new Date().getFullYear() + 1 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    views: { type: Number, default: 0, index: true },
    downloads: { type: Number, default: 0 },
    color: {
      type: String,
      default: 'from-primary-500 to-primary-700',
    },
    // ── Cover image (single) ──────────────────────────────────────────────
    coverImage:    { type: String, default: '' },        // Cloudinary secure_url
    coverPublicId: { type: String, default: '' },        // for delete/replace

    // ── Additional images (gallery) ───────────────────────────────────────
    // Each entry stores both the URL and Cloudinary public_id so we can
    // remove an item without orphaning the asset on Cloudinary.
    images: {
      type: [
        new mongoose.Schema(
          {
            url:      { type: String, required: true },
            publicId: { type: String, required: true },
            caption:  { type: String, default: '' },
          },
          { _id: false },
        ),
      ],
      default: [],
    },

    // ── PDF (optional) ────────────────────────────────────────────────────
    fileUrl:      { type: String, default: '' },         // Cloudinary secure_url (raw resource)
    filePublicId: { type: String, default: '' },         // for delete/replace
    fileSize:     { type: Number, default: 0 },          // bytes — useful for UI

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// Compound + secondary indexes for common queries
bookSchema.index({ category: 1, createdAt: -1 });
bookSchema.index({
  'title.en': 'text',
  'title.ps': 'text',
  'author.en': 'text',
  'author.ps': 'text',
  'description.en': 'text',
  'description.ps': 'text',
}, {
  weights: { 'title.en': 10, 'title.ps': 10, 'author.en': 5, 'author.ps': 5 },
  name: 'book_text_index',
});

// ---- Slug generation ----
async function generateUniqueSlug(BookModel, base, currentId) {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await BookModel.findOne({ slug }).select('_id').lean();
    if (!existing || (currentId && existing._id.equals(currentId))) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

bookSchema.pre('validate', async function (next) {
  if (this.slug && !this.isModified('title.en') && !this.isModified('title.ps')) return next();
  const source = this.title?.en || this.title?.ps || 'book';
  const base = slugify(source, { lower: true, strict: true, locale: 'en' }) || 'book';
  try {
    this.slug = await generateUniqueSlug(this.constructor, base, this._id);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Book', bookSchema);
