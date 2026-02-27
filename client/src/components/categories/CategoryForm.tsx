import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoryCreateSchema, type CategoryCreateDto, type Category } from '../../types/category'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CategoryCreateDto) => void
  loading?: boolean
  editData?: Category | null
}

export default function CategoryForm({
  open,
  onClose,
  onSubmit,
  loading,
  editData,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryCreateDto>({
    resolver: zodResolver(categoryCreateSchema),
  })

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name, prefix: editData.prefix })
    } else {
      reset({ name: '', prefix: '' })
    }
  }, [editData, reset, open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {editData ? 'Editar categoría' : 'Nueva categoría'}
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
            label="Prefijo (3 caracteres)"
            fullWidth
            {...register('prefix')}
            error={!!errors.prefix}
            helperText={errors.prefix?.message}
            slotProps={{ htmlInput: { maxLength: 3, style: { textTransform: 'uppercase' } } }}
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
