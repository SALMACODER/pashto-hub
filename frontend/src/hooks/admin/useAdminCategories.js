import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/adminCategories'

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
    staleTime: 10 * 60 * 1000,            // categories rarely change — cache aggressively
  })

/**
 * Used by CategoryCombobox's "Create new" inline action.
 * Returns the freshly created category so the caller can select it immediately.
 */
export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => api.createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
