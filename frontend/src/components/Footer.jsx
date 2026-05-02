import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/books', label: t('nav.books') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/dictionary', label: t('nav.dictionary') },
  ]

  const resources = [
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/signin', label: t('nav.signin') },
    { to: '/signup', label: t('nav.signup') },
  ]

  const socials = [
    { icon: <FiFacebook />, href: '#', label: 'Facebook' },
    { icon: <FiTwitter />, href: '#', label: 'Twitter' },
    { icon: <FiInstagram />, href: '#', label: 'Instagram' },
    { icon: <FiYoutube />, href: '#', label: 'YouTube' },
  ]

  return (
    <footer className="mt-20 text-gray-100 bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900">
      {/* Top pattern */}
      <div className="h-2 bg-gradient-to-r from-primary-500 via-gold-500 to-crimson-500" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center shadow-lg w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 via-gold-500 to-crimson-500">
                <span className="text-xl font-bold text-white font-display">پ</span>
              </div>
              <div>
                <div className="text-xl font-bold font-display">PashtoHub</div>
                <div className="text-xs text-gold-300 pashto-text">پښتو هب</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-300">
              {t('footer.tagline')}
            </p>

            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex items-center justify-center w-10 h-10 transition-all rounded-full bg-white/10 hover:bg-gold-500 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold font-display text-gold-300">
              {t('footer.quick')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-300 transition-colors hover:text-gold-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-lg font-semibold font-display text-gold-300">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2">
              {resources.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-300 transition-colors hover:text-gold-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + contact */}
          <div>
            {/* <h4 className="mb-4 text-lg font-semibold font-display text-gold-300">
              {t('footer.newsletter')}
            </h4> */}
            {/* <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-5">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-3 py-2 text-sm text-white placeholder-gray-400 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg bg-gold-500 hover:bg-gold-600"
              >
                {t('footer.subscribe')}
              </button>
            </form> */}

            <ul className="space-y-8 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <FiMapPin className="text-gold-300" />
                {t('contact.address')}
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-gold-300" /> hello@pashtohub.com
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-gold-300" /> +92 300 1234567
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 mt-12 text-sm text-gray-400 border-t border-white/10 md:flex-row">
          <p>© {new Date().getFullYear()} PashtoHub. {t('footer.rights')}</p>
          <p className="pashto-text text-gold-300">د پښتو ژبې د خدمت لپاره جوړ شوی</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer