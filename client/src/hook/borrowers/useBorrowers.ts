import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Borrower } from '../../types/borrower'

export function useBorrowers(search?: string) {
  return useQuery({
    queryKey: ['borrowers', search],
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      return ApiBackend.get<Borrower[]>(`/borrowers${params}`)
    },
  })
}
