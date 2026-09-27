import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './hooks/useAuth'
import Found from './pages/Found'
import Home from './pages/Home'
import Login from './pages/Login'
import Lost from './pages/Lost'
import Report from './pages/Report'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="lost" element={<Lost />} />
            <Route path="found" element={<Found />} />
            <Route path="login" element={<Login />} />
            <Route
              path="report"
              element={
                <RequireAuth>
                  <Report />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}