import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader,
  FiAlertCircle, FiAward,
} from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import { useAdminLeaders, useDeleteLeader } from '../../../hooks/admin/useAdminLeaders'
import { cloudImg } from '../../../utils/cloudinaryUrl'

const PAGE_SIZE = 20

const LeadersListPage = () => {
  const [q, setQ]       = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE }
    if (q.trim()) p.q = q.trim()
    return p
  }, [q, page])

  const { data, isLoading, isFetching, error } = useAdminLeaders(params)
  const del = useDeleteLeader()

  const leaders = data?.data?.items || data?.leaders || []
  const pagination = data?.data?.pagination || {
    page: 1, pages: 1, total: data?.total || leaders.length, pageSize: PAGE_SIZE,
  }

  const handleDelete = async (leader) => {
    if (!window.confirm(`Delete "${leader.name?.en || leader.name?.ps}"? This cannot be undone.`)) return
    try {
      await del.mutateAsync(leader._id)
    } catch (e) {
      alert(e.response?.data?.error?.message || e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Leaders"
        subtitle={`${pagination.total ?? 0} total`}
        actions={(
          <Link to="new" className="btn-primary !py-2 text-sm">
            <FiPlus /> New leader
          </Link>
        )}
      />

      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute -translate-y-1/2 left-3 top-1/2 text-gray-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="Search name or slug…"
            className="w-full py-2 pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
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
        ) : leaders.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="w-16 px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="hidden px-4 py-3 md:table-cell">Slug</th>
                <th className="hidden px-4 py-3 lg:table-cell">Role</th>
                <th className="hidden px-4 py-3 lg:table-cell">Era</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leaders.map((l) => (
                <LeaderRow
                  key={l._id}
                  leader={l}
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

const LeaderRow = ({ leader, onDelete, deleting }) => {
  const photo = leader.photoUrl ? cloudImg(leader.photoUrl, { width: 80, height: 80 }) : null
  return (
    <tr className="text-gray-900 dark:text-gray-100">
      <td className="px-4 py-3">
        {photo ? (
          <img
            src={photo}
            alt=""
            width="40" height="40"
            loading="lazy" decoding="async"
            className="object-cover w-10 h-10 rounded-full shadow-sm"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 text-2xl bg-gray-100 rounded-full dark:bg-gray-800">
            {leader.emoji || '🌟'}
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-medium">
        <div>{leader.name?.en || '—'}</div>
        {leader.name?.ps && (
          <div className="text-xs text-gray-500 pashto-text">{leader.name.ps}</div>
        )}
      </td>
      <td className="hidden px-4 py-3 font-mono text-xs text-gray-500 md:table-cell dark:text-gray-500">
        {leader.slug || '—'}
      </td>
      <td className="hidden px-4 py-3 text-gray-600 lg:table-cell dark:text-gray-400">
        {leader.role?.en || '—'}
      </td>
      <td className="hidden px-4 py-3 text-xs text-gray-500 lg:table-cell dark:text-gray-500">
        {leader.era || '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={leader._id}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Edit"
            aria-label={`Edit ${leader.name?.en || ''}`}
          >
            <FiEdit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(leader)}
            disabled={deleting}
            className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-950/40"
            title="Delete"
            aria-label={`Delete ${leader.name?.en || ''}`}
          >
            {deleting ? <FiLoader size={16} className="animate-spin" /> : <FiTrash2 size={16} />}
          </button>
        </div>
      </td>
    </tr>
  )
}

const EmptyState = () => (
  <div className="px-4 py-16 text-center">
    <FiAward className="mx-auto mb-3 text-gray-400" size={32} />
    <p className="text-gray-600 dark:text-gray-400">No leaders match your filters.</p>
    <Link to="new" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
      <FiPlus /> Add your first leader
    </Link>
  </div>
)

export default LeadersListPage
