import { Link } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiPlayCircle } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

// Folder name on disk is `Assets/` (capital A). Linux is case-sensitive,
// so this MUST match exactly or Vercel's build fails with "Could not resolve".
import mountainImg from '../Assets/mountain.jpg'

const Hero = () => {
  const { t, language } = useLanguage()

  return (
    <section className="relative overflow-hidden">

      {/* ── Mountain Background Image ── */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${mountainImg})` }}
        aria-hidden="true"
      />

      {/* ── Light mode overlay: white-ish tint taake text visible rahe ── */}
      <div className="absolute inset-0 transition-colors duration-300 bg-white/60 dark:bg-gray-950/75" />

      {/* ── Extra gradient fade at bottom for smooth transition ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-gray-950/90" />

      {/* Floating ornaments */}
      <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-primary-300/20 dark:bg-primary-700/15 blur-3xl animate-float" />
      <div className="absolute rounded-full bottom-10 right-10 w-80 h-80 bg-gold-300/20 dark:bg-gold-700/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* ── Main Content ── */}
      <div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 md:py-28">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Text */}
          <div className="text-center lg:text-start animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100/80 dark:bg-gold-900/50 text-gold-700 dark:text-gold-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              {t('hero.badge')}
            </span>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 font-display sm:text-5xl lg:text-6xl dark:text-white drop-shadow-sm">
              {language === 'en' ? (
                <>
                  Learn, Read and Explore the{' '}
                  <span className="text-transparent bg-gradient-to-r from-primary-600 via-gold-500 to-crimson-500 bg-clip-text">
                    Pashto Language
                  </span>
                </>
              ) : (
                <span className="pashto-text">
                  <span className="text-transparent bg-gradient-to-r from-primary-600 via-gold-500 to-crimson-500 bg-clip-text">
                    پښتو ژبه
                  </span>{' '}
                  زده کړئ، ولولئ او وپلټئ
                </span>
              )}
            </h1>

            <p className={`text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 drop-shadow-sm ${language === 'ps' ? 'pashto-text' : ''}`}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <Link to="/learn" className="btn-primary">
                <FiPlayCircle className="w-3 h-5" />
                {t('hero.cta1')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/books" className="btn-outline">
                <FiBookOpen className="w-5 h-5" />
                {t('hero.cta2')}
              </Link>
              <Link to="/dictionary" className="btn-outline">
                <FiBookOpen className="w-3 h-5" />
                {t('hero.cta3')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid max-w-lg grid-cols-3 gap-6 mx-auto mt-12 lg:mx-0">
              {[
                { n: '500+', l: t('stats.books') },
                { n: '120+', l: t('stats.lessons') },
                { n: '10K+', l: t('stats.words') },
              ].map((s) => (
                <div key={s.l} className="p-3 text-center lg:text-start rounded-xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
                  <div className="text-3xl font-bold font-display text-primary-700 dark:text-gold-400">
                    {s.n}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

         

        </div>
      </div>
    </section>
  )
}

export default Hero