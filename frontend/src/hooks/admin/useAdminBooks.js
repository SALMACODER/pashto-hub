import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/adminBooks'

const KEYS = {
  list: (params) => ['admin', 'books', params],
  one:  (id)     => ['admin', 'book', id],
}

/**
 * Cached list with filters. Used by the admin BooksListPage.
 */
export const useAdminBooks = (params = {}) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.listBooks(params),
    keepPreviousData: true,
  })

export const useAdminBook = (id) =>
  useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => api.getBook(id),
    enabled: Boolean(id),
  })

/**
 * Create or update — single mutation hook. The form passes { id, body };
 * if id is set we PUT, otherwise POST.
 *
 * On success we invalidate BOTH the admin list AND the public list so the
 * storefront refetches on next mount/focus.
 */
export const useUpsertBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => (id ? api.updateBook(id, body) : api.createBook(body)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'books'] })
      if (vars?.id) qc.invalidateQueries({ queryKey: ['admin', 'book', vars.id] })
      qc.invalidateQueries({ queryKey: ['books'] })  // public list
    },
  })
}

export const useDeleteBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.deleteBook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'books'] })
      qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
