

// import { Link } from 'react-router-dom'
// import { FiArrowRight } from 'react-icons/fi'
// import Hero from '../components/Hero'
// import FeatureCard from '../components/FeatureCard'
// import BookCard from '../components/BookCard'
// import LessonCard from '../components/LessonCard'
// import { useLanguage } from '../context/LanguageContext'
// import { books } from '../data/books'
// import { lessons } from '../data/lessons'
// import { leaders } from '../data/leaders'

// const LeaderCard = ({ leader }) => {
//   const { language } = useLanguage()
//   const isPS = language === 'ps'

//   return (
//     <div className="flex flex-col overflow-hidden card group">
//       {/* Cover */}
//       <div className={`relative aspect-[3/4] bg-gradient-to-br ${leader.color} flex flex-col items-center justify-center p-6 overflow-hidden`}>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />

//         {/* Type Badge */}
//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-gray-800 px-2.5 py-1 rounded-full z-10">
//           {leader.type[language]}
//         </div>

//         {/* Emoji Icon */}
//         <div className="relative mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
//           {leader.emoji}
//         </div>

//         {/* Name */}
//         <div className="relative z-10 text-center">
//           <div className={`text-2xl font-bold leading-snug text-white drop-shadow-lg ${isPS ? 'pashto-text' : ''}`}>
//             {leader.name[language]}
//           </div>
//           <div className="mt-2 text-sm font-semibold tracking-wide text-white/80">
//             {leader.era}
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
//       </div>

//       {/* Body */}
//       <div className="flex flex-col flex-1 p-5">
//         <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
//           {leader.role[language]}
//         </div>
//         <h3 className={`font-display text-lg font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
//           {leader.name[language]}
//         </h3>
//         <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 ${isPS ? 'pashto-text' : ''}`}>
//           {leader.desc[language]}
//         </p>
//       </div>
//     </div>
//   )
// }

// const Home = () => {
//   const { t, language } = useLanguage()
//   const isPS = language === 'ps'

//   const featuredBooks = books.slice(0, 3)
//   const featuredLessons = lessons.slice(0, 3)

//   const features = t('features.items') || []
//   const icons = ['📚', '🎓', '🔍', '🌸']
//   const accents = ['primary', 'gold', 'crimson', 'mixed']

//   return (
//     <div>
//       <Hero />

//       {/* Features */}
//       <section className="px-4 py-20 sm:px-6 lg:px-8 bg-sand-50 dark:bg-gray-900/50">
//         <div className="mx-auto max-w-7xl">
//           <div className="text-center mb-14">
//             <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
//               {t('features.title')}
//             </h2>
//             <p className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
//               {t('features.subtitle')}
//             </p>
//           </div>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {Array.isArray(features) &&
//               features.map((f, i) => (
//                 <FeatureCard key={i} icon={icons[i] || '✨'} title={f.title} desc={f.desc} accent={accents[i] || 'primary'} />
//               ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Books */}
//       <section className="px-4 py-20 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
//             <div>
//               <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
//                 {t('books.title')}
//               </h2>
//               <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
//                 {t('books.subtitle')}
//               </p>
//             </div>
//             <Link to="/books" className="btn-outline !py-2">
//               {t('books.all')} <FiArrowRight />
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {featuredBooks.map((book) => (
//               <BookCard key={book.id} book={book} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ✅ Khpal Atalan wa Pezhanai — Leaders Section */}
//       <section className="px-4 py-20 sm:px-6 lg:px-8 bg-sand-50 dark:bg-gray-900/50">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
//             <div>
//               <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
//                 {isPS ? 'خپل اتلان او پیژندنه' : 'Khpal Atalan wa Pezhanai'}
//               </h2>
//               <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
//                 {isPS
//                   ? 'د پښتنو مشران، شاعران او سیاستوال وپیژنئ'
//                   : 'Discover the great Pashtun leaders, poets and politicians'}
//               </p>
//             </div>
//             <Link to="/leaders" className="btn-outline !py-2">
//               {isPS ? 'ټول وګورئ' : 'View All'} <FiArrowRight />
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {leaders.map((leader) => (
//               <LeaderCard key={leader.id} leader={leader} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Lessons */}
//       <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
//             <div>
//               <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
//                 {t('learn.title')}
//               </h2>
//               <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
//                 {t('learn.subtitle')}
//               </p>
//             </div>
//             <Link to="/learn" className="btn-outline !py-2">
//               {t('hero.cta1')} <FiArrowRight />
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {featuredLessons.map((lesson) => (
//               <LessonCard key={lesson.id} lesson={lesson} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="px-4 py-20 sm:px-6 lg:px-8">
//         <div className="max-w-5xl p-12 mx-auto text-center shadow-2xl bg-gradient-to-r from-primary-600 via-gold-500 to-crimson-500 rounded-3xl">
//           <h2 className={`font-display text-3xl md:text-4xl font-bold text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
//             {t('about.subtitle')}
//           </h2>
//           <p className={`text-lg text-white/90 mb-8 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
//             {t('hero.subtitle')}
//           </p>
//           <Link
//             to="/signup"
//             className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
//           >
//             {t('nav.signup')} <FiArrowRight />
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Home


import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../seo/SEO'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import BookCard from '../components/BookCard'
import LessonCard from '../components/LessonCard'
import LeaderCard from '../components/LeaderCard'
import { useLanguage } from '../context/LanguageContext'
import { books } from '../data/books'
import { lessons } from '../data/lessons'
import { leaders } from '../data/leaders'

const Home = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const featuredBooks = books.slice(0, 3)
  const featuredLessons = lessons.slice(0, 3)
  const featuredLeaders = leaders.slice(0, 4)

  const features = t('features.items') || []
  const icons = ['📚', '🎓', '🔍', '🌸']
  const accents = ['primary', 'gold', 'crimson', 'mixed']

  return (
    <div>
      <SEO
        title={isPS ? 'پښتو زده کړه او کتابونه' : 'Learn Pashto, Read Books, Explore Culture'}
        description={isPS
          ? 'په پښتو هب کې د پښتو ژبې زده کړه، د پښتو کتابونو لوستل، قاموس او د پښتنو اتلانو پيژندنه.'
          : 'Learn Pashto online, read Pashto books, explore the dictionary, and discover Pashtun leaders, poets and culture — all in one place.'}
        path="/"
        lang={language}
      />
      <Hero />

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-sand-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
              {t('features.title')}
            </h2>
            <p className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.isArray(features) &&
              features.map((f, i) => (
                <FeatureCard key={i} icon={icons[i] || '✨'} title={f.title} desc={f.desc} accent={accents[i] || 'primary'} />
              ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
                {t('books.title')}
              </h2>
              <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
                {t('books.subtitle')}
              </p>
            </div>
            <Link to="/books" className="btn-outline !py-2">
              {t('books.all')} <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Khpal Atalan wa Pezhanai — Leaders Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-sand-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
                {isPS ? 'خپل اتلان او پیژندنه' : 'Khpal Atalan wa Pezhanai'}
              </h2>
              <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
                {isPS
                  ? 'د پښتنو مشران، شاعران او سیاستوال وپیژنئ'
                  : 'Discover the great Pashtun leaders, poets and politicians'}
              </p>
            </div>
            <Link to="/leaders" className="btn-outline !py-2">
              {isPS ? 'ټول وګورئ' : 'View All'} <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLeaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lessons */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
                {t('learn.title')}
              </h2>
              <p className={`text-gray-600 dark:text-gray-300 ${isPS ? 'pashto-text' : ''}`}>
                {t('learn.subtitle')}
              </p>
            </div>
            <Link to="/learn" className="btn-outline !py-2">
              {t('hero.cta1')} <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-5xl p-12 mx-auto text-center shadow-2xl bg-gradient-to-r from-primary-600 via-gold-500 to-crimson-500 rounded-3xl">
          <h2 className={`font-display text-3xl md:text-4xl font-bold text-white mb-4 ${isPS ? 'pashto-text' : ''}`}>
            {t('about.subtitle')}
          </h2>
          <p className={`text-lg text-white/90 mb-8 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {t('nav.signup')} <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home