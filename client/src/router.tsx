import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import LayoutAdmin from './components/layout/LayoutAdmin'
import LayoutAuthPage from './components/layout/LayoutAuthPage'
import LoadingPage from './components/commons/LoadingPage'

const LandingPage = lazy(() => import('./pages/landing/LandingPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const AuthorPage = lazy(() => import('./pages/authors/AuthorPage'))
const CategoryPage = lazy(() => import('./pages/categories/CategoryPage'))
const BookPage = lazy(() => import('./pages/books/BookPage'))
const BookCopyPage = lazy(() => import('./pages/book-copies/BookCopyPage'))
const BorrowerPage = lazy(() => import('./pages/borrowers/BorrowerPage'))
const LoanPage = lazy(() => import('./pages/loans/LoanPage'))
const PenaltyPage = lazy(() => import('./pages/penalties/PenaltyPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },
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
        path: 'authors',
        element: (
          <SuspenseWrapper>
            <AuthorPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'categories',
        element: (
          <SuspenseWrapper>
            <CategoryPage />
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
        path: 'book-copies',
        element: (
          <SuspenseWrapper>
            <BookCopyPage />
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
      {
        path: 'penalties',
        element: (
          <SuspenseWrapper>
            <PenaltyPage />
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
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },
])

export default router
