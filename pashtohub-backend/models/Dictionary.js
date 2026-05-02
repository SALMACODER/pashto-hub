const mongoose = require('mongoose');

/**
 * Bilingual dictionary entry.
 *
 * Headwords stored as `english` and `pashto`; per-language meaning + example.
 * Admin-marked `featured` entries appear in the homepage "Popular searches"
 * row — sorted by `featuredOrder` ascending.
 */
const dictionarySchema = new mongoose.Schema(
  {
    english: {
      type: String,
      required: [true, 'English word is required'],
      trim: true,
      maxlength: 80,
      index: true,
    },
    pashto: {
      type: String,
      required: [true, 'Pashto word is required'],
      trim: true,
      maxlength: 80,
      index: true,
    },
    transliteration: { type: String, default: '', trim: true, maxlength: 80 },

    partOfSpeech: {
      en: {
        type: String,
        enum: ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Interjection', 'Other'],
        default: 'Noun',
      },
      ps: { type: String, default: 'نوم', maxlength: 40 },
    },

    meaning: {
      en: { type: String, default: '', maxlength: 1000 },
      ps: { type: String, default: '', maxlength: 1000 },
    },
    example: {
      en: { type: String, default: '', maxlength: 500 },
      ps: { type: String, default: '', maxlength: 500 },
    },

    audioUrl: { type: String, default: '' },

    // Admin-curated "popular searches" row on the dictionary page.
    featured:      { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number,  default: 0 },

    // Auto-incremented when getWordById is called — useful for analytics
    // and a future "automatic top-N" mode if we move away from manual flagging.
    lookups: { type: Number, default: 0 },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// Single text index covers both languages + transliteration.
dictionarySchema.index({
  english:         'text',
  pashto:          'text',
  transliteration: 'text',
}, {
  weights: { english: 10, pashto: 10, transliteration: 5 },
  name:    'dict_text_index',
});

// Featured row ordering — fast read for the popular endpoint.
dictionarySchema.index({ featured: 1, featuredOrder: 1 });

module.exports = mongoose.model('Dictionary', dictionarySchema);
