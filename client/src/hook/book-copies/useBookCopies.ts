import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { BookCopy } from '../../types/book-copy'

export function useBookCopies(search?: string) {
  return useQuery({
    queryKey: ['book-copies', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      return ApiBackend.get<BookCopy[]>(`/book-copies${params}`)
    },
  })
}
