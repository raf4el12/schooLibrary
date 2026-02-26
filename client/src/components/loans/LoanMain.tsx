import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LoanForm from './LoanForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useLoanModule } from './hooks/useLoanModule'
import type { LoanStatus } from '../../types/loan'

const statusColors: Record<LoanStatus, 'warning' | 'success' | 'error'> = {
  ACTIVE: 'warning',
  RETURNED: 'success',
  OVERDUE: 'error',
}

const statusLabels: Record<LoanStatus, string> = {
  ACTIVE: 'Activo',
  RETURNED: 'Devuelto',
  OVERDUE: 'Vencido',
}

export default function LoanMain() {
  const {
    loans,
    books,
    borrowers,
    isPending,
    statusFilter,
    setStatusFilter,
    formOpen,
    deleteId,
    setDeleteId,
    returnId,
    setReturnId,
    openCreateForm,
    closeForm,
    handleSubmitForm,
    handleReturn,
    handleDelete,
    isFormLoading,
    isReturnLoading,
    isDeleteLoading,
  } = useLoanModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Préstamos</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nuevo préstamo
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          select
          label="Estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ACTIVE">Activos</MenuItem>
          <MenuItem value="RETURNED">Devueltos</MenuItem>
          <MenuItem value="OVERDUE">Vencidos</MenuItem>
        </TextField>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <Card variant="outlined">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Libro</th>
                  <th className="text-left px-4 py-3">Prestatario</th>
                  <th className="text-left px-4 py-3">Fecha préstamo</th>
                  <th className="text-left px-4 py-3">Fecha devolución</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {loan.book.title}
                    </td>
                    <td className="px-4 py-3">{loan.borrower.name}</td>
                    <td className="px-4 py-3">
                      {new Date(loan.borrowedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={statusLabels[loan.status]}
                        size="small"
                        color={statusColors[loan.status]}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {loan.status === 'ACTIVE' && (
                        <IconButton
                          size="small"
                          color="success"
                          title="Devolver"
                          onClick={() => setReturnId(loan.id)}
                        >
                          <KeyboardReturnIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(loan.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No se encontraron préstamos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <LoanForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        books={books}
        borrowers={borrowers}
      />

      {/* Return confirmation dialog */}
      <Dialog open={!!returnId} onClose={() => setReturnId(null)}>
        <DialogTitle>Devolver libro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Confirmas la devolución de este libro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnId(null)} disabled={isReturnLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleReturn}
            variant="contained"
            color="success"
            disabled={isReturnLoading}
          >
            {isReturnLoading ? 'Procesando...' : 'Confirmar devolución'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar préstamo"
        message="¿Estás seguro de que deseas eliminar este préstamo?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
