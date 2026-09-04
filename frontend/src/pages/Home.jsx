import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const benefits = [
  { title: 'Nội dung có cấu trúc', text: 'Khóa học được chia thành chương, bài học và bài kiểm tra để người học biết mình cần làm gì tiếp theo.' },
  { title: 'Chất lượng có kiểm duyệt', text: 'Khóa học của giáo viên phải qua quy trình gửi duyệt trước khi xuất hiện trong danh mục công khai.' },
  { title: 'Tiến độ được ghi nhận', text: 'Bài học đã hoàn thành và kết quả bài kiểm tra được lưu lại trong tài khoản học viên.' },
];

const steps = [
  ['01', 'Chọn khóa học', 'Xem nội dung, giảng viên và học phí để lựa chọn khóa học phù hợp.'],
  ['02', 'Học theo lộ trình', 'Hoàn thành lần lượt các bài học và luyện tập với bài kiểm tra của khóa học.'],
  ['03', 'Theo dõi kết quả', 'Xem tiến độ, điểm số và tiếp tục học từ vị trí gần nhất trong dashboard.'],
];

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/courses/public').then(response => response.ok ? response.json() : []).then(data => setCourses(Array.isArray(data) ? data : [])).catch(() => setCourses([]));
  }, []);

  const platformStats = useMemo(() => {
    const teachers = new Set(courses.map(course => course.teacher?.id).filter(Boolean));
    const categories = new Set(courses.map(course => course.category?.id).filter(Boolean));
    return [
      [courses.length, 'Khóa học đang mở'],
      [teachers.size, 'Giáo viên tham gia'],
      [categories.size, 'Nhóm nội dung'],
    ];
  }, [courses]);

  return <div className="bg-white">
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="app-container grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Học tiếng Anh trực tuyến cùng LearnUp</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">Một lộ trình rõ ràng cho mục tiêu tiếng Anh của bạn.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">Khám phá khóa học từ giáo viên, học theo từng bài và theo dõi kết quả trong một không gian thống nhất. LearnUp tập trung vào trải nghiệm học đơn giản, minh bạch và có định hướng.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/courses" className="ui-button ui-button-primary px-5">Khám phá khóa học</Link><Link to="/about" className="ui-button ui-button-secondary px-5">Tìm hiểu LearnUp</Link></div>
          <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-6">{platformStats.map(([value, label]) => <div key={label}><p className="text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{label}</p></div>)}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Đang được quan tâm</p><h2 className="mt-1 font-semibold text-slate-900">Khóa học mới trên LearnUp</h2></div><Link to="/courses" className="text-xs font-semibold text-blue-700 hover:underline">Xem tất cả</Link></div>
          <div className="divide-y divide-slate-100">{courses.slice(0, 3).map(course => <Link key={course.id} to={`/courses/${course.id}`} className="group flex items-center gap-4 py-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{course.title?.charAt(0)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700">{course.title}</p><p className="mt-1 truncate text-xs text-slate-500">{course.teacher?.name || 'Đội ngũ LearnUp'} · {course.category?.name || 'Tiếng Anh'}</p></div><p className="shrink-0 text-sm font-semibold text-slate-900">{Number(course.price || 0).toLocaleString('vi-VN')} ₫</p></Link>)}{!courses.length && <div className="py-12 text-center text-sm text-slate-400">Danh sách khóa học đang được cập nhật.</div>}</div>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">Thông tin khóa học được lấy trực tiếp từ danh mục đang xuất bản.</div>
        </div>
      </div>
    </section>

    <section className="app-container page-section">
      <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Vì sao chọn LearnUp</p><h2 className="page-heading mt-3">Tập trung vào những gì người học thực sự cần</h2><p className="page-description">Từ khâu chọn khóa học đến khi hoàn thành bài kiểm tra, mọi thông tin quan trọng đều được trình bày rõ ràng.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map((item, index) => <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</span><h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></article>)}</div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50"><div className="app-container page-section"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Bắt đầu học</p><h2 className="page-heading mt-3">Ba bước để đi từ lựa chọn đến kết quả</h2><p className="page-description">Quy trình học được thiết kế ngắn gọn để bạn dành thời gian cho nội dung thay vì làm quen với hệ thống.</p></div><div className="space-y-3">{steps.map(([number, title, text]) => <div key={number} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5"><span className="text-sm font-bold text-blue-700">{number}</span><div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div>)}</div></div></div></section>

    <section className="app-container page-section"><div className="grid overflow-hidden rounded-2xl border border-slate-200 lg:grid-cols-2"><div className="bg-blue-700 p-8 text-white sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-blue-100">Dành cho học viên</p><h2 className="mt-3 text-2xl font-bold">Học tập chủ động, tiến độ minh bạch</h2><p className="mt-4 text-sm leading-7 text-blue-100">Đăng ký khóa học, xem bài giảng, làm quiz và kiểm tra tiến độ ngay trên dashboard cá nhân.</p><Link to="/register" className="mt-7 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700">Đăng ký học viên</Link></div><div className="bg-white p-8 sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Dành cho giáo viên</p><h2 className="mt-3 text-2xl font-bold text-slate-900">Xây dựng và quản lý khóa học</h2><p className="mt-4 text-sm leading-7 text-slate-600">Tổ chức chương, bài học và bài kiểm tra; gửi duyệt khóa học và theo dõi học viên, doanh thu.</p><Link to="/register" className="ui-button ui-button-secondary mt-7">Đăng ký giáo viên</Link></div></div></section>

    <section className="border-t border-slate-200 bg-slate-50"><div className="app-container flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-slate-900">Sẵn sàng bắt đầu?</h2><p className="mt-2 text-sm text-slate-600">Xem nội dung, giáo viên và học phí trước khi đăng ký.</p></div><Link to="/courses" className="ui-button ui-button-primary">Xem danh sách khóa học</Link></div></section>
  </div>;
}
