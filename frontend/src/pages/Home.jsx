import { Link } from 'react-router-dom';

const benefits = [
  ['Lộ trình rõ ràng', 'Nội dung được tổ chức theo chương, bài học và mục tiêu cụ thể để bạn dễ theo dõi tiến độ.'],
  ['Giáo viên đồng hành', 'Học cùng giáo viên có kinh nghiệm, tài liệu tập trung và hệ thống quản lý lớp học thuận tiện.'],
  ['Luyện tập thường xuyên', 'Củng cố kiến thức qua bài học và bài kiểm tra, xem lại kết quả ngay trên tài khoản cá nhân.'],
];

export default function Home() {
  return <div className="bg-white">
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="app-container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div><span className="inline-flex rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">HỌC TIẾNG ANH TRỰC TUYẾN</span><h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">Học đúng nội dung, theo dõi đúng tiến độ.</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-600">LearnUp kết nối học viên với giáo viên và các khóa học có lộ trình rõ ràng. Mọi bài học, kết quả và tiến độ được quản lý tại một nơi.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/courses" className="ui-button ui-button-primary px-5">Xem khóa học</Link><Link to="/register" className="ui-button ui-button-secondary px-5">Tạo tài khoản</Link></div><div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 border-t border-slate-200 pt-5 text-sm text-slate-600"><span>Khóa học có kiểm duyệt</span><span>Thanh toán trực tuyến</span><span>Theo dõi tiến độ</span></div></div>
        <div className="ui-card overflow-hidden"><div className="border-b bg-slate-50 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Không gian học tập</p><p className="mt-1 font-semibold text-slate-900">Tiến độ khóa Tiếng Anh giao tiếp</p></div><div className="space-y-5 p-6"><div><div className="flex justify-between text-sm"><span className="font-medium text-slate-700">Hoàn thành khóa học</span><b className="text-blue-700">68%</b></div><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 w-[68%] rounded bg-blue-600" /></div></div>{['Phát âm cơ bản', 'Giao tiếp hằng ngày', 'Từ vựng theo chủ đề'].map((item, index) => <div key={item} className="flex items-center gap-3 border-t border-slate-100 pt-4"><span className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${index < 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{index < 2 ? '✓' : '3'}</span><div><p className="text-sm font-medium text-slate-800">{item}</p><p className="text-xs text-slate-500">{index < 2 ? 'Đã hoàn thành' : 'Đang học'}</p></div></div>)}</div></div>
      </div>
    </section>
    <section className="app-container page-section"><div className="max-w-2xl"><h2 className="page-heading">Một nền tảng đơn giản cho việc học lâu dài</h2><p className="page-description">Không thêm những tính năng gây xao nhãng. LearnUp tập trung vào nội dung, tiến độ và sự kết nối giữa người học với giáo viên.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{benefits.map(([title, description], index) => <article key={title} className="ui-card p-6"><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></section>
    <section className="border-t border-slate-200 bg-slate-50"><div className="app-container flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Bắt đầu với khóa học phù hợp</h2><p className="mt-2 text-sm text-slate-600">Tìm theo chủ đề, giáo viên và mục tiêu học tập của bạn.</p></div><Link to="/courses" className="ui-button ui-button-primary">Khám phá khóa học</Link></div></section>
  </div>;
}
