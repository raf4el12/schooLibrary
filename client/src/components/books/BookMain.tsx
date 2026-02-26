import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import BookForm from './BookForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useBookModule } from './hooks/useBookModule'

export default function BookMain() {
  const {
    books,
    isPending,
    search,
    setSearch,
    formOpen,
    editBook,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading,
    isDeleteLoading,
  } = useBookModule()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Libros</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nuevo libro
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Buscar por título, autor o ISBN..."
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
                  <th className="text-left px-4 py-3">Título</th>
                  <th className="text-left px-4 py-3">Autor</th>
                  <th className="text-left px-4 py-3">ISBN</th>
                  <th className="text-center px-4 py-3">Copias</th>
                  <th className="text-center px-4 py-3">Disponibles</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {book.isbn || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">{book.totalCopies}</td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={book.availableCopies}
                        size="small"
                        color={book.availableCopies > 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <IconButton
                        size="small"
                        onClick={() => openEditForm(book)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(book.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No se encontraron libros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <BookForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        editData={editBook}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar libro"
        message="¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
