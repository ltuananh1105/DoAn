import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [lessonsByChapter, setLessonsByChapter] = useState({})

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
  }, [courseId])

  let lessonCounter = 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/student" className="text-sm text-blue-600 mb-4 inline-block">← Quay lại khóa học của tôi</Link>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{course?.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{course?.description}</p>

      <h2 className="font-bold text-lg mb-4">Danh sách bài học</h2>

      {chapters.map((ch) => (
        <div key={ch.id} className="mb-6">
          <h3 className="font-semibold text-[#0F172A] mb-2">{ch.title}</h3>

          <div className="space-y-2">
            {(lessonsByChapter[ch.id] || []).map((lesson) => {
              lessonCounter++
              const num = String(lessonCounter).padStart(2, '0')

              return (
                <a key={lesson.id} href={lesson.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 border rounded-xl p-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-lg bg-[#EAF1FF] text-[#1E4FD8] font-bold flex items-center justify-center">{num}</div>
                  <div>
                    <div className="font-semibold text-[#0F172A]">{lesson.title}</div>
                    <div className="text-xs text-gray-400">Bấm để xem video</div>
                  </div>
                </a>
              )
            })}

            {(lessonsByChapter[ch.id] || []).length === 0 && (
              <p className="text-sm text-gray-400 pl-2">Chưa có bài học nào.</p>
            )}
          </div>
        </div>
      ))}

      {chapters.length === 0 && (
        <p className="text-gray-400 text-sm">Khóa học chưa có chương nào.</p>
      )}
    </div>
  )
}