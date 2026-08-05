import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function TeacherCourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [lessonsByChapter, setLessonsByChapter] = useState({})

  const [chapterTitle, setChapterTitle] = useState('')
  const [lessonForms, setLessonForms] = useState({}) // { [chapterId]: { title, videoUrl } }
  const [message, setMessage] = useState('')

  const loadAll = () => {
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
  }

  useEffect(() => {
    loadAll()
  }, [courseId])

  const handleAddChapter = async (e) => {
    e.preventDefault()
    if (!chapterTitle.trim()) return

    const res = await fetch(`http://localhost:8080/api/courses/${courseId}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: chapterTitle })
    })

    if (res.ok) {
      setChapterTitle('')
      setMessage('Đã thêm chương mới.')
      loadAll()
    } else {
      setMessage('Có lỗi khi thêm chương.')
    }
  }

  const handleLessonFormChange = (chapterId, field, value) => {
    setLessonForms((f) => ({
      ...f,
      [chapterId]: { ...f[chapterId], [field]: value }
    }))
  }

  const handleAddLesson = async (chapterId) => {
    const formData = lessonForms[chapterId]
    if (!formData?.title?.trim()) return

    const res = await fetch(`http://localhost:8080/api/chapters/${chapterId}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        videoUrl: formData.videoUrl || ''
      })
    })

    if (res.ok) {
      setLessonForms((f) => ({ ...f, [chapterId]: { title: '', videoUrl: '' } }))
      loadAll()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link to="/teacher" className="text-sm text-blue-600 mb-4 inline-block">← Quay lại khóa học của tôi</Link>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-1">{course?.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{course?.description}</p>

      {/* FORM THÊM CHƯƠNG */}
      <div className="bg-white border rounded-xl p-5 mb-8">
        <h2 className="font-bold text-lg mb-3">Thêm chương mới</h2>
        <form onSubmit={handleAddChapter} className="flex gap-3">
          <input
            type="text"
            placeholder="Tên chương (VD: Chương 1: Giới thiệu)"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button type="submit" className="bg-[#1E4FD8] text-white px-5 py-2 rounded font-semibold">
            Thêm chương
          </button>
        </form>
        {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
      </div>

      <h2 className="font-bold text-lg mb-4">Danh sách chương & bài học</h2>

      {chapters.map((ch) => (
        <div key={ch.id} className="mb-8 border rounded-xl p-5">
          <h3 className="font-semibold text-[#0F172A] mb-3">{ch.title}</h3>

          {/* DANH SÁCH LESSON */}
          <div className="space-y-2 mb-4">
            {(lessonsByChapter[ch.id] || []).map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center gap-4 border rounded-lg p-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAF1FF] text-[#1E4FD8] font-bold flex items-center justify-center text-sm">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#0F172A]">{lesson.title}</div>
                  <div className="text-xs text-gray-400 truncate">{lesson.videoUrl}</div>
                </div>
              </div>
            ))}
            {(lessonsByChapter[ch.id] || []).length === 0 && (
              <p className="text-sm text-gray-400">Chưa có bài học nào trong chương này.</p>
            )}
          </div>

          {/* FORM THÊM LESSON */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Thêm bài học vào chương này</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Tên bài học"
                value={lessonForms[ch.id]?.title || ''}
                onChange={(e) => handleLessonFormChange(ch.id, 'title', e.target.value)}
                className="flex-1 border px-3 py-2 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Link video (YouTube...)"
                value={lessonForms[ch.id]?.videoUrl || ''}
                onChange={(e) => handleLessonFormChange(ch.id, 'videoUrl', e.target.value)}
                className="flex-1 border px-3 py-2 rounded text-sm"
              />
              <button
                onClick={() => handleAddLesson(ch.id)}
                className="bg-[#1E4FD8] text-white px-4 py-2 rounded text-sm font-semibold whitespace-nowrap"
              >
                Thêm bài học
              </button>
            </div>
          </div>
        </div>
      ))}

      {chapters.length === 0 && (
        <p className="text-gray-400 text-sm">Chưa có chương nào. Thêm chương ở form phía trên.</p>
      )}
    </div>
  )
}