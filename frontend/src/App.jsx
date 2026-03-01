import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import IssuesPage from './pages/IssuesPage'
import IssuePage from './pages/IssuePage'
import WorkspacePage from './pages/WorkspacePage'
import ProtectedRoute from './components/ProtectedRoute'
import WorkspaceRoute from './components/WorkspaceRoute'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/issues' />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/workspace'
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/issues'
          element={
            <ProtectedRoute>
              <WorkspaceRoute>
                <Layout>
                  <IssuesPage />
                </Layout>
              </WorkspaceRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path='/issues/:id'
          element={
            <ProtectedRoute>
              <WorkspaceRoute>
                <Layout>
                  <IssuePage />
                </Layout>
              </WorkspaceRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App