import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/adminLeaders'

const KEYS = {
  list: (params) => ['admin', 'leaders', params],
  one:  (id)     => ['admin', 'leader', id],
}

export const useAdminLeaders = (params = {}) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => api.listLeaders(params),
    keepPreviousData: true,
  })

export const useAdminLeader = (id) =>
  useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => api.getLeader(id),
    enabled: Boolean(id),
  })

/**
 * Create or update — single mutation hook. Invalidates both the admin list
 * and public ['leaders'] cache so the storefront refetches.
 */
export const useUpsertLeader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => (id ? api.updateLeader(id, body) : api.createLeader(body)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['admin', 'leaders'] })
      if (vars?.id) qc.invalidateQueries({ queryKey: ['admin', 'leader', vars.id] })
      qc.invalidateQueries({ queryKey: ['leaders'] })
    },
  })
}

export const useDeleteLeader = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.deleteLeader(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'leaders'] })
      qc.invalidateQueries({ queryKey: ['leaders'] })
    },
  })
}
