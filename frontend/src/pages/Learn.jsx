// import { useState, useMemo } from 'react'
// import LessonCard from '../components/LessonCard'
// import { useLanguage } from '../context/LanguageContext'
// import { lessons } from '../data/lessons'

// const Learn = () => {
//   const { t, language } = useLanguage()
//   const isPS = language === 'ps'

//   const [activeLevel, setActiveLevel] = useState('all')

//   const levels = [
//     { id: 'all', en: 'All Levels', ps: 'ټولې کچې' },
//     { id: 'Beginner', en: 'Beginner', ps: 'پیل کوونکی' },
//     { id: 'Intermediate', en: 'Intermediate', ps: 'منځنی' },
//     { id: 'Advanced', en: 'Advanced', ps: 'پرمختللی' },
//   ]

//   const filteredLessons = useMemo(() => {
//     if (activeLevel === 'all') return lessons
//     return lessons.filter((l) => l.level === activeLevel)
//   }, [activeLevel])

//   return (
//     <div className="min-h-screen">
//       {/* Hero */}
//       <section className="px-4 py-20 text-white bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
//         <div className="max-w-5xl mx-auto text-center">
//           <h1
//             className={`font-display text-4xl md:text-5xl font-bold mb-4 ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('learn.title')}
//           </h1>
//           <p
//             className={`text-lg md:text-xl text-primary-50 max-w-2xl mx-auto mb-10 ${
//               isPS ? 'pashto-text' : ''
//             }`}
//           >
//             {t('learn.subtitle')}
//           </p>

//           <div className="grid max-w-2xl grid-cols-3 gap-6 mx-auto">
//             {[
//               { n: lessons.length, l: t('stats.lessons') },
//               { n: '3', l: t('learn.level') },
//               { n: '24/7', l: 'Access' },
//             ].map((s, i) => (
//               <div
//                 key={i}
//                 className="p-4 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20"
//               >
//                 <div className="mb-1 text-3xl font-bold font-display md:text-4xl">
//                   {s.n}
//                 </div>
//                 <div
//                   className={`text-sm text-primary-50 ${
//                     isPS ? 'pashto-text' : ''
//                   }`}
//                 >
//                   {s.l}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Lessons */}
//       <section className="px-4 py-16 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex flex-wrap justify-center gap-3 mb-12">
//             {levels.map((lvl) => (
//               <button
//                 key={lvl.id}
//                 onClick={() => setActiveLevel(lvl.id)}
//                 className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
//                   activeLevel === lvl.id
//                     ? 'bg-gradient-to-r from-primary-500 to-gold-500 text-white shadow-md scale-105'
//                     : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
//                 } ${isPS ? 'pashto-text' : ''}`}
//               >
//                 {lvl[language]}
//               </button>
//             ))}
//           </div>

//           {filteredLessons.length > 0 ? (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {filteredLessons.map((lesson) => (
//                 <LessonCard key={lesson.id} lesson={lesson} />
//               ))}
//             </div>
//           ) : (
//             <div className="py-20 text-center">
//               <p
//                 className={`text-xl text-gray-500 dark:text-gray-400 ${
//                   isPS ? 'pashto-text' : ''
//                 }`}
//               >
//                 {t('books.noResults')}
//               </p>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Learn

import { useState, useMemo, useEffect } from 'react'
import SEO from '../seo/SEO'
import LessonCard from '../components/LessonCard'
import { useLanguage } from '../context/LanguageContext'
import { lessons as fallbackLessons } from '../data/lessons'
import api from '../api/axios'

const Learn = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const [activeLevel, setActiveLevel] = useState('all')
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get('/lessons', { params: { limit: 100 } })
        if (cancelled) return
        const apiLessons = res.data?.lessons ?? []
        setLessons(apiLessons.length > 0 ? apiLessons : fallbackLessons)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load lessons:', err)
        setErrorMsg('Could not reach the server. Showing offline lessons.')
        setLessons(fallbackLessons)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const levels = [
    { id: 'all', en: 'All Levels', ps: 'ټولې کچې' },
    { id: 'Beginner', en: 'Beginner', ps: 'پیل کوونکی' },
    { id: 'Intermediate', en: 'Intermediate', ps: 'منځنی' },
    { id: 'Advanced', en: 'Advanced', ps: 'پرمختللی' },
  ]

  const filteredLessons = useMemo(() => {
    if (activeLevel === 'all') return lessons
    return lessons.filter((l) => l.level === activeLevel)
  }, [activeLevel, lessons])

  return (
    <div className="min-h-screen">
      <SEO
        title={isPS ? 'پښتو زده کړه' : 'Learn Pashto Online'}
        description={isPS
          ? 'د پښتو ژبې زده کړه له صفر څخه — د پيل کوونکو، منځنيو او پرمختللو لپاره آنلاين درسونه او تمرينونه.'
          : 'Learn Pashto online — structured lessons for beginners, intermediate and advanced learners with audio, exercises and translations.'}
        path="/learn"
        lang={language}
      />
      {/* Hero */}
      <section className="px-4 py-20 text-white bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className={`font-display text-4xl md:text-5xl font-bold mb-4 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('learn.title')}
          </h1>
          <p
            className={`text-lg md:text-xl text-primary-50 max-w-2xl mx-auto mb-10 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('learn.subtitle')}
          </p>

          <div className="grid max-w-2xl grid-cols-3 gap-6 mx-auto">
            {[
              { n: lessons.length, l: t('stats.lessons') },
              { n: '3', l: t('learn.level') },
              { n: '24/7', l: 'Access' },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20"
              >
                <div className="mb-1 text-3xl font-bold font-display md:text-4xl">
                  {s.n}
                </div>
                <div
                  className={`text-sm text-primary-50 ${
                    isPS ? 'pashto-text' : ''
                  }`}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.id)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                  activeLevel === lvl.id
                    ? 'bg-gradient-to-r from-primary-500 to-gold-500 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
                } ${isPS ? 'pashto-text' : ''}`}
              >
                {lvl[language]}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3 mb-6 text-sm text-yellow-800 border border-yellow-200 bg-yellow-50 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading lessons…</div>
          ) : filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson._id || lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p
                className={`text-xl text-gray-500 dark:text-gray-400 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('books.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Learn