import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import LayoutAdmin from './components/layout/LayoutAdmin'
import LayoutAuthPage from './components/layout/LayoutAuthPage'
import LoadingPage from './components/commons/LoadingPage'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const BookPage = lazy(() => import('./pages/books/BookPage'))
const BorrowerPage = lazy(() => import('./pages/borrowers/BorrowerPage'))
const LoanPage = lazy(() => import('./pages/loans/LoanPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: 'admin',
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'books',
        element: (
          <SuspenseWrapper>
            <BookPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'borrowers',
        element: (
          <SuspenseWrapper>
            <BorrowerPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'loans',
        element: (
          <SuspenseWrapper>
            <LoanPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: 'auth',
    element: <LayoutAuthPage />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <LayoutAuthPage />,
    children: [
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
])

export default router
