import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader,
  FiAlertCircle, FiBookOpen,
} from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import { useAdminLessons, useDeleteLesson } from '../../../hooks/admin/useAdminLessons'

const PAGE_SIZE = 20
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const LessonsListPage = () => {
  const [q, setQ]         = useState('')
  const [level, setLevel] = useState('')
  const [page, setPage]   = useState(1)

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE }
    if (q.trim()) p.q = q.trim()
    if (level) p.level = level
    return p
  }, [q, level, page])

  const { data, isLoading, isFetching, error } = useAdminLessons(params)
  const del = useDeleteLesson()

  const lessons = data?.data?.items || data?.lessons || []
  const pagination = data?.data?.pagination || {
    page: 1, pages: 1, total: data?.total || lessons.length, pageSize: PAGE_SIZE,
  }

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Delete "${lesson.title?.en || lesson.title?.ps}"? This cannot be undone.`)) return
    try {
      await del.mutateAsync(lesson._id)
    } catch (e) {
      alert(e.response?.data?.error?.message || e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Lessons"
        subtitle={`${pagination.total ?? 0} total`}
        actions={(
          <Link to="new" className="btn-primary !py-2 text-sm">
            <FiPlus /> New lesson
          </Link>
        )}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute -translate-y-1/2 left-3 top-1/2 text-gray-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Search title or slug…"
            className="w-full py-2 pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg sm:w-56 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        >
          <option value="">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <FiLoader className="mr-2 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 h-48 text-red-600">
            <FiAlertCircle /> {error.response?.data?.error?.message || error.message}
          </div>
        ) : lessons.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="w-12 px-4 py-3">Icon</th>
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 md:table-cell">Slug</th>
                <th className="hidden px-4 py-3 lg:table-cell">Level</th>
                <th className="hidden px-4 py-3 lg:table-cell text-center">Chapters</th>
                <th className="hidden px-4 py-3 lg:table-cell">Updated</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {lessons.map((l) => (
                <LessonRow
                  key={l._id}
                  lesson={l}
                  onDelete={handleDelete}
                  deleting={del.isPending && del.variables === l._id}
                />
              ))}
            </tbody>
          </table>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 text-sm border-t border-gray-200 dark:border-gray-800">
            <div className="text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-gray-200"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages || isFetching}
                className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 dark:border-gray-700 dark:text-gray-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const LevelPill = ({ level }) => {
  const cls = {
    Beginner:     'bg-green-100  text-green-800  dark:bg-green-900/40  dark:text-green-300',
    Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    Advanced:     'bg-red-100    text-red-800    dark:bg-red-900/40    dark:text-red-300',
  }[level] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${cls}`}>{level}</span>
}

const LessonRow = ({ lesson, onDelete, deleting }) => (
  <tr className="text-gray-900 dark:text-gray-100">
    <td className="px-4 py-3 text-2xl text-center">{lesson.icon || '📚'}</td>
    <td className="px-4 py-3 font-medium">
      <div>{lesson.title?.en || '—'}</div>
      {lesson.title?.ps && (
        <div className="text-xs text-gray-500 pashto-text">{lesson.title.ps}</div>
      )}
    </td>
    <td className="hidden px-4 py-3 font-mono text-xs text-gray-500 md:table-cell dark:text-gray-500">
      {lesson.slug || '—'}
    </td>
    <td className="hidden px-4 py-3 lg:table-cell">
      <LevelPill level={lesson.level} />
    </td>
    <td className="hidden px-4 py-3 text-center lg:table-cell">
      {Array.isArray(lesson.chapters) ? lesson.chapters.length : 0}
    </td>
    <td className="hidden px-4 py-3 text-xs text-gray-500 lg:table-cell dark:text-gray-500">
      {lesson.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : '—'}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center justify-end gap-1">
        <Link
          to={lesson._id}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Edit"
          aria-label={`Edit ${lesson.title?.en || ''}`}
        >
          <FiEdit2 size={16} />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(lesson)}
          disabled={deleting}
          className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-950/40"
          title="Delete"
          aria-label={`Delete ${lesson.title?.en || ''}`}
        >
          {deleting ? <FiLoader size={16} className="animate-spin" /> : <FiTrash2 size={16} />}
        </button>
      </div>
    </td>
  </tr>
)

const EmptyState = () => (
  <div className="px-4 py-16 text-center">
    <FiBookOpen className="mx-auto mb-3 text-gray-400" size={32} />
    <p className="text-gray-600 dark:text-gray-400">No lessons match your filters.</p>
    <Link to="new" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
      <FiPlus /> Add your first lesson
    </Link>
  </div>
)

export default LessonsListPage
