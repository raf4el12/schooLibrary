import { useState } from 'react'
import { useBookCopies } from '../../../hook/book-copies/useBookCopies'
import { useCreateBookCopy } from '../../../hook/book-copies/useCreateBookCopy'
import { useUpdateBookCopy } from '../../../hook/book-copies/useUpdateBookCopy'
import { useDeleteBookCopy } from '../../../hook/book-copies/useDeleteBookCopy'
import type { BookCopy } from '../../../types/book-copy'
import type { BookCopyCreateDto } from '../../../types/book-copy'

export function useBookCopyModule() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editCopy, setEditCopy] = useState<BookCopy | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: copies, isPending } = useBookCopies(search || undefined)
  const createCopy = useCreateBookCopy()
  const updateCopy = useUpdateBookCopy()
  const deleteCopy = useDeleteBookCopy()

  const openCreateForm = () => {
    setEditCopy(null)
    setFormOpen(true)
  }

  const openEditForm = (copy: BookCopy) => {
    setEditCopy(copy)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditCopy(null)
  }

  const handleSubmitForm = (data: BookCopyCreateDto) => {
    if (editCopy) {
      updateCopy.mutate(
        { id: editCopy.id, data: { condition: data.condition } },
        { onSuccess: closeForm }
      )
    } else {
      createCopy.mutate(data, { onSuccess: closeForm })
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteCopy.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    copies: copies ?? [],
    isPending,
    search,
    setSearch,
    formOpen,
    editCopy,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading: createCopy.isPending || updateCopy.isPending,
    isDeleteLoading: deleteCopy.isPending,
  }
}
