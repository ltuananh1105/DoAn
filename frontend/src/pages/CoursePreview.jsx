import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function CoursePreview() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [lessonsByChapter, setLessonsByChapter] = useState({})
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then(setCourse)

    fetch(`http://localhost:8080/api/courses/${courseId}/chapters`)
      .then((res) => res.json())
      .then(async (chs) => {
        setChapters(chs)
        const entries = await Promise.all(
          chs.map((ch) =>
            fetch(`http://localhost:8080/api/chapters/${ch.id}/lessons`)
              .then((res) => res.json())
              .then((lessons) => [ch.id, lessons])
          )
        )
        setLessonsByChapter(Object.fromEntries(entries))
      })

    if (user?.role === 'student') {
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then((data) => setIsEnrolled(data.some((e) => e.course.id === Number(courseId))))
    }
  }, [courseId, user])

  const totalLessons = Object.values(lessonsByChapter).reduce((sum, l) => sum + l.length, 0)

  const handleEnroll = async () => {
    setEnrolling(true)
    await fetch(`http://localhost:8080/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user.id })
    })
    setIsEnrolled(true)
    setEnrolling(false)
  }

  if (!course) return <div className="max-w-4xl mx-auto px-6 py-14 text-gray-400">Đang tải...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <Link to="/courses" className="text-sm text-blue-600 mb-4 inline-block">← Quay lại danh sách khóa học</Link>

      <span className="text-xs font-semibold text-[#1E4FD8]">
        {course.category?.name || 'Chưa phân loại'}
      </span>
      <h1 className="text-3xl font-extrabold text-[#0F172A] mt-1 mb-3">{course.title}</h1>
      <p className="text-[#0F172A]/70 mb-4">{course.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
        <span>Giáo viên: <strong className="text-[#0F172A]">{course.teacher?.name}</strong></span>
        <span>·</span>
        <span>{chapters.length} chương · {totalLessons} bài học</span>
      </div>

      {/* NÚT HÀNH ĐỘNG */}
      <div className="mb-10">
        {!user && (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1E4FD8] text-white font-bold px-8 py-3 rounded-full hover:bg-[#173FB0] transition"
          >
            Đăng nhập để đăng ký
          </button>
        )}

        {user?.role === 'student' && !isEnrolled && (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-[#1E4FD8] text-white font-bold px-8 py-3 rounded-full hover:bg-[#173FB0] transition disabled:opacity-60"
          >
            {enrolling ? 'Đang đăng ký...' : `Đăng ký học · ${course.price?.toLocaleString('vi-VN')} đ`}
          </button>
        )}

        {user?.role === 'student' && isEnrolled && (
          <Link
            to={`/student/courses/${courseId}`}
            className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition"
          >
            Vào học ngay ✓
          </Link>
        )}
      </div>

      {/* DANH SÁCH CHƯƠNG - CHỈ HIỆN TIÊU ĐỀ, KHÔNG LỘ VIDEO */}
      <h2 className="font-bold text-lg mb-4">Nội dung khóa học</h2>

      {chapters.map((ch) => (
        <div key={ch.id} className="mb-4 border rounded-xl p-4">
          <h3 className="font-semibold text-[#0F172A] mb-2">{ch.title}</h3>
          <ul className="space-y-1">
            {(lessonsByChapter[ch.id] || []).map((lesson, idx) => (
              <li key={lesson.id} className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF1FF] text-[#1E4FD8] text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {lesson.title}
              </li>
            ))}
            {(lessonsByChapter[ch.id] || []).length === 0 && (
              <li className="text-sm text-gray-400">Chưa có bài học nào.</li>
            )}
          </ul>
        </div>
      ))}

      {chapters.length === 0 && (
        <p className="text-gray-400 text-sm">Khóa học chưa có nội dung chi tiết.</p>
      )}
    </div>
  )
}