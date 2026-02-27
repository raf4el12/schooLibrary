import { useState } from 'react'
import { useAuthors } from '../../../hook/authors/useAuthors'
import { useCreateAuthor } from '../../../hook/authors/useCreateAuthor'
import { useUpdateAuthor } from '../../../hook/authors/useUpdateAuthor'
import { useDeleteAuthor } from '../../../hook/authors/useDeleteAuthor'
import type { Author, AuthorCreateDto } from '../../../types/author'

export function useAuthorModule() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editAuthor, setEditAuthor] = useState<Author | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: authors, isPending } = useAuthors(search || undefined)
  const createAuthor = useCreateAuthor()
  const updateAuthor = useUpdateAuthor()
  const deleteAuthor = useDeleteAuthor()

  const openCreateForm = () => {
    setEditAuthor(null)
    setFormOpen(true)
  }

  const openEditForm = (author: Author) => {
    setEditAuthor(author)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditAuthor(null)
  }

  const handleSubmitForm = (data: AuthorCreateDto) => {
    if (editAuthor) {
      updateAuthor.mutate(
        { id: editAuthor.id, data },
        { onSuccess: closeForm }
      )
    } else {
      createAuthor.mutate(data, { onSuccess: closeForm })
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteAuthor.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    authors: authors ?? [],
    isPending,
    search,
    setSearch,
    formOpen,
    editAuthor,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading: createAuthor.isPending || updateAuthor.isPending,
    isDeleteLoading: deleteAuthor.isPending,
  }
}
