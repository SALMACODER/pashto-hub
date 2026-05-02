import { useQuery } from '@tanstack/react-query'
import { listBooks, getBook } from '../api/books'

/**
 * Cached book list with filters. Re-fires when filters change.
 *
 *   const { data, isLoading, error } = useBooks({ q: 'پښتو', category: 'poetry' })
 *   data.data.items   →  array of books
 *   data.data.pagination
 */
export const useBooks = (params = {}) =>
  useQuery({
    queryKey: ['books', params],
    queryFn: () => listBooks(params),
    keepPreviousData: true,
  })

export const useBook = (idOrSlug) =>
  useQuery({
    queryKey: ['book', idOrSlug],
    queryFn: () => getBook(idOrSlug),
    enabled: Boolean(idOrSlug),
  })
