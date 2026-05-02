import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const LeaderCard = ({ leader }) => {
  const { language } = useLanguage()
  const isPS = language === 'ps'

  return (
    <article className="flex flex-col overflow-hidden card group">
      {/* Cover */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${leader.color} flex flex-col items-center justify-center p-6 overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-gray-800 px-2.5 py-1 rounded-full z-10">
          {leader.type?.[language] || leader.type?.en}
        </div>

        <div className="relative mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
          {leader.emoji}
        </div>

        <div className="relative z-10 text-center">
          <h3 className={`text-2xl font-bold leading-snug text-white drop-shadow-lg ${isPS ? 'pashto-text' : ''}`}>
            {leader.name?.[language] || leader.name?.en}
          </h3>
          <div className="mt-2 text-sm font-semibold tracking-wide text-white/80">
            {leader.era}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
          {leader.role?.[language] || leader.role?.en}
        </div>
        <p className={`font-display text-lg font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
          {leader.name?.[language] || leader.name?.en}
        </p>
        <p className={`text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 flex-1 ${isPS ? 'pashto-text' : ''}`}>
          {leader.description?.[language] || leader.description?.en}
        </p>
        <Link
          to={`/leaders/${leader.slug || leader._id || leader.id}`}
          className={`group/btn mt-auto inline-flex items-center justify-center gap-2 w-full btn-primary !py-2 text-sm hover:scale-[1.02] hover:shadow-lg ${isPS ? 'pashto-text' : ''}`}
        >
          <span>{isPS ? 'نور ولولئ' : 'Read'}</span>
          <FiArrowRight className="transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export default memo(LeaderCard)
