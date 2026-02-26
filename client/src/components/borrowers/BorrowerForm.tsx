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
import { borrowerCreateSchema, type BorrowerCreateDto, type Borrower } from '../../types/borrower'

interface BorrowerFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BorrowerCreateDto) => void
  loading?: boolean
  editData?: Borrower | null
}

export default function BorrowerForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
}: BorrowerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BorrowerCreateDto>({
    resolver: zodResolver(borrowerCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        email: editData.email ?? '',
        grade: editData.grade ?? '',
        type: editData.type,
      })
    } else {
      reset({ name: '', email: '', grade: '', type: 'STUDENT' })
    }
  }, [editData, reset, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {editData ? 'Editar prestatario' : 'Nuevo prestatario'}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <TextField
            label="Nombre"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email (opcional)"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Grado (opcional)"
            fullWidth
            {...register('grade')}
          />
          <TextField
            label="Tipo"
            select
            fullWidth
            defaultValue={editData?.type ?? 'STUDENT'}
            {...register('type')}
          >
            <MenuItem value="STUDENT">Estudiante</MenuItem>
            <MenuItem value="TEACHER">Profesor</MenuItem>
          </TextField>
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
