import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookCreateSchema, type BookCreateDto } from '../../types/book'
import type { Book } from '../../types/book'
import type { Author } from '../../types/author'
import type { Category } from '../../types/category'

interface BookFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BookCreateDto) => void
  loading?: boolean
  editData?: Book | null
  authors: Author[]
  categories: Category[]
}

export default function BookForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
  authors,
  categories,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookCreateDto>({
    resolver: zodResolver(bookCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        isbn: editData.isbn ?? '',
        publishedYear: editData.publishedYear ?? '',
        authorIds: editData.authors?.map((a) => a.id) ?? [],
        categoryIds: editData.categories?.map((c) => c.id) ?? [],
      })
    } else {
      reset({ title: '', isbn: '', publishedYear: '', authorIds: [], categoryIds: [] })
    }
  }, [editData, reset, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{editData ? 'Editar libro' : 'Nuevo libro'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <TextField
            label="Título"
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="ISBN (opcional)"
            fullWidth
            {...register('isbn')}
          />
          <TextField
            label="Año de publicación (opcional)"
            type="number"
            fullWidth
            {...register('publishedYear')}
            error={!!errors.publishedYear}
            helperText={errors.publishedYear?.message}
          />
          <Controller
            name="authorIds"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <TextField
                label="Autores"
                select
                fullWidth
                slotProps={{
                  select: {
                    multiple: true,
                    renderValue: (selected) => {
                      const ids = selected as string[]
                      return authors
                        .filter((a) => ids.includes(a.id))
                        .map((a) => a.name)
                        .join(', ')
                    },
                  },
                }}
                value={field.value ?? []}
                onChange={field.onChange}
              >
                {authors.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    <Checkbox checked={(field.value ?? []).includes(a.id)} size="small" />
                    <ListItemText primary={a.name} />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="categoryIds"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <TextField
                label="Categorías"
                select
                fullWidth
                slotProps={{
                  select: {
                    multiple: true,
                    renderValue: (selected) => {
                      const ids = selected as string[]
                      return categories
                        .filter((c) => ids.includes(c.id))
                        .map((c) => c.name)
                        .join(', ')
                    },
                  },
                }}
                value={field.value ?? []}
                onChange={field.onChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={(field.value ?? []).includes(c.id)} size="small" />
                    <ListItemText primary={`${c.name} (${c.prefix})`} />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
