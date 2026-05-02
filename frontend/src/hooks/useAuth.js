import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as authApi from '../api/auth'

/**
 * Current user — backed by GET /api/auth/me.
 * Returns `data.user` when logged in, undefined otherwise.
 * 401 is treated as "not logged in", not an error to surface.
 */
export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().catch(() => null),
    staleTime: 60 * 1000,
  })

export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  })
}

export const useLogout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      qc.setQueryData(['me'], null)
      qc.invalidateQueries()
    },
  })
}
