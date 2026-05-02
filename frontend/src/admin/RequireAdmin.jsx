import { Navigate, useLocation } from 'react-router-dom'
import { useMe } from '../hooks/useAuth'

/**
 * Route guard for the admin area.
 *
 *   - Loading        → render nothing (Suspense already shows the spinner)
 *   - Not signed in  → redirect to /signin with the original path stashed in state
 *   - Signed in but role !== 'admin' → render a 404 lookalike so the URL doesn't
 *     reveal that the admin area exists. (Real security is the backend check;
 *     this is purely UX / discovery resistance.)
 */
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen p-6">
    <div className="max-w-md text-center">
      <p className="font-mono text-sm text-gray-500">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The page you’re looking for doesn’t exist.
      </p>
    </div>
  </div>
)

const RequireAdmin = ({ children }) => {
  const { data, isLoading } = useMe()
  const loc = useLocation()
  const user = data?.data?.user || data?.user

  if (isLoading) return null
  if (!user) return <Navigate to="/signin" state={{ from: loc.pathname }} replace />
  if (user.role !== 'admin') return <NotFound />
  return children
}

export default RequireAdmin
