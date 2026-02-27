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
import CategoryForm from './CategoryForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useCategoryModule } from './hooks/useCategoryModule'

export default function CategoryMain() {
  const {
    categories,
    isPending,
    search,
    setSearch,
    formOpen,
    editCategory,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading,
    isDeleteLoading,
  } = useCategoryModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nueva categoría
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Buscar por nombre o prefijo..."
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
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-center px-4 py-3">Prefijo</th>
                  <th className="text-center px-4 py-3">Libros</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-center">
                      <Chip label={cat.prefix} size="small" variant="outlined" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {cat._count?.books ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <IconButton
                        size="small"
                        onClick={() => openEditForm(cat)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(cat.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No se encontraron categorías
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CategoryForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        editData={editCategory}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
