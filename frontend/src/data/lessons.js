/**
 * Static fallback list of lessons. Used when:
 *   - the backend is unreachable
 *   - the database is empty (e.g. before running `npm run seed`)
 *
 * `slug` MUST match the slug used by the backend Lesson model (see seedData.js)
 * because the frontend routes by slug now (`/learn/:slug`).
 */
export const lessons = [
  {
    id: 1, slug: 'pashto-alphabet',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Pashto Alphabet', ps: 'پښتو الفبا' },
    description: {
      en: 'Learn all 44 letters of the Pashto alphabet with pronunciation.',
      ps: 'د پښتو الفبا ټولې ۴۴ توری د تلفظ سره زده کړئ.',
    },
    lessons: 12, duration: '2h 30m',
    color: 'from-primary-400 to-primary-600', icon: '📝',
  },
  {
    id: 2, slug: 'greetings-phrases',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Greetings & Phrases', ps: 'سلامونه او جملې' },
    description: {
      en: 'Everyday greetings and useful phrases to start conversations.',
      ps: 'د ورځني سلامونه او د خبرو پیلولو لپاره ګټورې جملې.',
    },
    lessons: 8, duration: '1h 45m',
    color: 'from-gold-400 to-gold-600', icon: '👋',
  },
  {
    id: 3, slug: 'pashto-numbers',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Pashto Numbers', ps: 'پښتو شمیرې' },
    description: {
      en: 'Master Pashto numbers 1–100 and counting expressions.',
      ps: 'د پښتو شمیرې ۱ تر ۱۰۰ پورې او د شمیرلو جملې زده کړئ.',
    },
    lessons: 5, duration: '1h',
    color: 'from-crimson-500 to-crimson-600', icon: '🔢',
  },
  {
    id: 4, slug: 'colors',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Colors in Pashto', ps: 'په پښتو کې رنګونه' },
    description: {
      en: 'Learn all Pashto color names with example sentences.',
      ps: 'د پښتو ټول رنګونه د مثال جملو سره زده کړئ.',
    },
    lessons: 4, duration: '45m',
    color: 'from-gold-400 to-crimson-400', icon: '🎨',
  },
  {
    id: 5, slug: 'family-relatives',
    level: 'Intermediate', levelPs: 'منځنی',
    title: { en: 'Family & Relatives', ps: 'کورنۍ او خپلوان' },
    description: {
      en: 'Vocabulary for family members and extended relatives.',
      ps: 'د کورنۍ غړو او خپلوانو لپاره لغتونه.',
    },
    lessons: 10, duration: '1h',
    color: 'from-primary-500 to-gold-500', icon: '👨‍👩‍👧',
  },
  {
    id: 6, slug: 'grammar-basics',
    level: 'Intermediate', levelPs: 'منځنی',
    title: { en: 'Grammar Basics', ps: 'د ګرامر اساسات' },
    description: {
      en: 'Understand Pashto sentence structure, verbs and tenses.',
      ps: 'د پښتو د جملې جوړښت، فعلونه او زمانې پوه شئ.',
    },
    lessons: 14, duration: '3h 20m',
    color: 'from-sand-400 to-gold-500', icon: '📚',
  },
  {
    id: 7, slug: 'children-names',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Children Names', ps: 'د ماشومانو نومونه' },
    description: {
      en: 'Beautiful and popular Pashto names for boys and girls with meanings.',
      ps: 'د هلکانو او نجونو لپاره ښکلي او مشهور پښتو نومونه د معناګانو سره.',
    },
    lessons: 6, duration: '1h',
    color: 'from-primary-300 to-gold-400', icon: '👶',
  },
  {
    id: 8, slug: 'nature-vocabulary',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Nature Vocabulary', ps: 'د طبیعت لغتونه' },
    description: {
      en: 'Pashto names for mountains, rivers, sky, weather and natural scenery.',
      ps: 'د غرونو، سیندونو، اسمان، هوا او طبیعي مناظرو پښتو نومونه.',
    },
    lessons: 7, duration: '1h 15m',
    color: 'from-primary-600 to-primary-400', icon: '🏔️',
  },
  {
    id: 9, slug: 'pashto-poetry',
    level: 'Advanced', levelPs: 'پرمختللی',
    title: { en: 'Pashto Poetry Reading', ps: 'د پښتو شعر لوستل' },
    description: {
      en: 'Read and understand classical Pashto poetry and its beauty.',
      ps: 'کلاسیک پښتو شعر ولولئ او د هغه ښکلا درک کړئ.',
    },
    lessons: 9, duration: '2h 50m',
    color: 'from-primary-600 to-primary-800', icon: '🎭',
  },
  {
    id: 10, slug: 'daily-use-words',
    level: 'Advanced', levelPs: 'پرمختللی',
    title: { en: 'Daily Use Words', ps: 'ورځني کلمې' },
    description: {
      en: 'Speak Pashto confidently in daily real-world situations.',
      ps: 'په ورځني ژوند کې په اعتماد سره پښتو وغږېږئ.',
    },
    lessons: 16, duration: '4h',
    color: 'from-gold-600 to-crimson-500', icon: '💬',
  },
  {
    id: 11, slug: 'food-drinks',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Food & Drinks', ps: 'خواړه او څښاک' },
    description: {
      en: 'Vocabulary and phrases for food, cooking and dining out.',
      ps: 'د خوړو، پخلي او د بهر د ډوډۍ لپاره لغتونه.',
    },
    lessons: 7, duration: '1h 30m',
    color: 'from-crimson-500 to-gold-400', icon: '🍽️',
  },
]

export const lessonCategories = lessons
export default lessons
