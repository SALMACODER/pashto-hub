import { memo, useState, useCallback } from 'react'
import { FiClock, FiPlay, FiArrowRight, FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const LessonCard = ({ lesson, onStart }) => {
  const { language, t } = useLanguage()
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)

  const handleStart = useCallback(() => {
    if (typeof onStart === 'function') {
      onStart(lesson)
      return
    }
    // Prefer slug — works for both DB lessons (has slug) AND static fallback
    // (also has slug). Only use _id as a last resort so the URL stays clean.
    const target = lesson?.slug || lesson?._id || lesson?.id
    if (target) {
      navigate(`/learn/${target}`)
    } else {
      setStarted(true)
    }
  }, [lesson, onStart, navigate])

  const handlePlay = useCallback((e) => {
    e.stopPropagation()
    const title = lesson?.title?.[language] || lesson?.title?.en || 'lesson'
    alert(`▶ Playing audio for: ${title}`)
  }, [lesson, language])

  return (
    <article className="flex flex-col p-6 card group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
            lesson.color || 'from-primary-500 to-gold-500'
          } flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}
        >
          {lesson.icon || '📘'}
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
          {t('learn.level')}: {language === 'ps' ? lesson.levelPs : lesson.level}
        </span>
      </div>

      <h3
        className={`font-display text-xl font-bold text-gray-900 dark:text-white mb-2 ${
          language === 'ps' ? 'pashto-text' : ''
        }`}
      >
        {lesson.title?.[language] || lesson.title?.en}
      </h3>
      <p
        className={`text-sm text-gray-600 dark:text-gray-400 mb-5 flex-1 ${
          language === 'ps' ? 'pashto-text' : ''
        }`}
      >
        {lesson.description?.[language] || lesson.description?.en}
      </p>

      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          {lesson.lessons} {t('learn.lessons')}
        </span>
        <span className="flex items-center gap-1.5">
          <FiClock /> {lesson.duration}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleStart}
          className="flex-1 btn-primary !py-2 text-sm"
        >
          {started ? (
            <>
              <FiCheck /> Started
            </>
          ) : (
            <>
              {t('learn.start')} <FiArrowRight />
            </>
          )}
        </button>
        {/* <button
          type="button"
          onClick={handlePlay}
          className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-gold-100 dark:bg-gold-900/40 text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white"
          aria-label={t('learn.play')}
          title={t('learn.play')}
        >
          <FiPlay />
        </button> */}
      </div>
    </article>
  )
}

export default memo(LessonCard)