import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Author } from '../../types/author'

export function useAuthors(search?: string) {
  return useQuery({
    queryKey: ['authors', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      return ApiBackend.get<Author[]>(`/authors${params}`)
    },
  })
}
