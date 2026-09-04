import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isDashboard = ['/student', '/teacher', '/admin'].some((path) => pathname.startsWith(path))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}
