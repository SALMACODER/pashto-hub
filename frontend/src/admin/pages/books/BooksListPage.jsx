import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader, FiAlertCircle, FiBook } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import { useAdminBooks, useDeleteBook } from '../../../hooks/admin/useAdminBooks'
import { useCategories } from '../../../hooks/admin/useAdminCategories'
import { cloudImg } from '../../../utils/cloudinaryUrl'

const PAGE_SIZE = 20

const BooksListPage = () => {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE }
    if (q.trim()) p.q = q.trim()
    if (category) p.category = category
    return p
  }, [q, category, page])

  const { data, isLoading, isFetching, error } = useAdminBooks(params)
  const { data: catData } = useCategories()
  const del = useDeleteBook()

  const books = data?.data?.items || data?.books || []
  const pagination = data?.data?.pagination || {
    page: 1, pages: 1, total: data?.total || books.length, pageSize: PAGE_SIZE,
  }
  const categories = catData?.items || catData?.data?.items || []

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title?.en || book.title?.ps}"? This cannot be undone.`)) return
    try {
      await del.mutateAsync(book._id)
    } catch (e) {
      alert(e.response?.data?.error?.message || e.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Books"
        subtitle={`${pagination.total ?? 0} total`}
        actions={(
          <Link to="new" className="btn-primary !py-2 text-sm">
            <FiPlus /> New book
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
            placeholder="Search title or author…"
            className="w-full py-2 pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg sm:w-56 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id || c.slug} value={c.slug}>{c.name?.en || c.slug}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <FiLoader className="mr-2 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 h-48 text-red-600">
            <FiAlertCircle /> {error.response?.data?.error?.message || error.message}
          </div>
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="w-16 px-4 py-3">Cover</th>
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 md:table-cell">Author</th>
                <th className="hidden px-4 py-3 lg:table-cell">Category</th>
                <th className="hidden px-4 py-3 lg:table-cell">Updated</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {books.map((b) => (
                <BookRow key={b._id} book={b} onDelete={handleDelete} deleting={del.isPending && del.variables === b._id} />
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
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

const BookRow = ({ book, onDelete, deleting }) => {
  const cover = book.coverImage ? cloudImg(book.coverImage, { width: 80, height: 110 }) : null
  return (
    <tr className="text-gray-900 dark:text-gray-100">
      <td className="px-4 py-3">
        {cover ? (
          <img
            src={cover}
            alt=""
            width="40" height="56"
            loading="lazy" decoding="async"
            className="object-cover w-10 rounded shadow-sm h-14"
          />
        ) : (
          <div className="flex items-center justify-center w-10 text-gray-400 bg-gray-100 rounded h-14 dark:bg-gray-800">
            <FiBook />
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-medium">
        <div>{book.title?.en || book.title?.ps}</div>
        {book.title?.ps && book.title?.en && (
          <div className="text-xs text-gray-500 pashto-text">{book.title.ps}</div>
        )}
      </td>
      <td className="hidden px-4 py-3 text-gray-600 md:table-cell dark:text-gray-400">
        {book.author?.en}
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {book.category}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-xs text-gray-500 lg:table-cell dark:text-gray-500">
        {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={book._id}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Edit"
            aria-label={`Edit ${book.title?.en || ''}`}
          >
            <FiEdit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(book)}
            disabled={deleting}
            className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-950/40"
            title="Delete"
            aria-label={`Delete ${book.title?.en || ''}`}
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
    <FiBook className="mx-auto mb-3 text-gray-400" size={32} />
    <p className="text-gray-600 dark:text-gray-400">No books match your filters.</p>
    <Link to="new" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
      <FiPlus /> Add your first book
    </Link>
  </div>
)

export default BooksListPage
