import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Category } from '../../types/category'

export function useCategories(search?: string) {
  return useQuery({
    queryKey: ['categories', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      return ApiBackend.get<Category[]>(`/categories${params}`)
    },
  })
}
