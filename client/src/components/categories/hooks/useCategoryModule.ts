import { useState } from 'react'
import { useCategories } from '../../../hook/categories/useCategories'
import { useCreateCategory } from '../../../hook/categories/useCreateCategory'
import { useUpdateCategory } from '../../../hook/categories/useUpdateCategory'
import { useDeleteCategory } from '../../../hook/categories/useDeleteCategory'
import type { Category, CategoryCreateDto } from '../../../types/category'

export function useCategoryModule() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: categories, isPending } = useCategories(search || undefined)
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const openCreateForm = () => {
    setEditCategory(null)
    setFormOpen(true)
  }

  const openEditForm = (category: Category) => {
    setEditCategory(category)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditCategory(null)
  }

  const handleSubmitForm = (data: CategoryCreateDto) => {
    if (editCategory) {
      updateCategory.mutate(
        { id: editCategory.id, data },
        { onSuccess: closeForm }
      )
    } else {
      createCategory.mutate(data, { onSuccess: closeForm })
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteCategory.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return {
    categories: categories ?? [],
    isPending,
    search,
    setSearch,
    formOpen,
    editCategory,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading: createCategory.isPending || updateCategory.isPending,
    isDeleteLoading: deleteCategory.isPending,
  }
}
