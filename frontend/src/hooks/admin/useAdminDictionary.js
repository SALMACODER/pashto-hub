import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/adminDictionary'

const KEYS = {
  list: (params) => ['admin', 'dictionary', params],
  one:  (id)     => ['admin', 'word', id],
}

export const useAdminWords = (params = {}) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.listWords(params),
    keepPreviousData: true,
  })

export const useAdminWord = (id) =>
  useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => api.getWord(id),
    enabled: Boolean(id),
  })

/**
 * Create or update — single mutation. Invalidates both admin AND public
 * dictionary caches so the storefront refetches on next mount.
 */
export const useUpsertWord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => (id ? api.updateWord(id, body) : api.createWord(body)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'dictionary'] })
      if (vars?.id) qc.invalidateQueries({ queryKey: ['admin', 'word', vars.id] })
      qc.invalidateQueries({ queryKey: ['dictionary'] })
    },
  })
}

export const useDeleteWord = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.deleteWord(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'dictionary'] })
      qc.invalidateQueries({ queryKey: ['dictionary'] })
    },
  })
}
