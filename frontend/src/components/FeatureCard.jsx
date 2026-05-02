import { memo } from 'react'
import { useLanguage } from '../context/LanguageContext'

const FeatureCard = ({ icon, title, desc, accent = 'primary' }) => {
  const { language } = useLanguage()
  const accentClass = {
    primary: 'from-primary-400 to-primary-600',
    gold: 'from-gold-400 to-gold-600',
    crimson: 'from-crimson-500 to-crimson-600',
    mixed: 'from-primary-500 via-gold-500 to-crimson-500',
  }[accent]

  return (
    <article className="card p-6 group">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentClass} flex items-center justify-center text-2xl text-white mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
        {icon}
      </div>
      <h3 className={`font-display text-xl font-bold text-gray-900 dark:text-white mb-2 ${language === 'ps' ? 'pashto-text' : ''}`}>
        {title}
      </h3>
      <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${language === 'ps' ? 'pashto-text' : ''}`}>
        {desc}
      </p>
    </article>
  )
}

export default memo(FeatureCard)