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
import BookCopyForm from './BookCopyForm'
import ConfirmDialog from '../commons/ConfirmDialog'
import { useBookCopyModule } from './hooks/useBookCopyModule'
import { useBooks } from '../../hook/books/useBooks'
import type { CopyCondition } from '../../types/book-copy'

const conditionLabels: Record<CopyCondition, string> = {
  NEW: 'Nuevo',
  GOOD: 'Bueno',
  FAIR: 'Regular',
  DAMAGED: 'Dañado',
}

const conditionColors: Record<CopyCondition, 'success' | 'info' | 'warning' | 'error'> = {
  NEW: 'success',
  GOOD: 'info',
  FAIR: 'warning',
  DAMAGED: 'error',
}

export default function BookCopyMain() {
  const {
    copies,
    isPending,
    search,
    setSearch,
    formOpen,
    editCopy,
    deleteId,
    setDeleteId,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmitForm,
    handleDelete,
    isFormLoading,
    isDeleteLoading,
  } = useBookCopyModule()

  const { data: books } = useBooks()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ejemplares</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Nuevo ejemplar
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Buscar por código o título de libro..."
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
                  <th className="text-left px-4 py-3">Libro</th>
                  <th className="text-center px-4 py-3">Condición</th>
                  <th className="text-center px-4 py-3">Disponible</th>
                  <th className="text-center px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {copies.map((copy) => (
                  <tr key={copy.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">
                      {copy.inventoryCode}
                    </td>
                    <td className="px-4 py-3">{copy.book?.title ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={conditionLabels[copy.condition]}
                        size="small"
                        color={conditionColors[copy.condition]}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={copy.isAvailable ? 'Sí' : 'No'}
                        size="small"
                        color={copy.isAvailable ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <IconButton
                        size="small"
                        onClick={() => openEditForm(copy)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(copy.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {copies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No se encontraron ejemplares
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <BookCopyForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
        loading={isFormLoading}
        editData={editCopy}
        books={books ?? []}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar ejemplar"
        message="¿Estás seguro de que deseas eliminar este ejemplar? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleteLoading}
      />
    </div>
  )
}
