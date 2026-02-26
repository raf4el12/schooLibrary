import { useState } from 'react'
import { useBorrowers } from '../../../hook/borrowers/useBorrowers'
import { useCreateBorrower } from '../../../hook/borrowers/useCreateBorrower'
import { useUpdateBorrower } from '../../../hook/borrowers/useUpdateBorrower'
import { useDeleteBorrower } from '../../../hook/borrowers/useDeleteBorrower'
import type { Borrower, BorrowerCreateDto } from '../../../types/borrower'

export function useBorrowerModule() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editBorrower, setEditBorrower] = useState<Borrower | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: borrowers, isPending } = useBorrowers(search || undefined)
  const createBorrower = useCreateBorrower()
  const updateBorrower = useUpdateBorrower()
  const deleteBorrower = useDeleteBorrower()

  const openCreateForm = () => {
    setEditBorrower(null)
    setFormOpen(true)
  }

  const openEditForm = (borrower: Borrower) => {
    setEditBorrower(borrower)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditBorrower(null)
  }

  const handleSubmitForm = (data: BorrowerCreateDto) => {
    if (editBorrower) {
      updateBorrower.mutate(
        { id: editBorrower.id, data },
        { onSuccess: closeForm }
      )
    } else {
      createBorrower.mutate(data, { onSuccess: closeForm })
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteBorrower.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    borrowers: borrowers ?? [],
    isPending,
    search,
    setSearch,
    formOpen,
    editBorrower,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading: createBorrower.isPending || updateBorrower.isPending,
    isDeleteLoading: deleteBorrower.isPending,
  }
}
