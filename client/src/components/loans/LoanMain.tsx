import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import LoanForm from './LoanForm'
import LoanReturnForm from './LoanReturnForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useLoanModule } from './hooks/useLoanModule'
import type { LoanStatus } from '../../types/loan'
import { useMemo } from 'react'

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

function DaysIndicator({ loan }: { loan: { status: LoanStatus; dueDate: string } }) {
  const now = useMemo(() => Date.now(), [])

  if (loan.status === 'RETURNED') return null

  const dueTime = new Date(loan.dueDate).getTime()
  const diffMs = dueTime - now
  const diffDays = Math.ceil(diffMs / 86_400_000)

  if (loan.status === 'OVERDUE') {
    const overdueDays = Math.abs(diffDays)
    return (
      <Tooltip title={`${overdueDays} día(s) de retraso — Prestatario suspendido`}>
        <span
          className="inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: '#fef2f2', color: '#e11d48' }}
        >
          <WarningAmberIcon sx={{ fontSize: 13 }} />
          +{overdueDays}d
        </span>
      </Tooltip>
    )
  }

  // ACTIVE
  if (diffDays <= 2 && diffDays >= 0) {
    return (
      <Tooltip title={`Vence en ${diffDays} día(s)`}>
        <span
          className="text-[11px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: '#fffbeb', color: '#d97706' }}
        >
          {diffDays}d restante{diffDays !== 1 ? 's' : ''}
        </span>
      </Tooltip>
    )
  }

  return null
}

export default function LoanMain() {
  const {
    loans,
    isPending,
    statusFilter,
    setStatusFilter,
    formOpen,
    returnOpen,
    deleteId,
    setDeleteId,
    openCreateForm,
    closeForm,
    openReturnForm,
    closeReturnForm,
    handleSubmitBorrow,
    handleSubmitReturn,
    handleDelete,
    isBorrowLoading,
    isReturnLoading,
    isDeleteLoading,
  } = useLoanModule()

  const overdueCount = useMemo(
    () => loans.filter((l) => l.status === 'OVERDUE').length,
    [loans],
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="page-title">Préstamos</h1>
          {overdueCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-lg"
              style={{ background: '#fef2f2', color: '#e11d48' }}
            >
              <WarningAmberIcon sx={{ fontSize: 15 }} />
              {overdueCount} vencido{overdueCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="success"
            startIcon={<KeyboardReturnIcon />}
            onClick={openReturnForm}
          >
            Devolver
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateForm}
          >
            Nuevo préstamo
          </Button>
        </div>
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
                  <th className="text-left px-4 py-3">Código</th>
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
                  <tr
                    key={loan.id}
                    className="hover:bg-gray-50"
                    style={
                      loan.status === 'OVERDUE'
                        ? { background: 'rgba(254,242,242,0.5)' }
                        : undefined
                    }
                  >
                    <td className="px-4 py-3 font-mono">
                      {loan.bookCopy?.inventoryCode ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {loan.bookCopy?.book?.title ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {loan.borrower?.name}
                      <span className="text-gray-400 ml-1 text-xs">
                        (DNI: {loan.borrower?.dni})
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {new Date(loan.borrowedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                        <DaysIndicator loan={loan} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={statusLabels[loan.status]}
                        size="small"
                        color={statusColors[loan.status]}
                        variant={loan.status === 'OVERDUE' ? 'filled' : 'outlined'}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
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
                      colSpan={7}
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
        onSubmit={handleSubmitBorrow}
        loading={isBorrowLoading}
      />

      <LoanReturnForm
        open={returnOpen}
        onClose={closeReturnForm}
        onSubmit={handleSubmitReturn}
        loading={isReturnLoading}
      />

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
