import { useState } from 'react'
import { useLoans } from '../../../hook/loans/useLoans'
import { useCreateLoan } from '../../../hook/loans/useCreateLoan'
import { useReturnLoan } from '../../../hook/loans/useReturnLoan'
import { useDeleteLoan } from '../../../hook/loans/useDeleteLoan'
import type { LoanBorrowDto, LoanReturnDto } from '../../../types/loan'

export function useLoanModule() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: loans, isPending } = useLoans(statusFilter || undefined)
  const createLoan = useCreateLoan()
  const returnLoan = useReturnLoan()
  const deleteLoan = useDeleteLoan()

  const openCreateForm = () => setFormOpen(true)
  const closeForm = () => setFormOpen(false)

  const openReturnForm = () => setReturnOpen(true)
  const closeReturnForm = () => setReturnOpen(false)

  const handleSubmitBorrow = (data: LoanBorrowDto) => {
    createLoan.mutate(data, { onSuccess: closeForm })
  }

  const handleSubmitReturn = (data: LoanReturnDto) => {
    returnLoan.mutate(data, { onSuccess: closeReturnForm })
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteLoan.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    loans: loans ?? [],
    isPending,
    statusFilter,
    setStatusFilter,
    formOpen,
    returnOpen,
    deleteId,
    setDeleteId,
    openCreateForm,
    closeForm,
    openReturnForm,
    closeReturnForm,
    handleSubmitBorrow,
    handleSubmitReturn,
    handleDelete,
    isBorrowLoading: createLoan.isPending,
    isReturnLoading: returnLoan.isPending,
    isDeleteLoading: deleteLoan.isPending,
  }
}
