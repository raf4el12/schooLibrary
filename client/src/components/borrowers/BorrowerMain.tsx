import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import BorrowerForm from './BorrowerForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useBorrowerModule } from './hooks/useBorrowerModule'

export default function BorrowerMain() {
  const {
    borrowers,
    isPending,
    search,
    setSearch,
    formOpen,
    editBorrower,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading,
    isDeleteLoading,
  } = useBorrowerModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prestatarios</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nuevo prestatario
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Buscar por nombre, código, email o grado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 360 }}
        />
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
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Grado</th>
                  <th className="text-center px-4 py-3">Tipo</th>
                  <th className="text-center px-4 py-3">Estado</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {borrowers.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{b.code}</td>
                    <td className="px-4 py-3 font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {b.email || '—'}
                    </td>
                    <td className="px-4 py-3">{b.grade || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={b.type === 'STUDENT' ? 'Estudiante' : 'Profesor'}
                        size="small"
                        color={b.type === 'STUDENT' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={b.isActive ? 'Activo' : 'Suspendido'}
                        size="small"
                        color={b.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <IconButton size="small" onClick={() => openEditForm(b)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(b.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {borrowers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No se encontraron prestatarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <BorrowerForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        editData={editBorrower}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar prestatario"
        message="¿Estás seguro de que deseas eliminar este prestatario?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
