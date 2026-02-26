import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Loan } from '../../types/loan'

export function useLoans(status?: string) {
  return useQuery({
    queryKey: ['loans', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      return ApiBackend.get<Loan[]>(`/loans${params}`)
    },
  })
}
