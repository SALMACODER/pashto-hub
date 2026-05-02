import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../seo/SEO'
import { useLanguage } from '../context/LanguageContext'
import { leaders as fallbackLeaders } from '../data/leaders'
import { listLeaders } from '../api/leaders'
import { cloudImg } from '../utils/cloudinaryUrl'

const Leaders = () => {
  const { language } = useLanguage()
  const isPS = language === 'ps'

  const [leaders, setLeaders] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch from API; gracefully fall back to seeded list when offline / empty.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await listLeaders({ limit: 100 })
        if (cancelled) return
        const items = res?.data?.items ?? res?.leaders ?? []
        setLeaders(items.length > 0 ? items : fallbackLeaders)
      } catch (err) {
        if (cancelled) return
        console.warn('[leaders] using offline fallback:', err.message)
        setErrorMsg('Server unreachable — showing offline list.')
        setLeaders(fallbackLeaders)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen">
      <SEO
        title={isPS ? 'پښتانه اتلان او شاعران' : 'Pashtun Leaders, Poets & Icons'}
        description={isPS
          ? 'د پښتنو نامتو شاعران، سياستوال، مشران او اتلان وپيژنئ — رحمان بابا، خوشال خان خټک، غني خان او نور.'
          : 'Discover the great Pashtun leaders, poets, politicians and historical icons — Rahman Baba, Khushal Khan Khattak, Ghani Khan and more.'}
        path="/leaders"
        lang={language}
      />
      {/* Hero */}
      <section className="px-4 py-20 text-white bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`font-display text-4xl md:text-5xl font-bold mb-4 ${isPS ? 'pashto-text' : ''}`}>
            {isPS ? 'خپل اتلان او پیژندنه' : 'Khpal Atalan wa Pezhanai'}
          </h1>
          <p className={`text-lg text-primary-50 max-w-2xl mx-auto ${isPS ? 'pashto-text' : ''}`}>
            {isPS
              ? 'د پښتنو مشران، شاعران، سیاستوال او اتلان وپیژنئ'
              : 'Discover the great Pashtun leaders, poets, politicians and icons throughout history'}
          </p>
        </div>
      </section>

      {errorMsg && (
        <div className="px-4 mx-auto max-w-7xl pt-4 sm:px-6 lg:px-8">
          <div className="p-3 text-sm text-yellow-800 border border-yellow-200 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Leaders grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => {
              // Prefer slug for navigation; fall back to _id then numeric id.
              const linkTarget = leader.slug || leader._id || leader.id
              const photoSrc = leader.photoUrl
                ? cloudImg(leader.photoUrl, { width: 600, height: 800 })
                : null
              return (
                <article key={leader._id || leader.id} className="flex flex-col overflow-hidden card group">
                  {/* Cover */}
                  <div className={`relative aspect-[3/4] bg-gradient-to-br ${leader.color || 'from-primary-600 to-primary-900'} flex flex-col items-center justify-center p-6 overflow-hidden`}>
                    {photoSrc && (
                      <img
                        src={photoSrc}
                        alt={leader.name?.en || leader.name?.ps || ''}
                        width="600" height="800"
                        loading="lazy" decoding="async"
                        className="absolute inset-0 object-cover w-full h-full"
                      />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
                    {leader.type?.[language] && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-semibold text-gray-800 px-2.5 py-1 rounded-full z-10">
                        {leader.type[language]}
                      </div>
                    )}
                    {!photoSrc && (
                      <div className="relative mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
                        {leader.emoji || '🌟'}
                      </div>
                    )}
                    <div className="relative z-10 text-center">
                      <div className={`text-2xl font-bold leading-snug text-white drop-shadow-lg ${isPS ? 'pashto-text' : ''}`}>
                        {leader.name?.[language]}
                      </div>
                      {leader.era && (
                        <div className="mt-2 text-sm font-semibold tracking-wide text-white/80">
                          {leader.era}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {leader.role?.[language] && (
                      <div className="mb-1 text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-gold-400">
                        {leader.role[language]}
                      </div>
                    )}
                    <h2 className={`font-display text-lg font-bold text-gray-900 dark:text-white mb-2 ${isPS ? 'pashto-text' : ''}`}>
                      {leader.name?.[language]}
                    </h2>
                    <p className={`text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1 ${isPS ? 'pashto-text' : ''}`}>
                      {leader.description?.[language]}
                    </p>
                    <Link
                      to={`/leaders/${linkTarget}`}
                      className="inline-flex items-center justify-center gap-2 w-full btn-primary !py-2 text-sm mt-auto"
                    >
                      {isPS ? 'نور ولولئ' : 'Read More'} <FiArrowRight />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Leaders
