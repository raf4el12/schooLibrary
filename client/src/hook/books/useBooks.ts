import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Book } from '../../types/book'

export function useBooks(search?: string) {
  return useQuery({
    queryKey: ['books', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      return ApiBackend.get<Book[]>(`/books${params}`)
    },
  })
}
