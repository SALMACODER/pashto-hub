import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/adminLessons'

const KEYS = {
  list: (params) => ['admin', 'lessons', params],
  one:  (id)     => ['admin', 'lesson', id],
}

export const useAdminLessons = (params = {}) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.listLessons(params),
    keepPreviousData: true,
  })

export const useAdminLesson = (id) =>
  useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => api.getLesson(id),
    enabled: Boolean(id),
  })

/**
 * Create or update — single mutation hook. The form passes { id, body };
 * if id is set we PUT, otherwise POST.
 *
 * Invalidates BOTH admin and public lesson caches so the storefront refetches.
 */
export const useUpsertLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => (id ? api.updateLesson(id, body) : api.createLesson(body)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'lessons'] })
      if (vars?.id) qc.invalidateQueries({ queryKey: ['admin', 'lesson', vars.id] })
      qc.invalidateQueries({ queryKey: ['lessons'] })   // public cache
    },
  })
}

export const useDeleteLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.deleteLesson(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'lessons'] })
      qc.invalidateQueries({ queryKey: ['lessons'] })
    },
  })
}
