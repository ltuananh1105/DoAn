import { Link } from 'react-router-dom';

const benefits = [
  ['Lộ trình rõ ràng', 'Nội dung được tổ chức theo chương và bài học để người học dễ theo dõi tiến độ.'],
  ['Giáo viên đồng hành', 'Khóa học do giáo viên xây dựng và được quản trị viên kiểm duyệt trước khi phát hành.'],
  ['Kết quả tập trung', 'Tiến độ, bài kiểm tra và kết quả học tập được quản lý trong tài khoản cá nhân.'],
];

export default function Home() {
  return <div className="bg-white">
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="app-container py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-700">NỀN TẢNG HỌC TIẾNG ANH TRỰC TUYẾN</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Học tiếng Anh theo một lộ trình rõ ràng.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Tìm khóa học phù hợp, học theo từng bài và theo dõi kết quả tại một nơi. LearnUp giúp học viên tập trung vào quá trình học, đồng thời giúp giáo viên quản lý nội dung thuận tiện hơn.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/courses" className="ui-button ui-button-primary px-5">Xem danh sách khóa học</Link><Link to="/register" className="ui-button ui-button-secondary px-5">Đăng ký tài khoản</Link></div>
        </div>
      </div>
    </section>

    <section className="app-container page-section">
      <div className="max-w-2xl"><p className="text-sm font-semibold text-blue-700">CÁCH LEARNUP HOẠT ĐỘNG</p><h2 className="page-heading mt-3">Những chức năng cần thiết cho việc học lâu dài</h2><p className="page-description">Giao diện tập trung vào nội dung và công việc cần làm, không đưa dữ liệu minh họa dễ gây nhầm lẫn.</p></div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">{benefits.map(([title, description], index) => <article key={title} className="ui-card p-6"><span className="text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
    </section>

    <section className="border-t border-slate-200 bg-slate-50"><div className="app-container flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Tìm khóa học phù hợp với bạn</h2><p className="mt-2 text-sm text-slate-600">Xem nội dung, giáo viên và học phí trước khi đăng ký.</p></div><Link to="/courses" className="ui-button ui-button-primary">Khám phá khóa học</Link></div></section>
  </div>;
}
