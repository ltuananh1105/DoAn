import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then(setCourse);

    fetch(`http://localhost:8080/api/courses/${courseId}/chapters`)
      .then((res) => res.json())
      .then(async (chs) => {
        setChapters(chs);
        const entries = await Promise.all(
          chs.map((ch) =>
            fetch(`http://localhost:8080/api/chapters/${ch.id}/lessons`)
              .then((res) => res.json())
              .then((lessons) => [ch.id, lessons])
          )
        );
        const map = Object.fromEntries(entries);
        setLessonsByChapter(map);
        // Chọn bài đầu tiên làm active nếu có
        if (chs.length > 0 && map[chs[0].id]?.length > 0) {
          setActiveLesson(map[chs[0].id][0]);
        }
      });

    fetch(`http://localhost:8080/api/quizzes/course/${courseId}`)
      .then((res) => res.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []));
  }, [courseId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link to="/student" className="text-sm text-blue-600 mb-4 inline-block font-semibold">
        ← Quay lại Khóa học của tôi
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* KHUNG VIDEO BÀI HỌC CHÍNH */}
        <div className="flex-1">
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video flex items-center justify-center text-white">
            {activeLesson?.videoUrl ? (
              <iframe
                className="w-full h-full"
                src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                title={activeLesson.title}
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-gray-400">Chọn một bài học để xem video bài giảng</p>
            )}
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{activeLesson?.title || course?.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{course?.description}</p>
          </div>

          {/* BÀI QUIZ CỦA KHÓA HỌC */}
          {quizzes.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="font-bold text-lg text-gray-900 mb-3">Bài kiểm tra & Quiz khóa học</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizzes.map((q) => (
                  <div key={q.id} className="p-4 border rounded-xl bg-indigo-50/50 border-indigo-100 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{q.title}</div>
                      <div className="text-xs text-gray-500">Điểm đạt: {q.passScore}% · {q.timeLimitMinutes} phút</div>
                    </div>
                    <Link
                      to="/student/practice"
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
                    >
                      Làm bài
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DANH SÁCH BÀI HỌC BÊN PHẢI */}
        <div className="w-full lg:w-80 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Mục lục khóa học</h2>

          {chapters.map((ch) => (
            <div key={ch.id} className="border rounded-xl bg-white overflow-hidden shadow-xs">
              <div className="p-3 bg-gray-50 font-semibold text-xs text-gray-700 border-b">
                {ch.title}
              </div>
              <div className="divide-y">
                {(lessonsByChapter[ch.id] || []).map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLesson(l)}
                    className={`w-full text-left p-3 text-xs flex items-center gap-2.5 transition ${
                      activeLesson?.id === l.id
                        ? "bg-blue-50 font-bold text-blue-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate">{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}