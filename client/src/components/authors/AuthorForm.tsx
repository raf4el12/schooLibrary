import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authorCreateSchema, type AuthorCreateDto, type Author } from '../../types/author'

interface AuthorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AuthorCreateDto) => void
  loading?: boolean
  editData?: Author | null
}

export default function AuthorForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
}: AuthorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorCreateDto>({
    resolver: zodResolver(authorCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name })
    } else {
      reset({ name: '' })
    }
  }, [editData, reset, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{editData ? 'Editar autor' : 'Nuevo autor'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <TextField
            label="Nombre"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
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
