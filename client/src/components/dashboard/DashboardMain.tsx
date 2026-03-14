import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GavelIcon from '@mui/icons-material/Gavel'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useBooks } from '../../hook/books/useBooks'
import { useBorrowers } from '../../hook/borrowers/useBorrowers'
import { useLoans } from '../../hook/loans/useLoans'
import { useBookCopies } from '../../hook/book-copies/useBookCopies'
import { usePenalties } from '../../hook/penalties/usePenalties'
import { useCategories } from '../../hook/categories/useCategories'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  accent,
}: {
  icon: ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: number
  sub?: string
  accent?: string
}) {
  return (
    <div
      className="card-hover rounded-2xl p-5 flex items-start justify-between"
      style={{
        background: '#fff',
        border: '1px solid var(--clr-border)',
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-400">
          {label}
        </span>
        <span
          className="stat-value text-3xl"
          style={{ color: accent ?? 'var(--clr-text)' }}
        >
          {value}
        </span>
        {sub && (
          <span className="text-[12px] text-slate-400 mt-0.5">{sub}</span>
        )}
      </div>
      <div
        className="flex items-center justify-center shrink-0 rounded-xl"
        style={{
          width: 44,
          height: 44,
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
    </div>
  )
}

function ProgressBar({
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
      <span className="text-[12px] font-medium text-slate-500 w-24 shrink-0 truncate">
        {label}
      </span>
      <div
        className="flex-1 rounded-full h-2 overflow-hidden"
        style={{ background: '#f1eeea' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[12px] font-bold text-slate-600 w-7 text-right tabular-nums">
        {value}
      </span>
    </div>
  )
}

function SectionCard({
  title,
  children,
  icon,
}: {
  title: string
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{
        background: '#fff',
        border: '1px solid var(--clr-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <span className="text-slate-300">{icon}</span>
        )}
        <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

export default function DashboardMain() {
  const { data: books } = useBooks()
  const { data: borrowers } = useBorrowers()
  const { data: loans } = useLoans()
  const { data: copies } = useBookCopies()
  const { data: penalties } = usePenalties('false')
  const { data: categories } = useCategories()

  const computed = useMemo(() => {
    const activeLoans = loans?.filter((l) => l.status === 'ACTIVE') ?? []
    const overdueLoans = loans?.filter((l) => l.status === 'OVERDUE') ?? []
    const returnedLoans = loans?.filter((l) => l.status === 'RETURNED') ?? []
    const availableCopies = copies?.filter((c) => c.isAvailable).length ?? 0
    const suspendedBorrowers = borrowers?.filter((b) => !b.isActive).length ?? 0

    const newCopies = copies?.filter((c) => c.condition === 'NEW').length ?? 0
    const goodCopies = copies?.filter((c) => c.condition === 'GOOD').length ?? 0
    const fairCopies = copies?.filter((c) => c.condition === 'FAIR').length ?? 0
    const damagedCopies = copies?.filter((c) => c.condition === 'DAMAGED').length ?? 0
    const maxCondition = Math.max(newCopies, goodCopies, fairCopies, damagedCopies, 1)

    const students = borrowers?.filter((b) => b.type === 'STUDENT').length ?? 0
    const teachers = borrowers?.filter((b) => b.type === 'TEACHER').length ?? 0
    const maxBorrowerType = Math.max(students, teachers, 1)

    const maxLoanStatus = Math.max(activeLoans.length, returnedLoans.length, overdueLoans.length, 1)

    const topCategories = (categories ?? [])
      .filter((c) => (c._count?.books ?? 0) > 0)
      .sort((a, b) => (b._count?.books ?? 0) - (a._count?.books ?? 0))
      .slice(0, 5)
    const maxCatBooks = topCategories.length > 0 ? (topCategories[0]._count?.books ?? 1) : 1

    const overdueSorted = [...overdueLoans].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )

    return {
      activeLoans, overdueLoans, returnedLoans,
      availableCopies, suspendedBorrowers,
      newCopies, goodCopies, fairCopies, damagedCopies, maxCondition,
      students, teachers, maxBorrowerType,
      maxLoanStatus,
      topCategories, maxCatBooks,
      overdueSorted,
    }
  }, [books, borrowers, loans, copies, penalties, categories])

  const now = useMemo(() => Date.now(), [])

  const stats = [
    {
      label: 'Libros',
      value: books?.length ?? 0,
      icon: <LibraryBooksIcon sx={{ fontSize: 24 }} />,
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
      sub: `${books?.reduce((s, b) => s + (b._count?.copies ?? 0), 0) ?? 0} ejemplares totales`,
    },
    {
      label: 'Ejemplares',
      value: copies?.length ?? 0,
      icon: <ContentCopyIcon sx={{ fontSize: 24 }} />,
      iconBg: '#f0fdfa',
      iconColor: '#0d9488',
      sub: `${computed.availableCopies} disponibles`,
    },
    {
      label: 'Prestatarios',
      value: borrowers?.length ?? 0,
      icon: <GroupIcon sx={{ fontSize: 24 }} />,
      iconBg: '#f0fdf4',
      iconColor: '#059669',
      sub: computed.suspendedBorrowers > 0
        ? `${computed.suspendedBorrowers} suspendidos`
        : 'Todos activos',
    },
    {
      label: 'Préstamos activos',
      value: computed.activeLoans.length,
      icon: <SwapHorizIcon sx={{ fontSize: 24 }} />,
      iconBg: '#fffbeb',
      iconColor: '#d97706',
    },
    {
      label: 'Vencidos',
      value: computed.overdueLoans.length,
      icon: <WarningAmberIcon sx={{ fontSize: 24 }} />,
      iconBg: '#fef2f2',
      iconColor: '#e11d48',
      accent: computed.overdueLoans.length > 0 ? '#e11d48' : undefined,
    },
    {
      label: 'Penalidades',
      value: penalties?.length ?? 0,
      icon: <GavelIcon sx={{ fontSize: 24 }} />,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
    },
  ]

  const categoryColors = ['#3b82f6', '#0d9488', '#8b5cf6', '#f59e0b', '#ec4899']

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="page-title text-3xl">Dashboard</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Resumen general de la biblioteca
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
          style={{ background: '#f0fdfa', color: '#0d9488' }}
        >
          <TrendingUpIcon sx={{ fontSize: 16 }} />
          {computed.activeLoans.length} préstamos en curso
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Distribution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <SectionCard title="Préstamos por estado">
          <div className="flex flex-col gap-3">
            <ProgressBar label="Activos" value={computed.activeLoans.length} max={computed.maxLoanStatus} color="#f59e0b" />
            <ProgressBar label="Devueltos" value={computed.returnedLoans.length} max={computed.maxLoanStatus} color="#059669" />
            <ProgressBar label="Vencidos" value={computed.overdueLoans.length} max={computed.maxLoanStatus} color="#e11d48" />
          </div>
        </SectionCard>

        <SectionCard title="Ejemplares por condición">
          <div className="flex flex-col gap-3">
            <ProgressBar label="Nuevo" value={computed.newCopies} max={computed.maxCondition} color="#059669" />
            <ProgressBar label="Bueno" value={computed.goodCopies} max={computed.maxCondition} color="#0284c7" />
            <ProgressBar label="Regular" value={computed.fairCopies} max={computed.maxCondition} color="#f59e0b" />
            <ProgressBar label="Dañado" value={computed.damagedCopies} max={computed.maxCondition} color="#e11d48" />
          </div>
        </SectionCard>

        <SectionCard title="Prestatarios por tipo">
          <div className="flex flex-col gap-3">
            <ProgressBar label="Estudiantes" value={computed.students} max={computed.maxBorrowerType} color="#3b82f6" />
            <ProgressBar label="Docentes" value={computed.teachers} max={computed.maxBorrowerType} color="#8b5cf6" />
          </div>
        </SectionCard>

        <SectionCard title="Libros por categoría">
          <div className="flex flex-col gap-3">
            {computed.topCategories.length === 0 && (
              <p className="text-[12px] text-slate-400">Sin datos</p>
            )}
            {computed.topCategories.map((cat, i) => (
              <ProgressBar
                key={cat.id}
                label={cat.name}
                value={cat._count?.books ?? 0}
                max={computed.maxCatBooks}
                color={categoryColors[i] ?? '#94a3b8'}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Active loans */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#fff',
            border: '1px solid var(--clr-border)',
          }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--clr-border)' }}>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-400">
              Préstamos activos recientes
            </h3>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Código</th>
                <th className="text-left">Libro</th>
                <th className="text-left">Prestatario</th>
                <th className="text-left">Vence</th>
              </tr>
            </thead>
            <tbody>
              {computed.activeLoans.length === 0 && (
                <tr>
                  <td colSpan={4} className="!py-8 text-center text-slate-400 text-[13px]">
                    Sin préstamos activos
                  </td>
                </tr>
              )}
              {computed.activeLoans.slice(0, 5).map((loan) => (
                <tr key={loan.id}>
                  <td className="font-mono text-[12px] font-semibold text-slate-500">
                    {loan.bookCopy?.inventoryCode ?? '—'}
                  </td>
                  <td className="font-medium">{loan.bookCopy?.book?.title ?? '—'}</td>
                  <td className="text-slate-500">{loan.borrower?.name}</td>
                  <td className="tabular-nums text-slate-500">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overdue loans */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#fff',
            border: '1px solid var(--clr-border)',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--clr-border)' }}
          >
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-400">
              Préstamos vencidos
            </h3>
            {computed.overdueLoans.length > 0 && (
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                style={{ background: '#fef2f2', color: '#e11d48' }}
              >
                {computed.overdueLoans.length} pendientes
              </span>
            )}
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left">Código</th>
                <th className="text-left">Prestatario</th>
                <th className="text-left">Venció</th>
                <th className="text-left">Días</th>
              </tr>
            </thead>
            <tbody>
              {computed.overdueSorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="!py-8 text-center text-slate-400 text-[13px]">
                    Sin préstamos vencidos
                  </td>
                </tr>
              )}
              {computed.overdueSorted.slice(0, 5).map((loan) => {
                const daysOverdue = Math.floor(
                  (now - new Date(loan.dueDate).getTime()) / 86_400_000,
                )
                return (
                  <tr key={loan.id}>
                    <td className="font-mono text-[12px] font-semibold text-slate-500">
                      {loan.bookCopy?.inventoryCode ?? '—'}
                    </td>
                    <td className="font-medium">{loan.borrower?.name}</td>
                    <td className="tabular-nums text-slate-500">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className="text-[12px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: '#fef2f2', color: '#e11d48' }}
                      >
                        +{daysOverdue}d
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
