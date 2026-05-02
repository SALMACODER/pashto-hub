import { lazy, Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import RequireAdmin from './RequireAdmin'
import AdminSidebar from './components/AdminSidebar'
import AdminTopbar from './components/AdminTopbar'
import SEO from '../seo/SEO'

// Each admin section is its own chunk — only loads when navigated to.
const Dashboard         = lazy(() => import('./pages/Dashboard'))
const BooksListPage     = lazy(() => import('./pages/books/BooksListPage'))
const BookFormPage      = lazy(() => import('./pages/books/BookFormPage'))
const LessonsListPage   = lazy(() => import('./pages/lessons/LessonsListPage'))
const LessonFormPage    = lazy(() => import('./pages/lessons/LessonFormPage'))
const LeadersListPage     = lazy(() => import('./pages/leaders/LeadersListPage'))
const LeaderFormPage      = lazy(() => import('./pages/leaders/LeaderFormPage'))
const DictionaryListPage  = lazy(() => import('./pages/dictionary/DictionaryListPage'))
const WordFormPage        = lazy(() => import('./pages/dictionary/WordFormPage'))

const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || 'pashto-hub').replace(/^\/+/, '')

const SectionFallback = () => (
  <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
    <div className="w-8 h-8 border-4 rounded-full border-primary-200 border-t-primary-600 animate-spin" />
    <span className="sr-only">Loading…</span>
  </div>
)

const Placeholder = ({ title }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Coming soon — wire up the same way as Books.</p>
  </div>
)

const AdminShell = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <RequireAdmin>
      <SEO title="CMS" path={`/${ADMIN_PATH}`} noindex />
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} basePath={ADMIN_PATH} />

        <div className="flex flex-col flex-1 min-w-0">
          <AdminTopbar onOpenMenu={() => setMenuOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Suspense fallback={<SectionFallback />}>
              <Routes>
                <Route index                element={<Dashboard />} />
                <Route path="books"         element={<BooksListPage />} />
                <Route path="books/new"     element={<BookFormPage />} />
                <Route path="books/:id"     element={<BookFormPage />} />
                <Route path="lessons"       element={<LessonsListPage />} />
                <Route path="lessons/new"   element={<LessonFormPage />} />
                <Route path="lessons/:id"   element={<LessonFormPage />} />
                <Route path="leaders"        element={<LeadersListPage />} />
                <Route path="leaders/new"    element={<LeaderFormPage />} />
                <Route path="leaders/:id"    element={<LeaderFormPage />} />
                <Route path="dictionary"     element={<DictionaryListPage />} />
                <Route path="dictionary/new" element={<WordFormPage />} />
                <Route path="dictionary/:id" element={<WordFormPage />} />
                <Route path="*"             element={<Placeholder title="Not found" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}

export default AdminShell
