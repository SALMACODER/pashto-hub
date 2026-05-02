import { NavLink } from 'react-router-dom'
import {
  FiGrid, FiBook, FiBookOpen, FiAward, FiType,
  FiHome, FiX,
} from 'react-icons/fi'

const NAV = [
  { to: '',           label: 'Dashboard',  icon: FiGrid,    end: true },
  { to: 'books',      label: 'Books',      icon: FiBook },
  { to: 'dictionary', label: 'Dictionary', icon: FiType },
  { to: 'lessons',    label: 'Lessons',    icon: FiBookOpen },
  { to: 'leaders',    label: 'Leaders',    icon: FiAward },
]

const linkBase = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors'
const linkInactive = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
const linkActive   = 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'

const AdminSidebar = ({ open, onClose, basePath }) => (
  <>
    {open && (
      <div
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        aria-hidden="true"
      />
    )}
    <aside
      className={[
        'fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200',
        'dark:bg-gray-900 dark:border-gray-800',
        'transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200 dark:border-gray-800">
        <span className="font-display text-lg font-bold text-gray-900 dark:text-white">PashtoHub CMS</span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 -mr-2 text-gray-500 rounded lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close menu"
        >
          <FiX size={18} />
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to || 'dashboard'}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

        <a
          href="/"
          className={`${linkBase} ${linkInactive}`}
        >
          <FiHome size={18} />
          <span>Back to site</span>
        </a>
      </nav>

      {basePath && (
        <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-800 dark:text-gray-500">
          Path: <span className="font-mono">/{basePath}</span>
        </div>
      )}
    </aside>
  </>
)

export default AdminSidebar
