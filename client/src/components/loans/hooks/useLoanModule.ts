import { useState } from 'react'
import { useLoans } from '../../../hook/loans/useLoans'
import { useCreateLoan } from '../../../hook/loans/useCreateLoan'
import { useReturnLoan } from '../../../hook/loans/useReturnLoan'
import { useDeleteLoan } from '../../../hook/loans/useDeleteLoan'
import { useBooks } from '../../../hook/books/useBooks'
import { useBorrowers } from '../../../hook/borrowers/useBorrowers'
import type { LoanCreateDto } from '../../../types/loan'

export function useLoanModule() {
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [returnId, setReturnId] = useState<string | null>(null)

  const { data: loans, isPending } = useLoans(statusFilter || undefined)
  const { data: books } = useBooks()
  const { data: borrowers } = useBorrowers()
  const createLoan = useCreateLoan()
  const returnLoan = useReturnLoan()
  const deleteLoan = useDeleteLoan()

  const openCreateForm = () => setFormOpen(true)
  const closeForm = () => setFormOpen(false)

  const handleSubmitForm = (data: LoanCreateDto) => {
    createLoan.mutate(data, { onSuccess: closeForm })
  }

  const handleReturn = () => {
    if (!returnId) return
    returnLoan.mutate(returnId, {
      onSuccess: () => setReturnId(null),
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteLoan.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    loans: loans ?? [],
    books: books ?? [],
    borrowers: borrowers ?? [],
    isPending,
    statusFilter,
    setStatusFilter,
    formOpen,
    deleteId,
    setDeleteId,
    returnId,
    setReturnId,
    openCreateForm,
    closeForm,
    handleSubmitForm,
    handleReturn,
    handleDelete,
    isFormLoading: createLoan.isPending,
    isReturnLoading: returnLoan.isPending,
    isDeleteLoading: deleteLoan.isPending,
  }
}
