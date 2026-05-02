import { Link } from 'react-router-dom'
import { FiBook, FiBookOpen, FiAward, FiType, FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import { useAdminBooks } from '../../hooks/admin/useAdminBooks'
import { useAdminLessons } from '../../hooks/admin/useAdminLessons'
import { useAdminLeaders } from '../../hooks/admin/useAdminLeaders'
import { useAdminWords } from '../../hooks/admin/useAdminDictionary'
import { useCategories } from '../../hooks/admin/useAdminCategories'

const StatCard = ({ icon: Icon, label, value, to, accent = 'primary' }) => {
  const accents = {
    primary: 'from-primary-500 to-primary-700',
    gold:    'from-gold-500 to-gold-700',
    crimson: 'from-crimson-500 to-crimson-700',
    green:   'from-green-500 to-green-700',
  }
  return (
    <Link
      to={to}
      className="block p-5 transition-shadow bg-white border border-gray-200 rounded-xl hover:shadow-md dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 text-white rounded-lg bg-gradient-to-br ${accents[accent]}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        </div>
      </div>
    </Link>
  )
}

const Dashboard = () => {
  const books      = useAdminBooks({ limit: 1 })       // just need the total count
  const lessons    = useAdminLessons({ limit: 1 })
  const leaders    = useAdminLeaders({ limit: 1 })
  const words      = useAdminWords({ limit: 1 })
  const categories = useCategories()

  const bookCount   = books.data?.data?.pagination?.total   ?? books.data?.total   ?? '—'
  const lessonCount = lessons.data?.data?.pagination?.total ?? lessons.data?.total ?? '—'
  const leaderCount = leaders.data?.data?.pagination?.total ?? leaders.data?.total ?? '—'
  const wordCount   = words.data?.data?.pagination?.total   ?? words.data?.total   ?? '—'
  const catCount    = categories.data?.items?.length ?? categories.data?.data?.items?.length ?? '—'

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Manage all PashtoHub content from one place."
        actions={(
          <Link to="books/new" className="btn-primary !py-2 text-sm">
            <FiPlus /> New book
          </Link>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiBook}     label="Books"      value={bookCount}   to="books"      accent="primary" />
        <StatCard icon={FiBookOpen} label="Lessons"    value={lessonCount} to="lessons"    accent="crimson" />
        <StatCard icon={FiAward}    label="Leaders"    value={leaderCount} to="leaders"    accent="green" />
        <StatCard icon={FiType}     label="Dictionary" value={wordCount}   to="dictionary" accent="gold" />
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        {catCount !== '—' ? `${catCount} book categories defined.` : ''}
      </p>
    </div>
  )
}

export default Dashboard
