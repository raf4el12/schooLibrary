import { useState } from 'react'
import { usePenalties } from '../../../hook/penalties/usePenalties'
import { useResolvePenalty } from '../../../hook/penalties/useResolvePenalty'

export function usePenaltyModule() {
  const [resolvedFilter, setResolvedFilter] = useState<string>('')
  const [resolveId, setResolveId] = useState<string | null>(null)

  const { data: penalties, isPending } = usePenalties(resolvedFilter || undefined)
  const resolvePenalty = useResolvePenalty()

  const handleResolve = () => {
    if (!resolveId) return
    resolvePenalty.mutate(resolveId, {
      onSuccess: () => setResolveId(null),
    })
  }

  return {
    penalties: penalties ?? [],
    isPending,
    resolvedFilter,
    setResolvedFilter,
    resolveId,
    setResolveId,
    handleResolve,
    isResolveLoading: resolvePenalty.isPending,
  }
}
