import { Link } from 'react-router-dom';

const principles = [
  ['Rõ ràng', 'Nội dung, học phí, trạng thái khóa học và tiến độ học tập cần được trình bày minh bạch.'],
  ['Có trách nhiệm', 'Giáo viên chịu trách nhiệm về nội dung; quản trị viên kiểm tra trước khi khóa học được phát hành.'],
  ['Lấy người học làm trung tâm', 'Mọi luồng thao tác được xây dựng để người học dễ tìm, dễ tiếp tục và dễ xem lại kết quả.'],
  ['Cải tiến liên tục', 'Dữ liệu tiến độ và phản hồi giúp giáo viên điều chỉnh khóa học theo nhu cầu thực tế.'],
];

const roles = [
  { title: 'Học viên', items: ['Khám phá và đăng ký khóa học', 'Học theo chương và bài học', 'Làm bài kiểm tra theo thời gian', 'Theo dõi tiến độ và kết quả'] },
  { title: 'Giáo viên', items: ['Xây dựng nội dung khóa học', 'Quản lý chương, bài học và quiz', 'Gửi khóa học qua quy trình duyệt', 'Theo dõi học viên và doanh thu'] },
  { title: 'Quản trị viên', items: ['Kiểm duyệt chất lượng khóa học', 'Quản lý học viên và giáo viên', 'Quản lý danh mục đào tạo', 'Theo dõi báo cáo toàn hệ thống'] },
];

export default function About() {
  return <div className="bg-white">
    <section className="border-b border-slate-200 bg-slate-50"><div className="app-container py-16 sm:py-20"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Về LearnUp</p><h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Học tập hiệu quả bắt đầu từ một hệ thống rõ ràng.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">LearnUp là nền tảng quản lý học tiếng Anh trực tuyến kết nối học viên, giáo viên và quản trị viên. Chúng tôi hướng đến một trải nghiệm học tập có cấu trúc, dễ theo dõi và minh bạch từ nội dung đến kết quả.</p></div></div></section>

    <section className="app-container page-section"><div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Câu chuyện của chúng tôi</p><h2 className="page-heading mt-3">Thu hẹp khoảng cách giữa nội dung và quá trình học</h2></div><div className="space-y-4 text-sm leading-7 text-slate-600"><p>Người học trực tuyến thường gặp hai vấn đề: có quá nhiều tài liệu nhưng thiếu một lộ trình nhất quán, hoặc đã tham gia khóa học nhưng khó biết mình đang tiến bộ đến đâu.</p><p>LearnUp được xây dựng để giải quyết khoảng trống đó. Giáo viên có công cụ tổ chức nội dung; học viên có một nơi để học và theo dõi kết quả; quản trị viên có quy trình kiểm duyệt và báo cáo để bảo đảm hệ thống vận hành nhất quán.</p></div></div></section>

    <section className="border-y border-slate-200 bg-slate-50"><div className="app-container page-section"><div className="grid gap-5 md:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-7"><p className="text-sm font-semibold text-blue-700">SỨ MỆNH</p><h2 className="mt-3 text-xl font-bold text-slate-900">Giúp việc học tiếng Anh dễ quản lý hơn</h2><p className="mt-3 text-sm leading-7 text-slate-600">Cung cấp một nền tảng nơi nội dung chất lượng, tiến độ học tập và hoạt động giảng dạy được kết nối trong cùng một quy trình.</p></div><div className="rounded-xl border border-slate-200 bg-white p-7"><p className="text-sm font-semibold text-blue-700">ĐỊNH HƯỚNG</p><h2 className="mt-3 text-xl font-bold text-slate-900">Trở thành không gian học tập đáng tin cậy</h2><p className="mt-3 text-sm leading-7 text-slate-600">Xây dựng trải nghiệm ổn định, minh bạch và phù hợp cho cả người học lẫn người tạo nội dung đào tạo.</p></div></div></div></section>

    <section className="app-container page-section"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Nguyên tắc hoạt động</p><h2 className="page-heading mt-3">Những điều LearnUp ưu tiên</h2></div><div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">{principles.map(([title, text], index) => <div key={title} className="flex gap-4 border-t border-slate-200 pt-5"><span className="text-sm font-bold text-blue-700">0{index + 1}</span><div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div></div>)}</div></section>

    <section className="border-y border-slate-200 bg-slate-50"><div className="app-container page-section"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Một nền tảng, ba vai trò</p><h2 className="page-heading mt-3">Mỗi người có đúng công cụ mình cần</h2></div><div className="mt-9 grid gap-5 lg:grid-cols-3">{roles.map(role => <article key={role.title} className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-bold text-slate-900">{role.title}</h3><ul className="mt-5 space-y-3">{role.items.map(item => <li key={item} className="flex gap-3 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"/><span>{item}</span></li>)}</ul></article>)}</div></div></section>

    <section className="app-container page-section"><div className="rounded-2xl bg-blue-700 px-6 py-10 text-white sm:px-10 sm:py-12"><div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><h2 className="text-2xl font-bold">Khám phá LearnUp qua các khóa học</h2><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Xem danh mục đang được xuất bản và lựa chọn lộ trình phù hợp với mục tiêu của bạn.</p></div><div className="flex gap-3"><Link to="/courses" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700">Xem khóa học</Link><Link to="/register" className="rounded-lg border border-blue-400 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">Tạo tài khoản</Link></div></div></div></section>
  </div>;
}
