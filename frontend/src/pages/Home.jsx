import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Lộ trình cá nhân hóa',
    desc: 'Kiểm tra trình độ đầu vào và xây dựng lộ trình học tiếng Anh riêng cho bạn.',
    bg: 'bg-[#EAF1FF]',
  },
  {
    icon: '🗣️',
    title: 'Giáo viên bản ngữ & Việt Nam',
    desc: 'Học trực tiếp với giáo viên giàu kinh nghiệm, sửa phát âm theo thời gian thực.',
    bg: 'bg-[#FFF6E0]',
  },
  {
    icon: '⚡',
    title: 'Luyện tập tương tác',
    desc: 'Bài hội thoại, flashcard từ vựng, bài kiểm tra mô phỏng thi thật (IELTS, TOEIC...).',
    bg: 'bg-[#E9FBEF]',
  },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2F87] to-[#3B82F6] px-6 py-24 text-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-white/10" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-white/10" />
        </div>

        <div className="absolute top-16 right-[18%] w-10 h-10 rounded-full bg-[#FDBA2C] flex items-center justify-center text-lg shadow-lg">
          😊
        </div>
        <div className="absolute bottom-24 left-[15%] w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-2xl">
          🇬🇧
        </div>

        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Nền tảng học
            <br />
            Tiếng Anh <span className="text-[#FDBA2C]">thông minh</span>
          </h1>
          <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
            LearnUp kết nối bạn với giáo viên thật, lộ trình rõ ràng, và công cụ luyện tập
            giúp bạn tiến bộ tiếng Anh mỗi ngày.
          </p>

          <div className="flex justify-center">
            <Link
              to="/courses"
              className="bg-white text-[#1E4FD8] font-bold px-10 py-3.5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-4 text-[#0F172A]">
          Học tiếng Anh đúng cách
        </h2>
        <p className="text-center text-[#0F172A]/60 mb-14 max-w-lg mx-auto">
          Mọi công cụ bạn cần để chinh phục tiếng Anh, gói gọn trong một nền tảng.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/5 p-6 hover:shadow-lg transition">
              <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#0F172A]">{f.title}</h3>
              <p className="text-[#0F172A]/65 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}