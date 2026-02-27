import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import WarningIcon from '@mui/icons-material/Warning'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GavelIcon from '@mui/icons-material/Gavel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useBooks } from '../../hook/books/useBooks'
import { useBorrowers } from '../../hook/borrowers/useBorrowers'
import { useLoans } from '../../hook/loans/useLoans'
import { useBookCopies } from '../../hook/book-copies/useBookCopies'
import { usePenalties } from '../../hook/penalties/usePenalties'

export default function DashboardMain() {
  const { data: books } = useBooks()
  const { data: borrowers } = useBorrowers()
  const { data: loans } = useLoans()
  const { data: copies } = useBookCopies()
  const { data: penalties } = usePenalties('false')

  const activeLoans = loans?.filter((l) => l.status === 'ACTIVE') ?? []
  const overdueLoans = loans?.filter((l) => l.status === 'OVERDUE') ?? []

  const stats = [
    {
      label: 'Libros',
      value: books?.length ?? 0,
      icon: <LibraryBooksIcon sx={{ fontSize: 32 }} className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Ejemplares',
      value: copies?.length ?? 0,
      icon: <ContentCopyIcon sx={{ fontSize: 32 }} className="text-indigo-600" />,
      color: 'bg-indigo-50',
    },
    {
      label: 'Prestatarios',
      value: borrowers?.length ?? 0,
      icon: <GroupIcon sx={{ fontSize: 32 }} className="text-green-600" />,
      color: 'bg-green-50',
    },
    {
      label: 'Préstamos activos',
      value: activeLoans.length,
      icon: <SwapHorizIcon sx={{ fontSize: 32 }} className="text-amber-600" />,
      color: 'bg-amber-50',
    },
    {
      label: 'Vencidos',
      value: overdueLoans.length,
      icon: <WarningIcon sx={{ fontSize: 32 }} className="text-red-600" />,
      color: 'bg-red-50',
    },
    {
      label: 'Penalidades pendientes',
      value: penalties?.length ?? 0,
      icon: <GavelIcon sx={{ fontSize: 32 }} className="text-orange-600" />,
      color: 'bg-orange-50',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="outlined">
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeLoans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Préstamos activos recientes
          </h2>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeLoans.slice(0, 5).map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-4 py-3 font-mono">
                        {loan.bookCopy?.inventoryCode ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        {loan.bookCopy?.book?.title ?? '—'}
                      </td>
                      <td className="px-4 py-3">{loan.borrower?.name}</td>
                      <td className="px-4 py-3">
                        {new Date(loan.borrowedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
