import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Student from './pages/Student.jsx'
import Teacher from './pages/Teacher.jsx'
import Courses from './pages/Courses.jsx'

function About() {
  return <h1 className="text-3xl font-bold text-blue-600 p-6">Giới thiệu</h1>
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/courses" element={<Courses />} />
      </Route>
    </Routes>
  )
}

export default App