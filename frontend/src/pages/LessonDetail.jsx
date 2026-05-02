import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiCheck, FiLoader } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import { lessons as fallbackLessons } from '../data/lessons'
import api from '../api/axios'

/**
 * Static fallback chapter content keyed by SLUG (must match backend Lesson.slug
 * and src/data/lessons.js). Used only when:
 *   - the backend is unreachable, OR
 *   - the lesson exists in the lesson list but has no chapters yet (e.g. before
 *     `npm run seed` brings them across).
 *
 * Each entry shape mirrors the backend Lesson document's `chapters` array,
 * so the render function below can treat both sources identically.
 */
const STATIC_CHAPTERS = {
  'pashto-alphabet': [
    {
      title: { en: 'Pashto Alphabet — 44 Letters', ps: 'پښتو الفبا — ۴۴ توري' },
      type: 'alphabet',
      items: [
        { letter: 'ا', name: 'Alef', sound: 'a' }, { letter: 'آ', name: 'Alef Madda', sound: 'aa' },
        { letter: 'ب', name: 'Be', sound: 'b' },   { letter: 'پ', name: 'Pe', sound: 'p' },
        { letter: 'ت', name: 'Te', sound: 't' },   { letter: 'ټ', name: 'Ṭe', sound: 'ṭ' },
        { letter: 'ث', name: 'Se', sound: 's' },   { letter: 'ج', name: 'Jeem', sound: 'j' },
        { letter: 'چ', name: 'Che', sound: 'ch' }, { letter: 'ح', name: 'He', sound: 'h' },
        { letter: 'خ', name: 'Khe', sound: 'kh' }, { letter: 'د', name: 'Dal', sound: 'd' },
        { letter: 'ډ', name: 'Ḍal', sound: 'ḍ' },  { letter: 'ذ', name: 'Zal', sound: 'z' },
        { letter: 'ر', name: 'Re', sound: 'r' },   { letter: 'ړ', name: 'Ṛe', sound: 'ṛ' },
        { letter: 'ز', name: 'Ze', sound: 'z' },   { letter: 'ژ', name: 'Zhe', sound: 'zh' },
        { letter: 'ږ', name: 'Ǵe', sound: 'ģ' },   { letter: 'س', name: 'Seen', sound: 's' },
        { letter: 'ش', name: 'Sheen', sound: 'sh' }, { letter: 'ښ', name: 'Ṣhe', sound: 'x' },
        { letter: 'ص', name: 'Saad', sound: 's' }, { letter: 'ض', name: 'Zaad', sound: 'z' },
        { letter: 'ط', name: 'Twa', sound: 't' },  { letter: 'ظ', name: 'Zwa', sound: 'z' },
        { letter: 'ع', name: 'Ain', sound: 'ʿ' },  { letter: 'غ', name: 'Ghain', sound: 'gh' },
        { letter: 'ف', name: 'Fe', sound: 'f' },   { letter: 'ق', name: 'Qaaf', sound: 'q' },
        { letter: 'ک', name: 'Kaaf', sound: 'k' }, { letter: 'ګ', name: 'Gae', sound: 'g' },
        { letter: 'ل', name: 'Laam', sound: 'l' }, { letter: 'م', name: 'Meem', sound: 'm' },
        { letter: 'ن', name: 'Noon', sound: 'n' }, { letter: 'ڼ', name: 'Ṇoon', sound: 'ṇ' },
        { letter: 'و', name: 'Wao', sound: 'w/u' }, { letter: 'ه', name: 'He', sound: 'h' },
        { letter: 'ی', name: 'Ye', sound: 'y/ee' }, { letter: 'ې', name: 'E', sound: 'e' },
        { letter: 'ۍ', name: 'Ey', sound: 'ey' }, { letter: 'ئ', name: 'Hamza Ye', sound: 'ay' },
        { letter: 'ء', name: 'Hamza', sound: 'ʾ' }, { letter: 'ۀ', name: 'He Hamza', sound: 'a' },
      ],
    },
  ],

  'greetings-phrases': [
    {
      title: { en: 'Common Greetings', ps: 'عام سلامونه' }, type: 'phrases',
      items: [
        { ps: 'السلام علیکم', roman: 'As-salamu alaykum', en: 'Peace be upon you (Hello)' },
        { ps: 'وعلیکم السلام', roman: 'Wa alaykum as-salam', en: 'And upon you peace (Reply)' },
        { ps: 'سلام', roman: 'Salaam', en: 'Hello / Hi' },
        { ps: 'ښه راغلاست', roman: 'Kha raghlast', en: 'Welcome' },
        { ps: 'خدای پہ امان', roman: 'Khudaay pa amaan', en: 'Goodbye' },
        { ps: 'بیا به لیدلو', roman: 'Bya ba leedalo', en: 'See you again' },
        { ps: 'شپه مو ښه', roman: 'Shpa mo kha', en: 'Good night' },
        { ps: 'سهار مو ښه', roman: 'Sahar mo kha', en: 'Good morning' },
      ],
    },
    {
      title: { en: 'Asking How Are You', ps: 'د حال پوښتنه' }, type: 'phrases',
      items: [
        { ps: 'څه حال دې؟', roman: 'Tse haal de?', en: 'How are you?' },
        { ps: 'ښه یم، مننه', roman: 'Kha yem, manana', en: 'I am fine, thank you' },
        { ps: 'تاسې څنګه یاست؟', roman: 'Taase tsanga yaast?', en: 'How are you? (formal)' },
        { ps: 'الحمدلله ښه یم', roman: 'Alhamdulillah kha yem', en: 'Alhamdulillah, I am well' },
      ],
    },
    {
      title: { en: 'Introductions', ps: 'پیژندنه' }, type: 'phrases',
      items: [
        { ps: 'ستا نوم څه دی؟', roman: 'Staa num tse dey?', en: 'What is your name?' },
        { ps: 'زما نوم ... دی', roman: 'Zama num ... dey', en: 'My name is ...' },
        { ps: 'تاسې چرته اوسیږئ؟', roman: 'Taase cherta oseegey?', en: 'Where do you live?' },
        { ps: 'زه له پاکستان څخه یم', roman: 'Za la Pakistan tsekha yem', en: 'I am from Pakistan' },
      ],
    },
  ],

  'pashto-numbers': [
    {
      title: { en: 'Numbers 1–10', ps: 'شمیرې ۱–۱۰' }, type: 'phrases',
      items: [
        { ps: 'یو', roman: 'Yaw', en: '1 — One' }, { ps: 'دوه', roman: 'Dwa', en: '2 — Two' },
        { ps: 'درې', roman: 'Dre', en: '3 — Three' }, { ps: 'څلور', roman: 'Tsalor', en: '4 — Four' },
        { ps: 'پنځه', roman: 'Pinza', en: '5 — Five' }, { ps: 'شپږ', roman: 'Shpag', en: '6 — Six' },
        { ps: 'اووه', roman: 'Owa', en: '7 — Seven' }, { ps: 'اته', roman: 'Ata', en: '8 — Eight' },
        { ps: 'نهه', roman: 'Na', en: '9 — Nine' }, { ps: 'لس', roman: 'Las', en: '10 — Ten' },
      ],
    },
    {
      title: { en: 'Numbers 11–50', ps: 'شمیرې ۱۱–۵۰' }, type: 'phrases',
      items: [
        { ps: 'یوولس', roman: 'Yoolas', en: '11 — Eleven' }, { ps: 'دولس', roman: 'Dolas', en: '12 — Twelve' },
        { ps: 'دیارلس', roman: 'Dyarlas', en: '13 — Thirteen' }, { ps: 'څوارلس', roman: 'Tswarlas', en: '14 — Fourteen' },
        { ps: 'پنځلس', roman: 'Pinzalas', en: '15 — Fifteen' }, { ps: 'شل', roman: 'Shel', en: '20 — Twenty' },
        { ps: 'دیرش', roman: 'Deersh', en: '30 — Thirty' }, { ps: 'څلوېښت', roman: 'Tsalwekht', en: '40 — Forty' },
        { ps: 'پنځوس', roman: 'Pinzoos', en: '50 — Fifty' },
      ],
    },
    {
      title: { en: 'Numbers 51–100 & beyond', ps: 'شمیرې ۵۱–۱۰۰ او زیات' }, type: 'phrases',
      items: [
        { ps: 'شپیته', roman: 'Shpeta', en: '60 — Sixty' }, { ps: 'اویا', roman: 'Awya', en: '70 — Seventy' },
        { ps: 'اتیا', roman: 'Atya', en: '80 — Eighty' }, { ps: 'نوي', roman: 'Nawi', en: '90 — Ninety' },
        { ps: 'سل', roman: 'Sal', en: '100 — One Hundred' }, { ps: 'زر', roman: 'Zar', en: '1000 — One Thousand' },
      ],
    },
  ],

  'colors': [
    {
      title: { en: 'Basic Colors', ps: 'اصلي رنګونه' }, type: 'colors',
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
      title: { en: 'Shades & Usage', ps: 'سيوري او کارونه' }, type: 'colors',
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

  'family-relatives': [
    {
      title: { en: 'Immediate Family', ps: 'نږدې کورنۍ' }, type: 'phrases',
      items: [
        { ps: 'پلار', roman: 'Plaar', en: 'Father' },   { ps: 'مور', roman: 'Mor', en: 'Mother' },
        { ps: 'ورور', roman: 'Wror', en: 'Brother' },   { ps: 'خور', roman: 'Khor', en: 'Sister' },
        { ps: 'زوی', roman: 'Zoy', en: 'Son' },         { ps: 'لور', roman: 'Lor', en: 'Daughter' },
      ],
    },
    {
      title: { en: 'Extended Family', ps: 'پراخه کورنۍ' }, type: 'phrases',
      items: [
        { ps: 'نیکه', roman: 'Neeka', en: 'Grandfather' }, { ps: 'نیا', roman: 'Nyaa', en: 'Grandmother' },
        { ps: 'ترور', roman: 'Tror', en: 'Aunt (paternal)' }, { ps: 'تره', roman: 'Tra', en: 'Uncle (paternal)' },
        { ps: 'ملګری', roman: 'Malgaray', en: 'Friend (male)' },
        { ps: 'ملګرې', roman: 'Malgare', en: 'Friend (female)' },
      ],
    },
  ],

  'grammar-basics': [
    {
      title: { en: 'Sentence Structure (Pronouns)', ps: 'د جملې جوړښت (ضمیرونه)' }, type: 'phrases',
      items: [
        { ps: 'زه', roman: 'Za', en: 'I' }, { ps: 'ته', roman: 'Ta', en: 'You (singular)' },
        { ps: 'هغه', roman: 'Hagha', en: 'He / She / It' }, { ps: 'موږ', roman: 'Moong', en: 'We' },
        { ps: 'تاسې', roman: 'Taase', en: 'You (plural / formal)' }, { ps: 'هغوی', roman: 'Haghwey', en: 'They' },
      ],
    },
    {
      title: { en: 'Verbs', ps: 'فعلونه' }, type: 'phrases',
      items: [
        { ps: 'کول', roman: 'Kawul', en: 'To do' }, { ps: 'تلل', roman: 'Tlal', en: 'To go' },
        { ps: 'راتلل', roman: 'Raatlal', en: 'To come' }, { ps: 'خوړل', roman: 'Khwral', en: 'To eat' },
        { ps: 'لوستل', roman: 'Lwastal', en: 'To read' }, { ps: 'لیکل', roman: 'Leekal', en: 'To write' },
        { ps: 'لیدل', roman: 'Leedal', en: 'To see' }, { ps: 'ویل', roman: 'Wayal', en: 'To say' },
      ],
    },
    {
      title: { en: 'Tenses (Simple Sentences)', ps: 'زمانې (ساده جملې)' }, type: 'phrases',
      items: [
        { ps: 'زه ښوونځي ته ځم', roman: 'Za shwondzey ta dzem', en: 'I go to school' },
        { ps: 'هغه کتاب لولي', roman: 'Hagha kitaab lwali', en: 'He/She reads a book' },
        { ps: 'موږ پښتو زده کوو', roman: 'Moong Pashto zda kawoo', en: 'We are learning Pashto' },
        { ps: 'دا ښه دی', roman: 'Daa kha dey', en: 'This is good' },
      ],
    },
  ],

  'children-names': [
    {
      title: { en: "Boys' Names", ps: 'د هلکانو نومونه' }, type: 'names',
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
      title: { en: "Girls' Names", ps: 'د نجونو نومونه' }, type: 'names',
      items: [
        { ps: 'ګلالۍ', roman: 'Gulalai', en: 'Rosy / Like a flower' },
        { ps: 'سپوږمۍ', roman: 'Spoghmay', en: 'Moon' },
        { ps: 'زرغونه', roman: 'Zarghuna', en: 'Green / Fresh' },
        { ps: 'هیله', roman: 'Heela', en: 'Hope' },
        { ps: 'مریم', roman: 'Maryam', en: 'Pure / Mary' },
      ],
    },
  ],

  'nature-vocabulary': [
    {
      title: { en: 'Mountains & Land', ps: 'غرونه او ځمکه' }, type: 'phrases',
      items: [
        { ps: 'غر', roman: 'Ghar', en: 'Mountain' },
        { ps: 'دره', roman: 'Dara', en: 'Valley' },
        { ps: 'ځمکه', roman: 'Zmaka', en: 'Earth / Ground / Land' },
        { ps: 'کلی', roman: 'Kalay', en: 'Village' },
      ],
    },
    {
      title: { en: 'Water & Sky', ps: 'اوبه او اسمان' }, type: 'phrases',
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

  'pashto-poetry': [
    {
      title: { en: 'Rahman Baba — Famous Verses', ps: 'رحمان بابا — مشهور بیتونه' }, type: 'phrases',
      items: [
        { ps: 'چې مینه وکړې نو بد مه ګڼه', roman: 'Che meena wukre no bad ma gna', en: 'If you love, think no ill' },
        { ps: 'د مینې لار ډیره اوږده ده', roman: 'Da meena laar dera owzda da', en: 'The path of love is very long' },
      ],
    },
    {
      title: { en: 'Khushal Khan Khattak — Verses', ps: 'خوشال خان خټک — بیتونه' }, type: 'phrases',
      items: [
        { ps: 'پښتون هغه دی چې پښتو وکړي', roman: 'Pashtoon hagha dey che Pashto wukri', en: 'A Pashtun is one who practices Pashtunwali' },
        { ps: 'د میړانې نوم دې ژوندی وي', roman: 'Da meeraane num de zhwandey wi', en: 'May the name of bravery live on' },
      ],
    },
  ],

  'daily-use-words': [
    {
      title: { en: 'Daily Conversations', ps: 'ورځني خبرې' }, type: 'phrases',
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

  'food-drinks': [
    {
      title: { en: 'Food Vocabulary', ps: 'د خواړو لغتونه' }, type: 'phrases',
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
      title: { en: 'At the Restaurant', ps: 'د هوټل کې' }, type: 'phrases',
      items: [
        { ps: 'مینو راوړه', roman: 'Menoo raawra', en: 'Bring the menu' },
        { ps: 'زه بهوکی یم', roman: 'Za bhwukey yem', en: 'I am hungry' },
        { ps: 'خواړه ډیر خوندور دي', roman: 'Khwaara deer khwandoor dee', en: 'The food is very delicious' },
        { ps: 'حساب راوړه', roman: 'Hisaab raawra', en: 'Bring the bill' },
      ],
    },
  ],
}

const LessonDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isPS = language === 'ps'

  const [lesson, setLesson]         = useState(null)
  const [chapters, setChapters]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [errorMsg, setErrorMsg]     = useState('')
  const [completed, setCompleted]   = useState(new Set())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMsg('')
    setCompleted(new Set())

    ;(async () => {
      try {
        const res = await api.get(`/lessons/${encodeURIComponent(slug)}`)
        if (cancelled) return
        const apiLesson = res.data?.data?.lesson || res.data?.lesson
        if (apiLesson) {
          setLesson(apiLesson)
          // Use chapters from DB if present, otherwise fall back to static map.
          const apiChapters = Array.isArray(apiLesson.chapters) ? apiLesson.chapters : []
          setChapters(apiChapters.length > 0 ? apiChapters : (STATIC_CHAPTERS[slug] || []))
          return
        }
        throw new Error('no lesson in response')
      } catch (err) {
        if (cancelled) return
        // API miss → try to render from static seed list + chapters
        const staticLesson = fallbackLessons.find((l) => l.slug === slug)
        const staticChapters = STATIC_CHAPTERS[slug] || []
        if (staticLesson || staticChapters.length > 0) {
          setLesson(staticLesson || { slug, title: { en: slug, ps: slug }, description: { en: '', ps: '' } })
          setChapters(staticChapters)
          if (err?.response?.status && err.response.status !== 404) {
            setErrorMsg('Server unreachable — showing offline content.')
          }
        } else {
          setLesson(null)
          setChapters([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [slug])

  const totalItems = useMemo(
    () => chapters.reduce((acc, c) => acc + (Array.isArray(c.items) ? c.items.length : 0), 0),
    [chapters],
  )
  const progress = totalItems > 0 ? Math.round((completed.size / totalItems) * 100) : 0

  const toggleComplete = (key) =>
    setCompleted((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  // ── Loading / not-found / error states ────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-live="polite">
        <FiLoader className="mr-2 animate-spin" /> Loading lesson…
      </div>
    )
  }
  if (!lesson && chapters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-xl text-gray-500">Lesson not found.</p>
          <button onClick={() => navigate('/learn')} className="btn-primary">
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  const lessonTitle = lesson?.title?.[language] || lesson?.title?.en || slug
  const lessonDesc  = lesson?.description?.[language] || lesson?.description?.en || ''

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <SEO
        title={lessonTitle}
        description={lessonDesc || `Learn ${lessonTitle} on PashtoHub`}
        path={`/learn/${slug}`}
        lang={language}
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center gap-2 mb-6 text-sm font-semibold text-primary-600 dark:text-gold-400 hover:underline"
        >
          <FiArrowLeft /> Back to Lessons
        </button>

        {/* Lesson header */}
        <header className="mb-10">
          <h1 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${isPS ? 'pashto-text text-right' : ''}`}>
            {lessonTitle}
          </h1>
          {lessonDesc && (
            <p className={`mt-2 text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text text-right' : ''}`}>
              {lessonDesc}
            </p>
          )}
          {chapters.length > 0 && (
            <p className="mt-3 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
              {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
            </p>
          )}
        </header>

        {errorMsg && (
          <div className="p-3 mb-6 text-sm text-yellow-800 border border-yellow-200 bg-yellow-50 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            {errorMsg}
          </div>
        )}

        {chapters.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400">
              No chapters yet — content will appear here once an admin adds it.
            </p>
          </div>
        ) : (
          chapters.map((chapter, ci) => (
            <Chapter
              key={chapter._id || ci}
              chapter={chapter}
              chapterIndex={ci}
              language={language}
              isPS={isPS}
              completed={completed}
              onToggle={toggleComplete}
            />
          ))
        )}

        {/* Progress bar */}
        {totalItems > 0 && (
          <div className="p-5 mt-8 text-center bg-white border border-gray-200 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Your Progress</p>
            <p className="text-3xl font-bold text-primary-600 dark:text-gold-400">
              {completed.size} / {totalItems}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
              <div
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">{progress}% complete — click any item to mark done ✓</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter renderer — chooses a layout based on chapter.type.
// Same shape supports DB chapters + static fallback chapters.
// ─────────────────────────────────────────────────────────────────────────────
const Chapter = ({ chapter, chapterIndex, language, isPS, completed, onToggle }) => {
  const items = Array.isArray(chapter.items) ? chapter.items : []
  const title = chapter.title?.[language] || chapter.title?.en || ''

  return (
    <section className="mb-12">
      <h2 className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 ${isPS ? 'pashto-text text-right' : ''}`}>
        {title}
      </h2>

      {chapter.type === 'alphabet' && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {items.map((item, i) => {
            const key = `${chapterIndex}-${i}`
            const done = completed.has(key)
            return (
              <button
                key={i}
                type="button"
                onClick={() => onToggle(key)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  done
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400'
                }`}
              >
                {done && <FiCheck className="absolute w-3 h-3 top-1 right-1 text-primary-500" />}
                <span className="text-2xl font-bold pashto-text text-primary-700 dark:text-gold-400">{item.letter}</span>
                <span className="mt-1 text-xs text-gray-500">{item.name}</span>
                <span className="text-xs text-gray-400">/{item.sound}/</span>
              </button>
            )
          })}
        </div>
      )}

      {chapter.type === 'colors' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, i) => {
            const key = `${chapterIndex}-${i}`
            const done = completed.has(key)
            return (
              <button
                key={i}
                type="button"
                onClick={() => onToggle(key)}
                className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all ${
                  done ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700 hover:border-primary-400'
                }`}
              >
                <div className="w-full h-16" style={{ backgroundColor: item.hex }} />
                {done && (
                  <div className="absolute flex items-center justify-center w-5 h-5 bg-white rounded-full top-2 right-2">
                    <FiCheck className="w-3 h-3 text-primary-500" />
                  </div>
                )}
                <div className="w-full p-3 text-center bg-white dark:bg-gray-800">
                  <p className="text-lg font-bold pashto-text text-primary-700 dark:text-gold-400">{item.ps}</p>
                  <p className="text-xs italic text-gray-400">{item.roman}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-300">{item.en}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {chapter.type === 'names' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item, i) => {
            const key = `${chapterIndex}-${i}`
            const done = completed.has(key)
            return (
              <button
                key={i}
                type="button"
                onClick={() => onToggle(key)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  done
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  done ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {done && <FiCheck className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold pashto-text text-primary-700 dark:text-gold-400">{item.ps}</p>
                  <p className="text-xs italic text-gray-400">{item.roman}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{item.en}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {chapter.type === 'phrases' && (
        <div className="space-y-3">
          {items.map((item, i) => {
            const key = `${chapterIndex}-${i}`
            const done = completed.has(key)
            return (
              <div
                key={i}
                onClick={() => onToggle(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(key) }}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  done
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  done ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {done && <FiCheck className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-right pashto-text text-primary-700 dark:text-gold-400">{item.ps}</p>
                  {item.roman && <p className="text-xs italic text-gray-400 mt-0.5">{item.roman}</p>}
                </div>
                <FiArrowRight className="flex-shrink-0 text-gray-300 dark:text-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.en}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {chapter.type === 'rich' && (
        <div
          className={`prose dark:prose-invert max-w-none ${isPS ? 'pashto-text text-right' : ''}`}
          dangerouslySetInnerHTML={{ __html: chapter.body?.[language] || chapter.body?.en || '' }}
        />
      )}
    </section>
  )
}

export default LessonDetail
