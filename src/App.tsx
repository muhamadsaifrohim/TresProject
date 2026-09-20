import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Found from './pages/Found'
import Home from './pages/Home'
import Lost from './pages/Lost'
import Report from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lost" element={<Lost />} />
          <Route path="found" element={<Found />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}