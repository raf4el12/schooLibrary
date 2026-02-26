import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loanCreateSchema, type LoanCreateDto } from '../../types/loan'
import type { Book } from '../../types/book'
import type { Borrower } from '../../types/borrower'

interface LoanFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LoanCreateDto) => void
  loading?: boolean
  books: Book[]
  borrowers: Borrower[]
}

export default function LoanForm({
  open,
  onClose,
  onSubmit,
  loading,
  books,
  borrowers,
}: LoanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoanCreateDto>({
    resolver: zodResolver(loanCreateSchema),
  })

  const handleClose = () => {
    reset({ borrowerId: '', bookId: '', dueDate: '' })
    onClose()
  }

  const availableBooks = books.filter((b) => b.availableCopies > 0)

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Nuevo préstamo</DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <TextField
            label="Prestatario"
            select
            fullWidth
            defaultValue=""
            {...register('borrowerId')}
            error={!!errors.borrowerId}
            helperText={errors.borrowerId?.message}
          >
            {borrowers.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name} ({b.type === 'STUDENT' ? 'Estudiante' : 'Profesor'})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Libro"
            select
            fullWidth
            defaultValue=""
            {...register('bookId')}
            error={!!errors.bookId}
            helperText={errors.bookId?.message}
          >
            {availableBooks.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.availableCopies} disponibles)
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha de devolución"
            type="date"
            fullWidth
            {...register('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creando...' : 'Crear préstamo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
