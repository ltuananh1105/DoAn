import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolledIds, setEnrolledIds] = useState([])

  const loadCourses = () => {
    fetch('http://localhost:8080/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.filter((c) => c.status === 'approved'))
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCourses()
    if (user?.role === 'student') {
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then((data) => setEnrolledIds(data.map((e) => e.course.id)))
    }
  }, [user])

  const handleEnroll = async (courseId) => {
    await fetch(`http://localhost:8080/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user.id })
    })
    setEnrolledIds((ids) => [...ids, courseId])
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Khám phá khóa học</h1>
      <p className="text-[#0F172A]/60 mb-8">Chọn khóa học phù hợp với mục tiêu và trình độ của bạn.</p>

      {loading && <p className="text-[#0F172A]/50">Đang tải khóa học...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id)
          return (
            <div key={course.id} className="rounded-2xl border border-black/5 p-5 hover:shadow-lg transition flex flex-col">
              <span className="text-xs font-semibold text-[#1E4FD8] mb-1">
                {course.category?.name || 'Chưa phân loại'}
              </span>
              <Link to={`/courses/${course.id}`} className="font-bold text-lg text-[#0F172A] mb-2 hover:text-[#1E4FD8] transition">
                {course.title}
              </Link>
              <p className="text-sm text-[#0F172A]/60 mb-4">{course.description}</p>
              <p className="text-sm font-semibold text-[#0F172A] mb-4">
                {course.price?.toLocaleString('vi-VN')} đ
              </p>

              {!user && (
                <button disabled className="mt-auto bg-gray-200 text-gray-500 text-sm font-bold py-2.5 rounded-full">
                  Đăng nhập để đăng ký
                </button>
              )}
              {user?.role === 'student' && (
                <button
                  onClick={() => !isEnrolled && handleEnroll(course.id)}
                  disabled={isEnrolled}
                  className={`mt-auto text-sm font-bold py-2.5 rounded-full transition ${
                    isEnrolled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#1E4FD8] text-white hover:bg-[#173FB0]'
                  }`}
                >
                  {isEnrolled ? 'Đã đăng ký ✓' : 'Đăng ký học'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {!loading && courses.length === 0 && (
        <p className="text-center text-[#0F172A]/50 py-16">Chưa có khóa học nào được duyệt.</p>
      )}
    </div>
  )
}