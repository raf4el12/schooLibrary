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
import { useCategories } from '../../hook/categories/useCategories'
import type { ReactNode } from 'react'

function StatCard({
  icon,
  color,
  label,
  value,
  sub,
}: {
  icon: ReactNode
  color: string
  label: string
  value: number
  sub?: string
}) {
  return (
    <Card variant="outlined">
      <CardContent className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function BarItem({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">
        {value}
      </span>
    </div>
  )
}

function DistributionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Card variant="outlined" className="h-full">
      <CardContent>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="flex flex-col gap-3">{children}</div>
      </CardContent>
    </Card>
  )
}

export default function DashboardMain() {
  const { data: books } = useBooks()
  const { data: borrowers } = useBorrowers()
  const { data: loans } = useLoans()
  const { data: copies } = useBookCopies()
  const { data: penalties } = usePenalties('false')
  const { data: categories } = useCategories()

  const activeLoans = loans?.filter((l) => l.status === 'ACTIVE') ?? []
  const overdueLoans = loans?.filter((l) => l.status === 'OVERDUE') ?? []
  const returnedLoans = loans?.filter((l) => l.status === 'RETURNED') ?? []

  const availableCopies =
    copies?.filter((c) => c.isAvailable).length ?? 0
  const suspendedBorrowers =
    borrowers?.filter((b) => !b.isActive).length ?? 0

  // Copy conditions
  const newCopies = copies?.filter((c) => c.condition === 'NEW').length ?? 0
  const goodCopies = copies?.filter((c) => c.condition === 'GOOD').length ?? 0
  const fairCopies = copies?.filter((c) => c.condition === 'FAIR').length ?? 0
  const damagedCopies =
    copies?.filter((c) => c.condition === 'DAMAGED').length ?? 0
  const maxCondition = Math.max(newCopies, goodCopies, fairCopies, damagedCopies, 1)

  // Borrower types
  const students =
    borrowers?.filter((b) => b.type === 'STUDENT').length ?? 0
  const teachers =
    borrowers?.filter((b) => b.type === 'TEACHER').length ?? 0
  const maxBorrowerType = Math.max(students, teachers, 1)

  // Loan statuses
  const maxLoanStatus = Math.max(
    activeLoans.length,
    returnedLoans.length,
    overdueLoans.length,
    1,
  )

  // Top 5 categories by book count
  const topCategories = (categories ?? [])
    .filter((c) => (c._count?.books ?? 0) > 0)
    .sort((a, b) => (b._count?.books ?? 0) - (a._count?.books ?? 0))
    .slice(0, 5)
  const maxCatBooks = topCategories.length > 0
    ? (topCategories[0]._count?.books ?? 1)
    : 1

  // Overdue loans sorted by most days overdue
  const overdueSorted = [...overdueLoans].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  const stats = [
    {
      label: 'Libros',
      value: books?.length ?? 0,
      icon: (
        <LibraryBooksIcon sx={{ fontSize: 32 }} className="text-blue-600" />
      ),
      color: 'bg-blue-50',
      sub: `${books?.reduce((s, b) => s + (b._count?.copies ?? 0), 0) ?? 0} ejemplares totales`,
    },
    {
      label: 'Ejemplares',
      value: copies?.length ?? 0,
      icon: (
        <ContentCopyIcon sx={{ fontSize: 32 }} className="text-indigo-600" />
      ),
      color: 'bg-indigo-50',
      sub: `${availableCopies} disponibles`,
    },
    {
      label: 'Prestatarios',
      value: borrowers?.length ?? 0,
      icon: <GroupIcon sx={{ fontSize: 32 }} className="text-green-600" />,
      color: 'bg-green-50',
      sub: suspendedBorrowers > 0
        ? `${suspendedBorrowers} suspendidos`
        : 'Todos activos',
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

  const categoryColors = [
    'bg-blue-500',
    'bg-blue-400',
    'bg-blue-300',
    'bg-sky-400',
    'bg-sky-300',
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Distribution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <DistributionCard title="Préstamos por estado">
          <BarItem
            label="Activos"
            value={activeLoans.length}
            max={maxLoanStatus}
            color="bg-amber-400"
          />
          <BarItem
            label="Devueltos"
            value={returnedLoans.length}
            max={maxLoanStatus}
            color="bg-green-400"
          />
          <BarItem
            label="Vencidos"
            value={overdueLoans.length}
            max={maxLoanStatus}
            color="bg-red-400"
          />
        </DistributionCard>

        <DistributionCard title="Ejemplares por condición">
          <BarItem label="Nuevo" value={newCopies} max={maxCondition} color="bg-green-400" />
          <BarItem label="Bueno" value={goodCopies} max={maxCondition} color="bg-blue-400" />
          <BarItem label="Regular" value={fairCopies} max={maxCondition} color="bg-amber-400" />
          <BarItem label="Dañado" value={damagedCopies} max={maxCondition} color="bg-red-400" />
        </DistributionCard>

        <DistributionCard title="Prestatarios por tipo">
          <BarItem
            label="Estudiantes"
            value={students}
            max={maxBorrowerType}
            color="bg-blue-400"
          />
          <BarItem
            label="Docentes"
            value={teachers}
            max={maxBorrowerType}
            color="bg-purple-400"
          />
        </DistributionCard>

        <DistributionCard title="Libros por categoría (Top 5)">
          {topCategories.length === 0 && (
            <p className="text-sm text-gray-400">Sin datos</p>
          )}
          {topCategories.map((cat, i) => (
            <BarItem
              key={cat.id}
              label={cat.name}
              value={cat._count?.books ?? 0}
              max={maxCatBooks}
              color={categoryColors[i] ?? 'bg-blue-300'}
            />
          ))}
        </DistributionCard>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Active loans */}
        <div>
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
                    <th className="text-left px-4 py-3">Vence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeLoans.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        Sin préstamos activos
                      </td>
                    </tr>
                  )}
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
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Overdue loans */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Préstamos vencidos
          </h2>
          <Card variant="outlined">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Código</th>
                    <th className="text-left px-4 py-3">Prestatario</th>
                    <th className="text-left px-4 py-3">Venció</th>
                    <th className="text-left px-4 py-3">Días</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {overdueSorted.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        Sin préstamos vencidos
                      </td>
                    </tr>
                  )}
                  {overdueSorted.slice(0, 5).map((loan) => {
                    const daysOverdue = Math.floor(
                      (Date.now() - new Date(loan.dueDate).getTime()) /
                        86_400_000,
                    )
                    return (
                      <tr key={loan.id}>
                        <td className="px-4 py-3 font-mono">
                          {loan.bookCopy?.inventoryCode ?? '—'}
                        </td>
                        <td className="px-4 py-3">{loan.borrower?.name}</td>
                        <td className="px-4 py-3">
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-red-600 font-medium">
                            +{daysOverdue}d
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
