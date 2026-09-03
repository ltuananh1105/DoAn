import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function AdminCourseReview() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState({});
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [courseRes, chapterRes, quizRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/chapters/course/${courseId}`),
        fetch(`/api/quizzes/course/${courseId}/manage`),
      ]);
      const courseData = await courseRes.json();
      const chapterData = await chapterRes.json();
      const quizData = await quizRes.json();
      setCourse(courseData);
      setChapters(Array.isArray(chapterData) ? chapterData : []);
      setQuizzes(Array.isArray(quizData) ? quizData : []);
      const entries = await Promise.all((Array.isArray(chapterData) ? chapterData : []).map(async (chapter) => {
        const response = await fetch(`/api/lessons/chapter/${chapter.id}`);
        return [chapter.id, await response.json()];
      }));
      setLessons(Object.fromEntries(entries));
    };
    load().catch(console.error);
  }, [courseId]);

  if (!course) return <div className="p-10 text-center text-gray-500">Đang tải khóa học...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link to="/admin" className="text-sm font-semibold text-blue-600">← Quay lại quản trị</Link>
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{course.status}</span>
          </div>
          <p className="text-gray-600">{course.description}</p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div><strong>Giảng viên:</strong> {course.teacher?.name}</div>
            <div><strong>Danh mục:</strong> {course.category?.name}</div>
            <div><strong>Giá:</strong> {course.price?.toLocaleString("vi-VN")} ₫</div>
          </div>
          {course.reviewNote && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"><strong>Ghi chú xét duyệt:</strong> {course.reviewNote}</div>}
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Chương trình học ({chapters.length} chương)</h2>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="rounded-xl border p-4">
                <h3 className="font-semibold">Chương {index + 1}: {chapter.title}</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {(lessons[chapter.id] || []).map((lesson, lessonIndex) => <li key={lesson.id}>{lessonIndex + 1}. {lesson.title} {lesson.videoUrl ? "✓ Có video" : "⚠ Chưa có video"}</li>)}
                  {(lessons[chapter.id] || []).length === 0 && <li className="text-red-600">Chương chưa có bài học</li>}
                </ul>
              </div>
            ))}
            {chapters.length === 0 && <p className="text-red-600">Khóa học chưa có chương.</p>}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Quiz ({quizzes.length})</h2>
          <div className="space-y-3">{quizzes.map((quiz) => <div key={quiz.id} className="rounded-xl border p-4"><strong>{quiz.title}</strong><div className="text-sm text-gray-500">{quiz.questions?.length || 0} câu hỏi · Điểm đạt {quiz.passScore}%</div></div>)}</div>
        </section>
      </div>
    </main>
  );
}
