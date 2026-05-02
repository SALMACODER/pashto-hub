import { FiMenu, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useLogout, useMe } from '../../hooks/useAuth'

const AdminTopbar = ({ onOpenMenu }) => {
  const navigate = useNavigate()
  const { data } = useMe()
  const logout = useLogout()
  const user = data?.data?.user || data?.user

  const handleSignOut = async () => {
    try { await logout.mutateAsync() } catch { /* fall through */ }
    navigate('/signin', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8 dark:bg-gray-900 dark:border-gray-800">
      <button
        type="button"
        onClick={onOpenMenu}
        className="p-2 -ml-2 text-gray-600 rounded lg:hidden hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={logout.isPending}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <FiLogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  )
}

export default AdminTopbar
