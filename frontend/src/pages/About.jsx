import { Link } from 'react-router-dom'
import { FiHeart, FiTarget, FiUsers, FiGlobe, FiBookOpen, FiStar } from 'react-icons/fi'
import SEO from '../seo/SEO'
import FeatureCard from '../components/FeatureCard'
import { useLanguage } from '../context/LanguageContext'

const About = () => {
  const { t, language } = useLanguage()
  const isPS = language === 'ps'

  const values = [
    {
      icon: '❤️',
      accent: 'crimson',
      title: language === 'ps' ? 'کلتوري درناوی' : 'Cultural Respect',
      desc:
        language === 'ps'
          ? 'د پښتنو شتمن میراث او دودونو درناوی او ساتنه.'
          : 'Honoring the rich heritage and traditions of the Pashto-speaking community.',
    },
    {
      icon: '🎯',
      accent: 'primary',
      title: language === 'ps' ? 'د کیفیت زده کړه' : 'Quality Learning',
      desc:
        language === 'ps'
          ? 'په دقت سره جوړ شوی منځپانګه چې زده کړه په خوندي ډول وړاندې کوي.'
          : 'Carefully crafted content that makes learning enjoyable and meaningful.',
    },
    {
      icon: '🤝',
      accent: 'gold',
      title: language === 'ps' ? 'پیاوړې ټولنه' : 'Strong Community',
      desc:
        language === 'ps'
          ? 'د زده کوونکو او د ژبې مینه والو لپاره یو هرکلی کوونکی فضا.'
          : 'Building a welcoming space for learners and language enthusiasts.',
    },
    {
      icon: '🌍',
      accent: 'mixed',
      title: language === 'ps' ? 'خلاص لاسرسی' : 'Open Access',
      desc:
        language === 'ps'
          ? 'د پښتو ژبې سرچینې د هر چا لپاره خلاصې وي.'
          : 'Making Pashto language resources accessible to everyone, everywhere.',
    },
  ]

  const stats = [
    { n: '500+', l: t('stats.books'), icon: FiBookOpen },
    { n: '200+', l: t('stats.lessons'), icon: FiStar },
    { n: '10K+', l: t('stats.learners'), icon: FiUsers },
    { n: '50+', l: language === 'ps' ? 'هیوادونه' : 'Countries', icon: FiGlobe },
  ]

  return (
    <div className="min-h-screen">
      <SEO
        title={isPS ? 'زمونږ په اړه' : 'About PashtoHub'}
        description={isPS
          ? 'د پښتو هب موخه د پښتو ژبې، فرهنګ او ادب د خپرولو لپاره يو معاصر آنلاين پلیټفارم جوړول دي.'
          : 'PashtoHub is a modern online platform built to preserve and promote the Pashto language, literature and culture for learners worldwide.'}
        path="/about"
        lang={language}
      />
      {/* Hero */}
      <section className="relative px-4 py-24 overflow-hidden text-white bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bg-white rounded-full top-10 left-10 w-72 h-72 blur-3xl" />
          <div className="absolute rounded-full bottom-10 right-10 w-96 h-96 bg-gold-500 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1
            className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('about.title')}
          </h1>
          <p
            className={`text-lg md:text-xl text-primary-50 leading-relaxed ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2
                className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('about.missionTitle')}
              </h2>
              <p
                className={`text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('about.mission')}
              </p>
              <h3
                className={`font-display text-2xl font-bold text-gray-900 dark:text-white mb-4 ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('about.visionTitle')}
              </h3>
              <p
                className={`text-gray-600 dark:text-gray-300 text-lg leading-relaxed ${
                  isPS ? 'pashto-text' : ''
                }`}
              >
                {t('about.vision')}
              </p>
            </div>

            <div className="relative">
              <div className="p-1 shadow-2xl aspect-square rounded-3xl bg-gradient-to-br from-primary-500 via-gold-500 to-crimson-500">
                <div className="flex items-center justify-center w-full h-full p-8 bg-white rounded-3xl dark:bg-gray-900">
                  <div className="text-center">
                    <div className="mb-4 text-7xl">📚</div>
                    <p className="text-3xl font-bold text-transparent pashto-text bg-gradient-to-r from-primary-600 via-gold-500 to-crimson-500 bg-clip-text">
                      د پښتو زده کړه
                    </p>
                    <p
                      className={`text-gray-600 dark:text-gray-300 mt-2 ${
                        isPS ? 'pashto-text' : ''
                      }`}
                    >
                      {language === 'ps' ? 'د زړه څخه' : 'From the heart'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-sand-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 text-center transition-all bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700 hover:shadow-md hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white rounded-xl bg-gradient-to-br from-primary-500 to-gold-500">
                  <stat.icon size={22} />
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900 font-display dark:text-white">
                  {stat.n}
                </div>
                <div
                  className={`text-sm text-gray-600 dark:text-gray-400 ${
                    isPS ? 'pashto-text' : ''
                  }`}
                >
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <h2
              className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${
                isPS ? 'pashto-text' : ''
              }`}
            >
              {language === 'ps' ? 'زموږ ارزښتونه' : 'Our Values'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <FeatureCard
                key={i}
                icon={v.icon}
                title={v.title}
                desc={v.desc}
                accent={v.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-sand-50 to-gold-50 dark:from-gray-900 dark:via-gray-900 dark:to-primary-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${
              isPS ? 'pashto-text' : ''
            }`}
          >
            {t('hero.badge')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/signup" className="btn-primary">
              {t('nav.signup')}
            </Link>
            <Link to="/contact" className="btn-outline">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About