import { useState } from 'react'
import { useBooks } from '../../../hook/books/useBooks'
import { useCreateBook } from '../../../hook/books/useCreateBook'
import { useUpdateBook } from '../../../hook/books/useUpdateBook'
import { useDeleteBook } from '../../../hook/books/useDeleteBook'
import type { Book, BookCreateDto } from '../../../types/book'

export function useBookModule() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: books, isPending } = useBooks(search || undefined)
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()

  const openCreateForm = () => {
    setEditBook(null)
    setFormOpen(true)
  }

  const openEditForm = (book: Book) => {
    setEditBook(book)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditBook(null)
  }

  const handleSubmitForm = (data: BookCreateDto) => {
    if (editBook) {
      updateBook.mutate(
        { id: editBook.id, data },
        { onSuccess: closeForm }
      )
    } else {
      createBook.mutate(data, { onSuccess: closeForm })
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteBook.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    books: books ?? [],
    isPending,
    search,
    setSearch,
    formOpen,
    editBook,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading: createBook.isPending || updateBook.isPending,
    isDeleteLoading: deleteBook.isPending,
  }
}
