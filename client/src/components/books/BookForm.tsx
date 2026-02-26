import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookCreateSchema, type BookCreateDto } from '../../types/book'
import type { Book } from '../../types/book'

interface BookFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BookCreateDto) => void
  loading?: boolean
  editData?: Book | null
}

export default function BookForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookCreateDto>({
    resolver: zodResolver(bookCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        author: editData.author,
        isbn: editData.isbn ?? '',
        totalCopies: editData.totalCopies,
      })
    } else {
      reset({ title: '', author: '', isbn: '', totalCopies: 1 })
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
            label="Autor"
            fullWidth
            {...register('author')}
            error={!!errors.author}
            helperText={errors.author?.message}
          />
          <TextField
            label="ISBN (opcional)"
            fullWidth
            {...register('isbn')}
          />
          <TextField
            label="Cantidad de copias"
            type="number"
            fullWidth
            {...register('totalCopies')}
            error={!!errors.totalCopies}
            helperText={errors.totalCopies?.message}
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
