import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-white">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}