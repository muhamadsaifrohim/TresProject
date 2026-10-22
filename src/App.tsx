import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './hooks/useAuth'

// Import halaman
import Home from './pages/Home'
import Lost from './pages/Lost'
import Found from './pages/Found'
import Login from './pages/Login'
import Report from './pages/Report'
import History from './pages/History' // Biarkan History tetap ada

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="lost" element={<Lost />} />
            <Route path="found" element={<Found />} />
            <Route path="history" element={<History />} /> {/* Route History */}
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