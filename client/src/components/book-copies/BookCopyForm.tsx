import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookCopyCreateSchema, type BookCopyCreateDto, type BookCopy } from '../../types/book-copy'
import type { Book } from '../../types/book'

interface BookCopyFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BookCopyCreateDto) => void
  loading?: boolean
  editData?: BookCopy | null
  books: Book[]
}

const conditionLabels = {
  NEW: 'Nuevo',
  GOOD: 'Bueno',
  FAIR: 'Regular',
  DAMAGED: 'Dañado',
}

export default function BookCopyForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
  books,
}: BookCopyFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookCopyCreateDto>({
    resolver: zodResolver(bookCopyCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({ bookId: editData.bookId, condition: editData.condition })
    } else {
      reset({ bookId: '', condition: 'GOOD' })
    }
  }, [editData, reset, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {editData ? 'Editar ejemplar' : 'Nuevo ejemplar'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          {!editData && (
            <TextField
              label="Libro"
              select
              fullWidth
              defaultValue=""
              {...register('bookId')}
              error={!!errors.bookId}
              helperText={errors.bookId?.message}
            >
              {books.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.title}
                </MenuItem>
              ))}
            </TextField>
          )}
          {editData && (
            <TextField
              label="Libro"
              fullWidth
              value={editData.book?.title ?? ''}
              disabled
            />
          )}
          <TextField
            label="Condición"
            select
            fullWidth
            defaultValue={editData?.condition ?? 'GOOD'}
            {...register('condition')}
          >
            {Object.entries(conditionLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          {editData && (
            <TextField
              label="Código de inventario"
              fullWidth
              value={editData.inventoryCode}
              disabled
            />
          )}
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
