import { useState } from 'react'
import { Link } from 'react-router-dom'

// Dữ liệu mẫu — sau này thay bằng fetch() gọi API thật từ Backend
const mockCourses = [
  {
    id: 1,
    title: 'Tiếng Anh giao tiếp cơ bản',
    language: 'Tiếng Anh',
    teacher: 'Nguyễn Thị Lan',
    level: 'Mới bắt đầu',
    lessons: 24,
    image: '🇬🇧',
  },
  {
    id: 2,
    title: 'Luyện thi IELTS 6.5+',
    language: 'Tiếng Anh',
    teacher: 'Trần Văn Minh',
    level: 'Trung cấp',
    lessons: 40,
    image: '🇬🇧',
  },
  {
    id: 3,
    title: 'Tiếng Nhật N5 cho người mới',
    language: 'Tiếng Nhật',
    teacher: 'Sato Yuki',
    level: 'Mới bắt đầu',
    lessons: 30,
    image: '🇯🇵',
  },
  {
    id: 4,
    title: 'Giao tiếp tiếng Hàn công sở',
    language: 'Tiếng Hàn',
    teacher: 'Kim Min-jun',
    level: 'Trung cấp',
    lessons: 20,
    image: '🇰🇷',
  },
  {
    id: 5,
    title: 'Tiếng Pháp cho người du lịch',
    language: 'Tiếng Pháp',
    teacher: 'Claire Dubois',
    level: 'Mới bắt đầu',
    lessons: 16,
    image: '🇫🇷',
  },
  {
    id: 6,
    title: 'Tiếng Anh thương mại nâng cao',
    language: 'Tiếng Anh',
    teacher: 'Nguyễn Thị Lan',
    level: 'Nâng cao',
    lessons: 28,
    image: '🇬🇧',
  },
]

const languages = ['Tất cả', 'Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hàn', 'Tiếng Pháp']

export default function Courses() {
  const [filter, setFilter] = useState('Tất cả')

  const filtered =
    filter === 'Tất cả'
      ? mockCourses
      : mockCourses.filter((c) => c.language === filter)

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">
        Khám phá khóa học
      </h1>
      <p className="text-[#0F172A]/60 mb-8">
        Chọn khóa học phù hợp với mục tiêu và trình độ của bạn.
      </p>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2 mb-10">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setFilter(lang)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === lang
                ? 'bg-[#1E4FD8] text-white'
                : 'bg-[#EAF1FF] text-[#0F172A]/70 hover:bg-[#dbe8ff]'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* COURSE GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-black/5 p-5 hover:shadow-lg transition flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EAF1FF] flex items-center justify-center text-2xl mb-4">
              {course.image}
            </div>
            <span className="text-xs font-semibold text-[#1E4FD8] mb-1">
              {course.language} · {course.level}
            </span>
            <h3 className="font-bold text-lg text-[#0F172A] mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-[#0F172A]/60 mb-4">
              Giáo viên: {course.teacher} · {course.lessons} bài học
            </p>
            <button className="mt-auto bg-[#1E4FD8] text-white text-sm font-bold py-2.5 rounded-full hover:bg-[#173FB0] transition">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#0F172A]/50 py-16">
          Chưa có khóa học nào cho ngôn ngữ này.
        </p>
      )}
    </div>
  )
}