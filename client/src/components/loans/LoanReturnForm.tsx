import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loanReturnSchema, type LoanReturnDto } from '../../types/loan'

interface LoanReturnFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: LoanReturnDto) => void
  loading?: boolean
}

export default function LoanReturnForm({
  open,
  onClose,
  onSubmit,
  loading,
}: LoanReturnFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoanReturnDto>({
    resolver: zodResolver(loanReturnSchema),
  })

  const handleClose = () => {
    reset({ inventoryCode: '', condition: undefined })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Devolver libro</DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <TextField
            label="Código de inventario"
            fullWidth
            placeholder="Ej: LIT-001"
            {...register('inventoryCode')}
            error={!!errors.inventoryCode}
            helperText={errors.inventoryCode?.message}
          />
          <TextField
            label="Condición al devolver (opcional)"
            select
            fullWidth
            defaultValue=""
            {...register('condition')}
          >
            <MenuItem value="">Sin cambio</MenuItem>
            <MenuItem value="NEW">Nuevo</MenuItem>
            <MenuItem value="GOOD">Bueno</MenuItem>
            <MenuItem value="FAIR">Regular</MenuItem>
            <MenuItem value="DAMAGED">Dañado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar devolución'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
