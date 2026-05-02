import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader,
  FiAlertCircle, FiType, FiStar,
} from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import { useAdminWords, useDeleteWord } from '../../../hooks/admin/useAdminDictionary'

const PAGE_SIZE = 25

const DictionaryListPage = () => {
  const [q, setQ]                 = useState('')
  const [featuredOnly, setFeatOn] = useState(false)
  const [page, setPage]           = useState(1)

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE }
    if (q.trim()) p.q = q.trim()
    return p
  }, [q, page])

  const { data, isLoading, isFetching, error } = useAdminWords(params)
  const del = useDeleteWord()

  const allWords = data?.data?.items || data?.words || []
  const words = featuredOnly ? allWords.filter((w) => w.featured) : allWords
  const pagination = data?.data?.pagination || {
    page: 1, pages: 1, total: data?.total || allWords.length, pageSize: PAGE_SIZE,
  }

  const handleDelete = async (word) => {
    if (!window.confirm(`Delete "${word.english}" / "${word.pashto}"? This cannot be undone.`)) return
    try {
      await del.mutateAsync(word._id)
    } catch (e) {
      alert(e.response?.data?.error?.message || e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Dictionary"
        subtitle={`${pagination.total ?? 0} total${featuredOnly ? ` · ${words.length} featured` : ''}`}
        actions={(
          <Link to="new" className="btn-primary !py-2 text-sm">
            <FiPlus /> New word
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
            placeholder="Search English, Pashto or transliteration…"
            className="w-full py-2 pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:px-3">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setFeatOn(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Featured only
        </label>
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
        ) : words.length === 0 ? (
          <EmptyState filtered={featuredOnly || Boolean(q.trim())} />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="w-10 px-2 py-3 text-center" title="Featured">★</th>
                <th className="px-4 py-3">English</th>
                <th className="px-4 py-3">Pashto</th>
                <th className="hidden px-4 py-3 md:table-cell">Roman</th>
                <th className="hidden px-4 py-3 lg:table-cell">Part of speech</th>
                <th className="hidden px-4 py-3 lg:table-cell text-center" title="Lookups">Views</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {words.map((w) => (
                <WordRow
                  key={w._id}
                  word={w}
                  onDelete={handleDelete}
                  deleting={del.isPending && del.variables === w._id}
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

const WordRow = ({ word, onDelete, deleting }) => (
  <tr className="text-gray-900 dark:text-gray-100">
    <td className="px-2 py-3 text-center">
      {word.featured && (
        <FiStar className="inline-block fill-yellow-400 text-yellow-500" size={14} title="Featured" />
      )}
    </td>
    <td className="px-4 py-3 font-medium">{word.english}</td>
    <td className="px-4 py-3 text-lg pashto-text text-primary-700 dark:text-gold-400" dir="rtl">
      {word.pashto}
    </td>
    <td className="hidden px-4 py-3 italic text-gray-500 md:table-cell dark:text-gray-500">
      {word.transliteration || '—'}
    </td>
    <td className="hidden px-4 py-3 lg:table-cell">
      {word.partOfSpeech?.en && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300">
          {word.partOfSpeech.en}
        </span>
      )}
    </td>
    <td className="hidden px-4 py-3 text-center text-xs text-gray-500 lg:table-cell dark:text-gray-500">
      {word.lookups || 0}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center justify-end gap-1">
        <Link
          to={word._id}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800"
          title="Edit"
          aria-label={`Edit ${word.english}`}
        >
          <FiEdit2 size={16} />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(word)}
          disabled={deleting}
          className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-950/40"
          title="Delete"
          aria-label={`Delete ${word.english}`}
        >
          {deleting ? <FiLoader size={16} className="animate-spin" /> : <FiTrash2 size={16} />}
        </button>
      </div>
    </td>
  </tr>
)

const EmptyState = ({ filtered }) => (
  <div className="px-4 py-16 text-center">
    <FiType className="mx-auto mb-3 text-gray-400" size={32} />
    <p className="text-gray-600 dark:text-gray-400">
      {filtered ? 'No words match your filters.' : 'No words yet.'}
    </p>
    <Link to="new" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
      <FiPlus /> Add your first word
    </Link>
  </div>
)

export default DictionaryListPage
