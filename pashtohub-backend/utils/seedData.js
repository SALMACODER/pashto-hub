/**
 * Seed script — populates the database with the same dummy data
 * currently used by the React frontend (books, lessons, dictionary)
 * and creates an admin account from .env.
 *
 * Usage:
 *   npm run seed            → inserts data
 *   npm run seed:destroy    → wipes all data
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const Lesson = require('../models/Lesson');
const Dictionary = require('../models/Dictionary');
const Leader = require('../models/Leader');

const books = [
  {
    title: { en: 'Diwan of Rahman Baba', ps: 'د رحمان بابا دیوان' },
    author: { en: 'Rahman Baba', ps: 'رحمان بابا' },
    category: 'poetry',
    pages: 412,
    rating: 4.9,
    color: 'from-primary-500 to-primary-700',
    // fileUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/preview',
     fileUrl: 'https://drive.google.com/file/d/1B2jn8_MfBsQHKuuOP8SqgbjpfhT4EFPG/preview',
    description: {
      en: 'The timeless mystical poetry of the beloved Sufi poet Rahman Baba.',
      ps: 'د پیاوړي صوفي شاعر رحمان بابا تلپاتې روحاني شاعري.',
    },
  },
  {
    title: { en: 'Diwan of Khushal Khan Khattak', ps: 'د خوشال خان خټک دیوان' },
    author: { en: 'Khushal Khan Khattak', ps: 'خوشال خان خټک' },
    category: 'poetry',
    pages: 520,
    rating: 4.8,
    color: 'from-gold-500 to-gold-700',
    description: {
      en: "The warrior poet's masterpiece — bravery, love and wisdom in verse.",
      ps: 'د جنګیالي شاعر شاهکار — میړانه، مینه او حکمت په شعر کې.',
    },
  },
  {
    title: { en: 'Pata Khazana', ps: 'پټه خزانه' },
    author: { en: 'Muhammad Hotak', ps: 'محمد هوتک' },
    category: 'history',
    pages: 280,
    rating: 4.7,
    color: 'from-crimson-500 to-crimson-600',
    description: {
      en: 'A historical anthology of Pashto poets, a treasure of literature.',
      ps: 'د پښتو شاعرانو تاریخي ټولګه، د ادبیاتو خزانه.',
    },
  },
  {
    title: { en: 'The Pathans', ps: 'پښتانه' },
    author: { en: 'Olaf Caroe', ps: 'اولف کارو' },
    category: 'history',
    pages: 560,
    rating: 4.6,
    color: 'from-primary-600 to-gold-500',
    description: {
      en: 'A definitive history of the Pashtun people and their lands.',
      ps: 'د پښتنو او د دوی د ځمکو جامع تاریخ.',
    },
  },
  {
    title: { en: 'Pashto Folk Tales', ps: 'د پښتو ولسي کیسې' },
    author: { en: 'Various', ps: 'بېلابېل' },
    category: 'children',
    pages: 180,
    rating: 4.7,
    color: 'from-gold-400 to-crimson-500',
    description: {
      en: 'Beautiful folk stories passed down through generations.',
      ps: 'ښکلې ولسي کیسې چې له نسل څخه نسل ته رسیدلي.',
    },
  },
];

// 11 lessons. Each defines its own slug + at least one chapter so the
// LessonDetail page has real content to render after seeding.
const lessons = [
  {
    slug: 'pashto-alphabet',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Pashto Alphabet', ps: 'پښتو الفبا' },
    description: {
      en: 'Learn all 44 letters of the Pashto alphabet with pronunciation.',
      ps: 'د پښتو الفبا ټولې ۴۴ توری د تلفظ سره زده کړئ.',
    },
    duration: '2h 30m', color: 'from-primary-400 to-primary-600', icon: '📝', order: 1,
    chapters: [
      {
        title: { en: 'Letters 1–22', ps: 'توري ۱–۲۲' },
        type: 'alphabet', order: 1,
        items: [
          { letter: 'ا', name: 'Alef', sound: 'a' },
          { letter: 'آ', name: 'Alef Madda', sound: 'aa' },
          { letter: 'ب', name: 'Be', sound: 'b' },
          { letter: 'پ', name: 'Pe', sound: 'p' },
          { letter: 'ت', name: 'Te', sound: 't' },
          { letter: 'ټ', name: 'Ṭe', sound: 'ṭ' },
          { letter: 'ث', name: 'Se', sound: 's' },
          { letter: 'ج', name: 'Jeem', sound: 'j' },
          { letter: 'چ', name: 'Che', sound: 'ch' },
          { letter: 'ح', name: 'He', sound: 'h' },
          { letter: 'خ', name: 'Khe', sound: 'kh' },
          { letter: 'د', name: 'Dal', sound: 'd' },
          { letter: 'ډ', name: 'Ḍal', sound: 'ḍ' },
          { letter: 'ذ', name: 'Zal', sound: 'z' },
          { letter: 'ر', name: 'Re', sound: 'r' },
          { letter: 'ړ', name: 'Ṛe', sound: 'ṛ' },
          { letter: 'ز', name: 'Ze', sound: 'z' },
          { letter: 'ژ', name: 'Zhe', sound: 'zh' },
          { letter: 'ږ', name: 'Ǵe', sound: 'ģ' },
          { letter: 'س', name: 'Seen', sound: 's' },
          { letter: 'ش', name: 'Sheen', sound: 'sh' },
          { letter: 'ښ', name: 'Ṣhe', sound: 'x' },
        ],
      },
      {
        title: { en: 'Letters 23–44', ps: 'توري ۲۳–۴۴' },
        type: 'alphabet', order: 2,
        items: [
          { letter: 'ص', name: 'Saad', sound: 's' },
          { letter: 'ض', name: 'Zaad', sound: 'z' },
          { letter: 'ط', name: 'Twa', sound: 't' },
          { letter: 'ظ', name: 'Zwa', sound: 'z' },
          { letter: 'ع', name: 'Ain', sound: 'ʿ' },
          { letter: 'غ', name: 'Ghain', sound: 'gh' },
          { letter: 'ف', name: 'Fe', sound: 'f' },
          { letter: 'ق', name: 'Qaaf', sound: 'q' },
          { letter: 'ک', name: 'Kaaf', sound: 'k' },
          { letter: 'ګ', name: 'Gae', sound: 'g' },
          { letter: 'ل', name: 'Laam', sound: 'l' },
          { letter: 'م', name: 'Meem', sound: 'm' },
          { letter: 'ن', name: 'Noon', sound: 'n' },
          { letter: 'ڼ', name: 'Ṇoon', sound: 'ṇ' },
          { letter: 'و', name: 'Wao', sound: 'w/u' },
          { letter: 'ه', name: 'He', sound: 'h' },
          { letter: 'ی', name: 'Ye', sound: 'y/ee' },
          { letter: 'ې', name: 'E', sound: 'e' },
          { letter: 'ۍ', name: 'Ey', sound: 'ey' },
          { letter: 'ئ', name: 'Hamza Ye', sound: 'ay' },
          { letter: 'ء', name: 'Hamza', sound: 'ʾ' },
          { letter: 'ۀ', name: 'He Hamza', sound: 'a' },
        ],
      },
    ],
  },

  {
    slug: 'greetings-phrases',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Greetings & Phrases', ps: 'سلامونه او جملې' },
    description: {
      en: 'Everyday greetings and useful phrases to start conversations.',
      ps: 'د ورځني سلامونه او د خبرو پیلولو لپاره ګټورې جملې.',
    },
    duration: '1h 45m', color: 'from-gold-400 to-gold-600', icon: '👋', order: 2,
    chapters: [
      {
        title: { en: 'Common Greetings', ps: 'عام سلامونه' }, type: 'phrases', order: 1,
        items: [
          { ps: 'السلام علیکم', roman: 'As-salamu alaykum', en: 'Peace be upon you (Hello)' },
          { ps: 'وعلیکم السلام', roman: 'Wa alaykum as-salam', en: 'And upon you peace (Reply)' },
          { ps: 'سلام', roman: 'Salaam', en: 'Hello / Hi' },
          { ps: 'ښه راغلاست', roman: 'Kha raghlast', en: 'Welcome' },
          { ps: 'خدای پہ امان', roman: 'Khudaay pa amaan', en: 'Goodbye' },
          { ps: 'بیا به لیدلو', roman: 'Bya ba leedalo', en: 'See you again' },
        ],
      },
      {
        title: { en: 'Asking How Are You', ps: 'د حال پوښتنه' }, type: 'phrases', order: 2,
        items: [
          { ps: 'څه حال دې؟', roman: 'Tse haal de?', en: 'How are you?' },
          { ps: 'ښه یم، مننه', roman: 'Kha yem, manana', en: 'I am fine, thank you' },
          { ps: 'تاسې څنګه یاست؟', roman: 'Taase tsanga yaast?', en: 'How are you? (formal)' },
        ],
      },
    ],
  },

  {
    slug: 'pashto-numbers',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Pashto Numbers', ps: 'پښتو شمیرې' },
    description: {
      en: 'Master Pashto numbers 1–100 and counting expressions.',
      ps: 'د پښتو شمیرې ۱ تر ۱۰۰ پورې او د شمیرلو جملې زده کړئ.',
    },
    duration: '1h', color: 'from-crimson-500 to-crimson-600', icon: '🔢', order: 3,
    chapters: [
      {
        title: { en: 'Numbers 1–10', ps: 'شمیرې ۱–۱۰' }, type: 'phrases', order: 1,
        items: [
          { ps: 'یو', roman: 'Yaw', en: '1 — One' },
          { ps: 'دوه', roman: 'Dwa', en: '2 — Two' },
          { ps: 'درې', roman: 'Dre', en: '3 — Three' },
          { ps: 'څلور', roman: 'Tsalor', en: '4 — Four' },
          { ps: 'پنځه', roman: 'Pinza', en: '5 — Five' },
          { ps: 'شپږ', roman: 'Shpag', en: '6 — Six' },
          { ps: 'اووه', roman: 'Owa', en: '7 — Seven' },
          { ps: 'اته', roman: 'Ata', en: '8 — Eight' },
          { ps: 'نهه', roman: 'Na', en: '9 — Nine' },
          { ps: 'لس', roman: 'Las', en: '10 — Ten' },
        ],
      },
      {
        title: { en: 'Numbers 11–50', ps: 'شمیرې ۱۱–۵۰' }, type: 'phrases', order: 2,
        items: [
          { ps: 'یوولس', roman: 'Yoolas', en: '11 — Eleven' },
          { ps: 'دولس', roman: 'Dolas', en: '12 — Twelve' },
          { ps: 'دیارلس', roman: 'Dyarlas', en: '13 — Thirteen' },
          { ps: 'څوارلس', roman: 'Tswarlas', en: '14 — Fourteen' },
          { ps: 'پنځلس', roman: 'Pinzalas', en: '15 — Fifteen' },
          { ps: 'شل', roman: 'Shel', en: '20 — Twenty' },
          { ps: 'دیرش', roman: 'Deersh', en: '30 — Thirty' },
          { ps: 'څلوېښت', roman: 'Tsalwekht', en: '40 — Forty' },
          { ps: 'پنځوس', roman: 'Pinzoos', en: '50 — Fifty' },
        ],
      },
      {
        title: { en: 'Numbers 51–100 & beyond', ps: 'شمیرې ۵۱–۱۰۰ او زیات' }, type: 'phrases', order: 3,
        items: [
          { ps: 'شپیته', roman: 'Shpeta', en: '60 — Sixty' },
          { ps: 'اویا', roman: 'Awya', en: '70 — Seventy' },
          { ps: 'اتیا', roman: 'Atya', en: '80 — Eighty' },
          { ps: 'نوي', roman: 'Nawi', en: '90 — Ninety' },
          { ps: 'سل', roman: 'Sal', en: '100 — One Hundred' },
          { ps: 'زر', roman: 'Zar', en: '1000 — One Thousand' },
        ],
      },
    ],
  },

  {
    slug: 'colors',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Colors in Pashto', ps: 'په پښتو کې رنګونه' },
    description: {
      en: 'Learn all Pashto color names with example sentences.',
      ps: 'د پښتو ټول رنګونه د مثال جملو سره زده کړئ.',
    },
    duration: '45m', color: 'from-gold-400 to-crimson-400', icon: '🎨', order: 4,
    chapters: [
      {
        title: { en: 'Basic Colors', ps: 'اصلي رنګونه' }, type: 'colors', order: 1,
        items: [
          { ps: 'سور', roman: 'Sor', en: 'Red', hex: '#e53e3e' },
          { ps: 'شین', roman: 'Sheen', en: 'Green', hex: '#38a169' },
          { ps: 'آسماني', roman: 'Aasmani', en: 'Blue', hex: '#3182ce' },
          { ps: 'ژیړ', roman: 'Zheer', en: 'Yellow', hex: '#d69e2e' },
          { ps: 'تور', roman: 'Tor', en: 'Black', hex: '#1a1a1a' },
          { ps: 'سپین', roman: 'Speen', en: 'White', hex: '#e2e8f0' },
        ],
      },
      {
        title: { en: 'Shades & Usage', ps: 'سيوري او کارونه' }, type: 'colors', order: 2,
        items: [
          { ps: 'نارنجي', roman: 'Naaranji', en: 'Orange', hex: '#dd6b20' },
          { ps: 'ارغواني', roman: 'Arghwaani', en: 'Purple', hex: '#805ad5' },
          { ps: 'ګلابي', roman: 'Gulaabi', en: 'Pink', hex: '#d53f8c' },
          { ps: 'بادامي', roman: 'Baadaami', en: 'Brown', hex: '#7b4f2e' },
          { ps: 'خړ', roman: 'Khar', en: 'Grey', hex: '#718096' },
          { ps: 'زیتوني', roman: 'Zeitooni', en: 'Olive Green', hex: '#6b7c2d' },
        ],
      },
    ],
  },

  {
    slug: 'family-relatives',
    level: 'Intermediate', levelPs: 'منځنی',
    title: { en: 'Family & Relatives', ps: 'کورنۍ او خپلوان' },
    description: {
      en: 'Vocabulary for family members and extended relatives.',
      ps: 'د کورنۍ غړو او خپلوانو لپاره لغتونه.',
    },
    duration: '1h', color: 'from-primary-500 to-gold-500', icon: '👨‍👩‍👧', order: 5,
    chapters: [
      {
        title: { en: 'Immediate Family', ps: 'نږدې کورنۍ' }, type: 'phrases', order: 1,
        items: [
          { ps: 'پلار', roman: 'Plaar', en: 'Father' },
          { ps: 'مور', roman: 'Mor', en: 'Mother' },
          { ps: 'ورور', roman: 'Wror', en: 'Brother' },
          { ps: 'خور', roman: 'Khor', en: 'Sister' },
          { ps: 'زوی', roman: 'Zoy', en: 'Son' },
          { ps: 'لور', roman: 'Lor', en: 'Daughter' },
        ],
      },
      {
        title: { en: 'Extended Family', ps: 'پراخه کورنۍ' }, type: 'phrases', order: 2,
        items: [
          { ps: 'نیکه', roman: 'Neeka', en: 'Grandfather' },
          { ps: 'نیا', roman: 'Nyaa', en: 'Grandmother' },
          { ps: 'ترور', roman: 'Tror', en: 'Aunt (paternal)' },
          { ps: 'تره', roman: 'Tra', en: 'Uncle (paternal)' },
          { ps: 'ملګری', roman: 'Malgaray', en: 'Friend (male)' },
          { ps: 'ملګرې', roman: 'Malgare', en: 'Friend (female)' },
        ],
      },
    ],
  },

  {
    slug: 'grammar-basics',
    level: 'Intermediate', levelPs: 'منځنی',
    title: { en: 'Grammar Basics', ps: 'د ګرامر اساسات' },
    description: {
      en: 'Understand Pashto sentence structure, verbs and tenses.',
      ps: 'د پښتو د جملې جوړښت، فعلونه او زمانې پوه شئ.',
    },
    duration: '3h 20m', color: 'from-sand-400 to-gold-500', icon: '📚', order: 6,
    chapters: [
      {
        title: { en: 'Sentence Structure (Pronouns)', ps: 'د جملې جوړښت (ضمیرونه)' },
        type: 'phrases', order: 1,
        items: [
          { ps: 'زه', roman: 'Za', en: 'I' },
          { ps: 'ته', roman: 'Ta', en: 'You (singular)' },
          { ps: 'هغه', roman: 'Hagha', en: 'He / She / It' },
          { ps: 'موږ', roman: 'Moong', en: 'We' },
          { ps: 'تاسې', roman: 'Taase', en: 'You (plural / formal)' },
          { ps: 'هغوی', roman: 'Haghwey', en: 'They' },
        ],
      },
      {
        title: { en: 'Verbs', ps: 'فعلونه' }, type: 'phrases', order: 2,
        items: [
          { ps: 'کول', roman: 'Kawul', en: 'To do' },
          { ps: 'تلل', roman: 'Tlal', en: 'To go' },
          { ps: 'راتلل', roman: 'Raatlal', en: 'To come' },
          { ps: 'خوړل', roman: 'Khwral', en: 'To eat' },
          { ps: 'لوستل', roman: 'Lwastal', en: 'To read' },
          { ps: 'لیکل', roman: 'Leekal', en: 'To write' },
          { ps: 'لیدل', roman: 'Leedal', en: 'To see' },
          { ps: 'ویل', roman: 'Wayal', en: 'To say' },
        ],
      },
      {
        title: { en: 'Tenses (Simple Sentences)', ps: 'زمانې (ساده جملې)' },
        type: 'phrases', order: 3,
        items: [
          { ps: 'زه ښوونځي ته ځم', roman: 'Za shwondzey ta dzem', en: 'I go to school' },
          { ps: 'هغه کتاب لولي', roman: 'Hagha kitaab lwali', en: 'He/She reads a book' },
          { ps: 'موږ پښتو زده کوو', roman: 'Moong Pashto zda kawoo', en: 'We are learning Pashto' },
          { ps: 'دا ښه دی', roman: 'Daa kha dey', en: 'This is good' },
        ],
      },
    ],
  },

  {
    slug: 'children-names',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Children Names', ps: 'د ماشومانو نومونه' },
    description: {
      en: 'Beautiful and popular Pashto names for boys and girls with meanings.',
      ps: 'د هلکانو او نجونو لپاره ښکلي او مشهور پښتو نومونه د معناګانو سره.',
    },
    duration: '1h', color: 'from-primary-300 to-gold-400', icon: '👶', order: 7,
    chapters: [
      {
        title: { en: "Boys' Names", ps: 'د هلکانو نومونه' }, type: 'names', order: 1,
        items: [
          { ps: 'احمد', roman: 'Ahmad', en: 'Most praised' },
          { ps: 'ځلمی', roman: 'Zalmay', en: 'Youth / Young man' },
          { ps: 'حمزه', roman: 'Hamza', en: 'Strong / Lion' },
          { ps: 'لمر', roman: 'Lamar', en: 'Sun' },
          { ps: 'بریالی', roman: 'Baryalay', en: 'Successful / Winner' },
          { ps: 'توریالی', roman: 'Toryalay', en: 'Brave warrior' },
        ],
      },
      {
        title: { en: "Girls' Names", ps: 'د نجونو نومونه' }, type: 'names', order: 2,
        items: [
          { ps: 'ګلالۍ', roman: 'Gulalai', en: 'Rosy / Like a flower' },
          { ps: 'سپوږمۍ', roman: 'Spoghmay', en: 'Moon' },
          { ps: 'زرغونه', roman: 'Zarghuna', en: 'Green / Fresh' },
          { ps: 'هیله', roman: 'Heela', en: 'Hope' },
          { ps: 'مریم', roman: 'Maryam', en: 'Pure / Mary' },
        ],
      },
    ],
  },

  {
    slug: 'nature-vocabulary',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Nature Vocabulary', ps: 'د طبیعت لغتونه' },
    description: {
      en: 'Pashto names for mountains, rivers, sky, weather and natural scenery.',
      ps: 'د غرونو، سیندونو، اسمان، هوا او طبیعي مناظرو پښتو نومونه.',
    },
    duration: '1h 15m', color: 'from-primary-600 to-primary-400', icon: '🏔️', order: 8,
    chapters: [
      {
        title: { en: 'Mountains & Land', ps: 'غرونه او ځمکه' }, type: 'phrases', order: 1,
        items: [
          { ps: 'غر', roman: 'Ghar', en: 'Mountain' },
          { ps: 'دره', roman: 'Dara', en: 'Valley' },
          { ps: 'ځمکه', roman: 'Zmaka', en: 'Earth / Ground / Land' },
          { ps: 'کلی', roman: 'Kalay', en: 'Village' },
        ],
      },
      {
        title: { en: 'Water & Sky', ps: 'اوبه او اسمان' }, type: 'phrases', order: 2,
        items: [
          { ps: 'سیند', roman: 'Seend', en: 'River' },
          { ps: 'اوبه', roman: 'Oba', en: 'Water' },
          { ps: 'اسمان', roman: 'Asmaan', en: 'Sky' },
          { ps: 'لمر', roman: 'Lamar', en: 'Sun' },
          { ps: 'سپوږمۍ', roman: 'Spoghmay', en: 'Moon' },
          { ps: 'باران', roman: 'Baaraan', en: 'Rain' },
        ],
      },
    ],
  },

  {
    slug: 'pashto-poetry',
    level: 'Advanced', levelPs: 'پرمختللی',
    title: { en: 'Pashto Poetry Reading', ps: 'د پښتو شعر لوستل' },
    description: {
      en: 'Read and understand classical Pashto poetry and its beauty.',
      ps: 'کلاسیک پښتو شعر ولولئ او د هغه ښکلا درک کړئ.',
    },
    duration: '2h 50m', color: 'from-primary-600 to-primary-800', icon: '🎭', order: 9,
    chapters: [
      {
        title: { en: 'Rahman Baba — Famous Verses', ps: 'رحمان بابا — مشهور بیتونه' },
        type: 'phrases', order: 1,
        items: [
          { ps: 'چې مینه وکړې نو بد مه ګڼه', roman: 'Che meena wukre no bad ma gna', en: 'If you love, think no ill' },
          { ps: 'د مینې لار ډیره اوږده ده', roman: 'Da meena laar dera owzda da', en: 'The path of love is very long' },
        ],
      },
      {
        title: { en: 'Khushal Khan Khattak — Verses', ps: 'خوشال خان خټک — بیتونه' },
        type: 'phrases', order: 2,
        items: [
          { ps: 'پښتون هغه دی چې پښتو وکړي', roman: 'Pashtoon hagha dey che Pashto wukri', en: 'A Pashtun is one who practices Pashtunwali' },
          { ps: 'د میړانې نوم دې ژوندی وي', roman: 'Da meeraane num de zhwandey wi', en: 'May the name of bravery live on' },
        ],
      },
    ],
  },

  {
    slug: 'daily-use-words',
    level: 'Advanced', levelPs: 'پرمختللی',
    title: { en: 'Daily Use Words', ps: 'ورځني کلمې' },
    description: {
      en: 'Speak Pashto confidently in daily real-world situations.',
      ps: 'په ورځني ژوند کې په اعتماد سره پښتو وغږېږئ.',
    },
    duration: '4h', color: 'from-gold-600 to-crimson-500', icon: '💬', order: 10,
    chapters: [
      {
        title: { en: 'Daily Conversations', ps: 'ورځني خبرې' }, type: 'phrases', order: 1,
        items: [
          { ps: 'دا څومره پیسې دي؟', roman: 'Daa tsomra pese dee?', en: 'How much does this cost?' },
          { ps: 'ما ته مرسته وکړه', roman: 'Maa ta mrasta wukra', en: 'Please help me' },
          { ps: 'زه نه پوهیږم', roman: 'Za na pohegem', en: 'I do not understand' },
          { ps: 'ورو ورو خبرې وکړه', roman: 'Wro wro khabre wukra', en: 'Please speak slowly' },
          { ps: 'بیا یې ووایه', roman: 'Bya ye wowaya', en: 'Please repeat that' },
          { ps: 'روغتون چرته دی؟', roman: 'Roghtoon cherta dey?', en: 'Where is the hospital?' },
        ],
      },
    ],
  },

  {
    slug: 'food-drinks',
    level: 'Beginner', levelPs: 'پیل کوونکی',
    title: { en: 'Food & Drinks', ps: 'خواړه او څښاک' },
    description: {
      en: 'Vocabulary and phrases for food, cooking and dining out.',
      ps: 'د خوړو، پخلي او د بهر د ډوډۍ لپاره لغتونه.',
    },
    duration: '1h 30m', color: 'from-crimson-500 to-gold-400', icon: '🍽️', order: 11,
    chapters: [
      {
        title: { en: 'Food Vocabulary', ps: 'د خواړو لغتونه' }, type: 'phrases', order: 1,
        items: [
          { ps: 'ډوډۍ', roman: 'Doodey', en: 'Bread / Food / Meal' },
          { ps: 'اوبه', roman: 'Oba', en: 'Water' },
          { ps: 'چای', roman: 'Chaay', en: 'Tea' },
          { ps: 'غوښه', roman: 'Ghwakha', en: 'Meat' },
          { ps: 'وريژې', roman: 'Wreeje', en: 'Rice' },
          { ps: 'سبزي', roman: 'Sabzi', en: 'Vegetables' },
          { ps: 'مڼه', roman: 'Mana', en: 'Apple' },
          { ps: 'شودې', roman: 'Shwude', en: 'Milk' },
        ],
      },
      {
        title: { en: 'At the Restaurant', ps: 'د هوټل کې' }, type: 'phrases', order: 2,
        items: [
          { ps: 'مینو راوړه', roman: 'Menoo raawra', en: 'Bring the menu' },
          { ps: 'زه بهوکی یم', roman: 'Za bhwukey yem', en: 'I am hungry' },
          { ps: 'خواړه ډیر خوندور دي', roman: 'Khwaara deer khwandoor dee', en: 'The food is very delicious' },
          { ps: 'حساب راوړه', roman: 'Hisaab raawra', en: 'Bring the bill' },
        ],
      },
    ],
  },
];

// First 5 entries are flagged featured so the dictionary page renders a real
// "Popular searches" row immediately after seeding (lower order = appears first).
const dictionary = [
  {
    english: 'Hello', pashto: 'سلام', transliteration: 'Salaam',
    partOfSpeech: { en: 'Interjection', ps: 'د تعجب ټکی' },
    meaning: {
      en: 'A greeting said when meeting someone.',
      ps: 'د یو چا سره د مخامخ کیدو په وخت کې ویل کیږي.',
    },
    example: { en: 'Hello, how are you?', ps: 'سلام، څنګه یې؟' },
    featured: true, featuredOrder: 1,
  },
  {
    english: 'Friend', pashto: 'ملګری', transliteration: 'Malgaray',
    partOfSpeech: { en: 'Noun', ps: 'نوم' },
    meaning: {
      en: 'A person whom one knows well and regards with affection.',
      ps: 'هغه څوک چې موږ یې ښه پیژنو او ورسره مینه لرو.',
    },
    example: { en: 'He is my best friend.', ps: 'هغه زما ډیر ښه ملګری دی.' },
    featured: true, featuredOrder: 2,
  },
  {
    english: 'Mother', pashto: 'مور', transliteration: 'Moor',
    partOfSpeech: { en: 'Noun', ps: 'نوم' },
    meaning: { en: 'A female parent.', ps: 'ښځینه مور.' },
    example: { en: 'My mother cooks delicious food.', ps: 'زما مور خوندور خواړه پخوي.' },
    featured: true, featuredOrder: 3,
  },
  {
    english: 'Love', pashto: 'مینه', transliteration: 'Meena',
    partOfSpeech: { en: 'Noun', ps: 'نوم' },
    meaning: {
      en: 'A deep affection or strong feeling of attachment.',
      ps: 'ژوره مینه یا د تړلي کیدو قوي احساس.',
    },
    example: { en: 'Love is the greatest feeling.', ps: 'مینه تر ټولو لوی احساس دی.' },
    featured: true, featuredOrder: 4,
  },
  {
    english: 'Home', pashto: 'کور', transliteration: 'Kor',
    partOfSpeech: { en: 'Noun', ps: 'نوم' },
    meaning: { en: 'The place where one lives permanently.', ps: 'هغه ځای چې څوک په دایمي توګه اوسیږي.' },
    example: { en: 'There is no place like home.', ps: 'د کور په څیر هیڅ ځای نشته.' },
    featured: true, featuredOrder: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Leaders — bilingual notable Pashtuns. Slugs are also auto-generated by the
// model, but we set them explicitly so the static frontend fallback (which
// uses these slugs in URLs) lines up with the DB exactly.
// ─────────────────────────────────────────────────────────────────────────────
const leaders = [
  {
    slug: 'rahman-baba',
    name: { en: 'Rahman Baba', ps: 'رحمان بابا' },
    role: { en: 'Sufi Poet', ps: 'صوفي شاعر' },
    era: '1653 – 1711',
    type: { en: 'Poet', ps: 'شاعر' },
    color: 'from-green-700 to-green-900',
    emoji: '📜',
    description: {
      en: 'The beloved Sufi poet of the Pashtuns, known for his spiritual and mystic poetry about love and God.',
      ps: 'د پښتنو د مینې صوفي شاعر چې د مینې او د خدای د مینې په اړه یې روحاني شاعري کړې.',
    },
    biography: {
      en: 'Rahman Baba, born Abdur Rahman, was a 17th-century Pashtun Sufi poet born in the village of Bahadur Kalay near Peshawar. He is considered one of the greatest poets in the Pashto language and is often called the "Nightingale of Peshawar." His poetry revolves around themes of divine love, mysticism, and the transient nature of life.',
      ps: 'رحمان بابا، د عبدالرحمان په نامه زیږیدلی، د ۱۷مې پیړۍ یو پښتون صوفي شاعر و چې د پښور سره نږدې د بهادر کلي په کلي کې زیږیدلی و. هغه د پښتو ژبې د لویو شاعرانو له ډلې شمیرل کیږي او ډیری وختونه "د پښور بلبل" بلل کیږي.',
    },
    achievements: {
      en: [
        'Wrote over 350 mystical poems in Pashto',
        'Considered the national poet of the Pashtuns',
        'His shrine in Peshawar is a major cultural site',
        'Poetry translated into many world languages',
      ],
      ps: [
        'د پښتو ژبې کې یې له ۳۵۰ زیاتې روحاني شعرونه ولیکل',
        'د پښتنو ملي شاعر ګڼل کیږي',
        'د پښور کې د هغه مزار یو لوی کلتوري ځای دی',
        'شاعري یې ډیرو نړیوالو ژبو ته ژباړل شوې',
      ],
    },
    quotes: [
      { ps: 'چې مینه وکړې نو بد مه ګڼه', en: 'If you love, think no ill of others' },
      { ps: 'د مینې لار ډیره اوږده ده', en: 'The path of love is very long' },
    ],
    order: 1,
  },
  {
    slug: 'khushal-khan-khattak',
    name: { en: 'Khushal Khan Khattak', ps: 'خوشال خان خټک' },
    role: { en: 'Warrior Poet & Chief', ps: 'جنګیالی شاعر او سردار' },
    era: '1613 – 1689',
    type: { en: 'Warrior & Poet', ps: 'جنګیالی او شاعر' },
    color: 'from-amber-600 to-amber-900',
    emoji: '⚔️',
    description: {
      en: 'National poet of the Pashtuns and tribal chief who fought for Pashtun freedom and unity.',
      ps: 'د پښتنو ملي شاعر او قبیلوي مشر چې د پښتنو د آزادۍ او یووالي لپاره یې جنګ وکړ.',
    },
    biography: {
      en: 'Khushal Khan Khattak was born in 1613 and became the paramount chief of the Khattak tribe. He is celebrated as the national poet of the Pashtuns and a great warrior who resisted Mughal rule. He wielded both the sword and the pen with equal mastery. He was imprisoned by the Mughal Emperor Aurangzeb for six years.',
      ps: 'خوشال خان خټک د ۱۶۱۳ کال کې زیږیدلی و او د خټک قبیلې لوی مشر شو. هغه د پښتنو ملي شاعر او یو لوی جنګیالی دی چې د مغلو واکمنۍ سره یې مقاومت وکړ.',
    },
    achievements: {
      en: [
        'Wrote over 45,000 verses in Pashto',
        'Led resistance against Mughal Emperor Aurangzeb',
        'Chief of the powerful Khattak tribe',
        'Symbol of Pashtun nationalism and resistance',
      ],
      ps: [
        'د پښتو ژبې کې یې له ۴۵۰۰۰ زیات بیتونه ولیکل',
        'د مغل بادشاه اورنګزیب پر ضد مقاومت یې مشري وکړه',
        'د پیاوړي خټک قبیلې مشر و',
        'د پښتون ملیت او مقاومت سمبول',
      ],
    },
    quotes: [
      { ps: 'پښتون هغه دی چې پښتو وکړي', en: 'A Pashtun is one who practices Pashtunwali' },
      { ps: 'د میړانې نوم دې ژوندی وي', en: 'May the name of bravery live on forever' },
    ],
    order: 2,
  },
  {
    slug: 'benazir-bhutto',
    name: { en: 'Benazir Bhutto', ps: 'بینظیر بھټو' },
    role: { en: 'Prime Minister of Pakistan', ps: 'د پاکستان لومړۍ وزیره' },
    era: '1953 – 2007',
    type: { en: 'Politician', ps: 'سیاستوال' },
    color: 'from-rose-600 to-rose-900',
    emoji: '🌹',
    description: {
      en: 'First female Prime Minister of Pakistan and a symbol of courage and democracy for Pashtun women.',
      ps: 'د پاکستان لومړۍ ښځینه لومړۍ وزیره او د پښتنو ښځو لپاره د زړورتیا او ولسواکۍ سمبول.',
    },
    biography: {
      en: 'Benazir Bhutto was born on June 21, 1953, in Karachi. She studied at Harvard and Oxford universities. In 1988, she became the first female Prime Minister of Pakistan and the first female head of government in the Muslim world.',
      ps: 'بینظیر بھټو د ۱۹۵۳ کال د جون ۲۱ نیټه کراچۍ کې زیږیدلې وه. هغه د هارورډ او آکسفورډ پوهنتونونو کې زده کړې وکړې.',
    },
    achievements: {
      en: [
        'First female Prime Minister of Pakistan',
        'First female head of government in Muslim world',
        'Graduated from Harvard and Oxford',
        'Champion of democracy and women\'s rights',
      ],
      ps: [
        'د پاکستان لومړۍ ښځینه لومړۍ وزیره',
        'د مسلمانو نړۍ کې د حکومت لومړۍ ښځینه مشره',
        'د هارورډ او آکسفورډ فارغه',
        'د ولسواکۍ او د ښځو د حقونو مدافعه',
      ],
    },
    quotes: [
      { ps: 'ولسواکي تر ټولو ښه انتقام دی', en: 'Democracy is the best revenge' },
    ],
    order: 3,
  },
  {
    slug: 'ghani-khan',
    name: { en: 'Ghani Khan', ps: 'غني خان' },
    role: { en: 'Poet, Artist & Philosopher', ps: 'شاعر، هنرمند او فیلسوف' },
    era: '1914 – 1996',
    type: { en: 'Poet & Artist', ps: 'شاعر او هنرمند' },
    color: 'from-purple-700 to-purple-900',
    emoji: '🎨',
    description: {
      en: 'One of the greatest modern Pashto poets, artists and philosophers — son of Khan Abdul Ghaffar Khan.',
      ps: 'د پښتو د عصري شاعرۍ، هنر او فلسفې یو له لویو استازو — د خان عبدالغفار خان زوی.',
    },
    biography: {
      en: 'Ghani Khan was born on April 23, 1914, in Utmanzai, Charsadda. He was the son of the legendary Khan Abdul Ghaffar Khan (Bacha Khan). He was a multi-talented genius — a poet, sculptor, painter, philosopher and author.',
      ps: 'غني خان د ۱۹۱۴ کال د اپریل ۲۳ نیټه د چارسده اوتمانزي کې زیږیدلی و. هغه د افسانوي خان عبدالغفار خان (باچا خان) زوی و.',
    },
    achievements: {
      en: [
        'Renowned Pashto poet and philosopher',
        'Talented sculptor and painter',
        'Wrote "The Pathans" — a masterpiece on Pashtun culture',
        'Son of Bacha Khan — Frontier Gandhi',
      ],
      ps: [
        'مشهور پښتو شاعر او فیلسوف',
        'استعداده مجسمه ساز او رسام',
        '"پښتانه" یې ولیکل — د پښتون کلتور یوه شاهکاره',
        'د باچا خان زوی — د سرحد ګاندي',
      ],
    },
    quotes: [
      { ps: 'پښتون د غرونو زوی دی، آزاد او لوړ', en: 'The Pashtun is the son of mountains, free and high' },
      { ps: 'مینه د ژوند رڼا ده', en: 'Love is the light of life' },
    ],
    order: 4,
  },
  {
    slug: 'khan-abdul-ghaffar-khan',
    name: { en: 'Khan Abdul Ghaffar Khan', ps: 'خان عبدالغفار خان' },
    role: { en: 'Frontier Gandhi', ps: 'د سرحد ګاندي' },
    era: '1890 – 1988',
    type: { en: 'Political Leader', ps: 'سیاسي مشر' },
    color: 'from-red-700 to-red-900',
    emoji: '☮️',
    description: {
      en: 'Known as the Frontier Gandhi, he led a non-violent movement for Pashtun rights and dignity.',
      ps: 'د سرحد ګاندي په نامه مشهور، هغه د پښتنو د حقونو او عزت لپاره د عدم تشدد غورځنګ مشري وکړه.',
    },
    biography: {
      en: 'Khan Abdul Ghaffar Khan, known as Bacha Khan and the Frontier Gandhi, was born in 1890 in Utmanzai. He founded the Khudai Khidmatgar movement — an army of non-violent soldiers dedicated to Pashtun rights and independence.',
      ps: 'خان عبدالغفار خان، د باچا خان او د سرحد ګاندي په نامه مشهور، د ۱۸۹۰ کال کې د اوتمانزي کې زیږیدلی و. هغه د خدایي خدمتګار غورځنګ بنسټ کیښود.',
    },
    achievements: {
      en: [
        'Founded Khudai Khidmatgar non-violent movement',
        'First non-Indian to receive Bharat Ratna',
        'Spent over 30 years in prison for Pashtun rights',
        'Close ally of Mahatma Gandhi',
      ],
      ps: [
        'د خدایي خدمتګار د عدم تشدد غورځنګ بنسټ یې کیښود',
        'د بهارت رتنا د ترلاسه کولو لومړی غیر هندي',
        'د پښتنو د حقونو لپاره یې له ۳۰ کالو زیات زندان وکاږه',
        'د مهاتما ګاندي نږدې ملګری',
      ],
    },
    quotes: [
      { ps: 'زما وسله صبر او حق دی', en: 'My weapon is patience and truth' },
      { ps: 'د پښتنو خدمت د خدای خدمت دی', en: 'Service to Pashtuns is service to God' },
    ],
    order: 5,
  },
  {
    slug: 'malala-yousafzai',
    name: { en: 'Malala Yousafzai', ps: 'ملاله یوسفزۍ' },
    role: { en: 'Nobel Peace Prize Laureate', ps: 'د نوبل د سولې جایزې ګټونکې' },
    era: '1997 – present',
    type: { en: 'Activist', ps: 'فعاله' },
    color: 'from-teal-600 to-teal-900',
    emoji: '📚',
    description: {
      en: 'Youngest Nobel Peace Prize winner and global advocate for girls education from Swat, Pakistan.',
      ps: 'د نوبل د سولې جایزې کم عمره ګټونکې او د نجونو د زده کړې نړیواله مدافعه له سوات، پاکستان.',
    },
    biography: {
      en: 'Malala Yousafzai was born on July 12, 1997, in Mingora, Swat. From a young age, she spoke out for girls\' right to education when the Taliban banned girls from attending school in Swat. On October 9, 2012, she was shot by a Taliban gunman on her school bus but miraculously survived. In 2014, at age 17, she became the youngest-ever Nobel Peace Prize laureate.',
      ps: 'ملاله یوسفزۍ د ۱۹۹۷ کال د جولای ۱۲ نیټه د سوات مینګوره کې زیږیدلې وه. له کمه عمره، هغه د طالبانو لخوا د سوات کې د ښوونځیو بندیدو پر وخت د نجونو د زده کړې د حق لپاره غږ پورته کړ.',
    },
    achievements: {
      en: [
        'Youngest Nobel Peace Prize winner (age 17)',
        'Founded the Malala Fund for girls education',
        'Survived Taliban assassination attempt in 2012',
        'Graduated from Oxford University in 2020',
      ],
      ps: [
        'د نوبل د سولې جایزې کم عمره ګټونکې (۱۷ کلنه)',
        'د نجونو د زده کړې لپاره د ملالې فنډ بنسټ یې کیښود',
        'د ۲۰۱۲ کال کې د طالبانو د وژنې هڅې څخه ژوندۍ پاتې شوه',
        'د ۲۰۲۰ کال کې د آکسفورډ پوهنتون فارغه شوه',
      ],
    },
    quotes: [
      { ps: 'یو ماشوم، یو ښوونکی، یو کتاب او یو قلم نړۍ بدلولی شي', en: 'One child, one teacher, one book and one pen can change the world' },
      { ps: 'کله چې نړۍ چوپ وي، یو غږ به قوي وي', en: 'When the whole world is silent, even one voice becomes powerful' },
    ],
    order: 6,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Wipe existing
    await User.deleteMany();
    await Book.deleteMany();
    await Lesson.deleteMany();
    await Dictionary.deleteMany();
    await Leader.deleteMany();

    // --- Build and validate the admin credentials first ---
    // Trim to remove accidental spaces or \r (Windows line endings) from .env
    const adminName     = (process.env.ADMIN_NAME     || 'Admin').trim();
    const adminEmail    = (process.env.ADMIN_EMAIL    || '[email protected]').trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || 'Admin@123').trim();

    // Validate against the same rules the User model uses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      throw new Error(
        `ADMIN_EMAIL in .env is invalid: "${adminEmail}". ` +
        `It must look like [email protected] (with a dot and domain).`
      );
    }
    if (adminPassword.length < 6) {
      throw new Error(
        `ADMIN_PASSWORD in .env must be at least 6 characters (currently "${adminPassword}").`
      );
    }

    console.log(`👤 Creating admin: ${adminEmail}`);

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    // Attach admin id to seed records
    const booksWithAuthor   = books.map((b)   => ({ ...b, addedBy: admin._id }));
    const lessonsWithAuthor = lessons.map((l) => ({ ...l, addedBy: admin._id }));
    const dictWithAuthor    = dictionary.map((d) => ({ ...d, addedBy: admin._id }));
    const leadersWithAuthor = leaders.map((ld) => ({ ...ld, addedBy: admin._id }));

    await Book.insertMany(booksWithAuthor);
    await Lesson.insertMany(lessonsWithAuthor);
    await Dictionary.insertMany(dictWithAuthor);
    // Leaders go through .create() (not insertMany) so the pre('validate')
    // slug-generation hook fires for any entry that didn't pre-set a slug.
    for (const ld of leadersWithAuthor) await Leader.create(ld);

    console.log('✅ Data seeded successfully');
    console.log(`👤 Admin — ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seed error: ${err.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Book.deleteMany();
    await Lesson.deleteMany();
    await Dictionary.deleteMany();
    await Leader.deleteMany();
    console.log('🗑  All data wiped');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Destroy error: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}