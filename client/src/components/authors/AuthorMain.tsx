import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AuthorForm from './AuthorForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useAuthorModule } from './hooks/useAuthorModule'

export default function AuthorMain() {
  const {
    authors,
    isPending,
    search,
    setSearch,
    formOpen,
    editAuthor,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading,
    isDeleteLoading,
  } = useAuthorModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Autores</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nuevo autor
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Buscar por nombre..."
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
                  <th className="text-center px-4 py-3">Libros</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{author.name}</td>
                    <td className="px-4 py-3 text-center">
                      {author._count?.books ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <IconButton
                        size="small"
                        onClick={() => openEditForm(author)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(author.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {authors.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                      No se encontraron autores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AuthorForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        editData={editAuthor}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar autor"
        message="¿Estás seguro de que deseas eliminar este autor? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
