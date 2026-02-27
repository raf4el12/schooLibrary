import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { usePenaltyModule } from './hooks/usePenaltyModule'

export default function PenaltyMain() {
  const {
    penalties,
    isPending,
    resolvedFilter,
    setResolvedFilter,
    resolveId,
    setResolveId,
    handleResolve,
    isResolveLoading,
  } = usePenaltyModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Penalidades</h1>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          select
          label="Estado"
          value={resolvedFilter}
          onChange={(e) => setResolvedFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="false">Pendientes</MenuItem>
          <MenuItem value="true">Resueltas</MenuItem>
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
                  <th className="text-left px-4 py-3">Prestatario</th>
                  <th className="text-left px-4 py-3">Libro</th>
                  <th className="text-left px-4 py-3">Razón</th>
                  <th className="text-left px-4 py-3">Fecha</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {penalties.map((penalty) => (
                  <tr key={penalty.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {penalty.borrower?.name}
                      <span className="text-gray-400 ml-1 text-xs">
                        ({penalty.borrower?.code})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {penalty.loan?.bookCopy?.book?.title ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{penalty.reason}</td>
                    <td className="px-4 py-3">
                      {new Date(penalty.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={penalty.resolved ? 'Resuelta' : 'Pendiente'}
                        size="small"
                        color={penalty.resolved ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!penalty.resolved && (
                        <IconButton
                          size="small"
                          color="success"
                          title="Resolver"
                          onClick={() => setResolveId(penalty.id)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      {penalty.resolved && (
                        <span className="text-xs text-gray-400">
                          {penalty.resolvedAt
                            ? new Date(penalty.resolvedAt).toLocaleDateString()
                            : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {penalties.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No se encontraron penalidades
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={!!resolveId} onClose={() => setResolveId(null)}>
        <DialogTitle>Resolver penalidad</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Confirmas que deseas resolver esta penalidad? Si es la última
            penalidad pendiente del prestatario, se reactivará su acceso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveId(null)} disabled={isResolveLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleResolve}
            variant="contained"
            color="success"
            disabled={isResolveLoading}
          >
            {isResolveLoading ? 'Procesando...' : 'Resolver'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
