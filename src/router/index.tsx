import Dashboard from '@/views/dashboard/index'
import NotFound from '@/views/error/404'
import LoginPage from '@/views/login/index'
import { FC } from 'react'
import { useRoutes } from 'react-router-dom'
import { RouteObject } from './types'

// const NotFound = lazy(() => import('@/views/error/404'))
// const LoginPage = lazy(() => import('@/views/login/index'))
// const Dashboard = lazy(() => import('@/views/dashboard/index'))

const rootRouter: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/login',
    element: <LoginPage />,
    meta: {
      requiresAuth: false,
      title: '登录页',
      key: 'login'
    }
  },
  {
    path: '*',
    element: <NotFound />,
    meta: {
      requiresAuth: false,
      title: '404',
      key: '404'
    }
  }
]
const Router: FC = () => {
  const routes = useRoutes(rootRouter)
  return routes
}

export default Router
