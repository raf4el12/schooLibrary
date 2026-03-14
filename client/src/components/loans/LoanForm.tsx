import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { useBorrowers } from '../../hook/borrowers/useBorrowers'
import { useBookCopies } from '../../hook/book-copies/useBookCopies'
import type { Borrower } from '../../types/borrower'
import type { BookCopy } from '../../types/book-copy'

interface LoanFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { borrowerIdentifier: string; inventoryCode: string }) => void
  loading?: boolean
}

export default function LoanForm({
  open,
  onClose,
  onSubmit,
  loading,
}: LoanFormProps) {
  const [borrowerSearch, setBorrowerSearch] = useState('')
  const [bookSearch, setBookSearch] = useState('')
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null)
  const [errors, setErrors] = useState<{ borrower?: string; copy?: string }>({})

  const { data: borrowers, isPending: borrowersLoading } = useBorrowers(
    borrowerSearch.length >= 1 ? borrowerSearch : undefined
  )
  const { data: bookCopies, isPending: copiesLoading } = useBookCopies(
    bookSearch.length >= 1 ? bookSearch : undefined
  )

  const availableCopies = (bookCopies ?? []).filter((c) => c.isAvailable)

  const handleClose = () => {
    setSelectedBorrower(null)
    setSelectedCopy(null)
    setBorrowerSearch('')
    setBookSearch('')
    setErrors({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { borrower?: string; copy?: string } = {}
    if (!selectedBorrower) newErrors.borrower = 'Seleccione un prestatario'
    if (!selectedCopy) newErrors.copy = 'Seleccione un ejemplar'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      borrowerIdentifier: selectedBorrower!.dni,
      inventoryCode: selectedCopy!.inventoryCode,
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nuevo préstamo</DialogTitle>
        <DialogContent className="flex flex-col gap-4 !pt-4">
          <Autocomplete
            options={borrowers ?? []}
            getOptionLabel={(option) =>
              `${option.dni} — ${option.name} (${option.code})`
            }
            value={selectedBorrower}
            onChange={(_e, value) => {
              setSelectedBorrower(value)
              setErrors((prev) => ({ ...prev, borrower: undefined }))
            }}
            onInputChange={(_e, value) => setBorrowerSearch(value)}
            loading={borrowersLoading}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            noOptionsText={
              borrowerSearch.length < 1
                ? 'Escriba el DNI para buscar...'
                : 'No se encontró prestatario'
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.name}</span>
                  <span className="text-xs text-gray-500">
                    DNI: {option.dni} · {option.code} ·{' '}
                    {option.type === 'STUDENT' ? 'Estudiante' : 'Profesor'}
                    {option.grade ? ` · ${option.grade}` : ''}
                  </span>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Prestatario (buscar por DNI o nombre)"
                placeholder="Ingrese DNI o nombre..."
                error={!!errors.borrower}
                helperText={errors.borrower}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {borrowersLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <Autocomplete
            options={availableCopies}
            getOptionLabel={(option) =>
              `${option.inventoryCode} — ${option.book?.title ?? ''}`
            }
            value={selectedCopy}
            onChange={(_e, value) => {
              setSelectedCopy(value)
              setErrors((prev) => ({ ...prev, copy: undefined }))
            }}
            onInputChange={(_e, value) => setBookSearch(value)}
            loading={copiesLoading}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            noOptionsText={
              bookSearch.length < 1
                ? 'Escriba el código o título para buscar...'
                : 'No se encontró ejemplar disponible'
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.book?.title}</span>
                  <span className="text-xs text-gray-500">
                    {option.inventoryCode} · Condición:{' '}
                    {option.condition}
                  </span>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ejemplar (buscar por código o título)"
                placeholder="Ingrese código o título..."
                error={!!errors.copy}
                helperText={errors.copy}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {copiesLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Procesando...' : 'Crear préstamo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
