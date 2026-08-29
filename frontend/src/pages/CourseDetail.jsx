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
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizDetail, setQuizDetail] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch(`http://localhost:8080/api/courses/${courseId}/chapters`)
      .then((res) => res.json())
      .then(async (chs) => {
        if (Array.isArray(chs)) {
          setChapters(chs);
          const entries = await Promise.all(
            chs.map((ch) =>
              fetch(`http://localhost:8080/api/chapters/${ch.id}/lessons`)
                .then((res) => res.json())
                .then((lessons) => [ch.id, Array.isArray(lessons) ? lessons : []])
                .catch(() => [ch.id, []])
            )
          );
          const map = Object.fromEntries(entries);
          setLessonsByChapter(map);
          if (chs.length > 0 && map[chs[0].id]?.length > 0) {
            setActiveLesson(map[chs[0].id][0]);
          }
        } else {
          setChapters([]);
        }
      })
      .catch(console.error);

    fetch(`http://localhost:8080/api/quizzes/course/${courseId}`)
      .then((res) => res.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [courseId]);

  // Bắt đầu làm quiz
  const handleStartQuiz = async (quizId) => {
    setQuizLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}`);
      const data = await res.json();
      setQuizDetail(data);
      setActiveQuiz(quizId);
      setAnswers({});
      setQuizResult(null);
    } catch (e) {
      console.error(e);
    }
    setQuizLoading(false);
  };

  // Chọn đáp án
  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Nộp bài
  const handleSubmitQuiz = async () => {
    if (!quizDetail || !user?.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizDetail.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id, answers }),
      });
      const result = await res.json();
      setQuizResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  // Thoát quiz
  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setQuizDetail(null);
    setAnswers({});
    setQuizResult(null);
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-12 text-gray-400">Đang tải bài học...</div>;
  }

  // =================== GIAO DIỆN LÀM BÀI QUIZ ===================
  if (activeQuiz && quizDetail) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={handleExitQuiz}
          className="text-sm text-blue-600 mb-6 inline-block font-semibold hover:underline"
        >
          ← Quay lại khóa học
        </button>

        {quizResult ? (
          /* KẾT QUẢ SAU KHI NỘP BÀI */
          <div className="bg-white border rounded-3xl p-8 shadow-sm text-center">
            <div className={`text-6xl mb-4 ${quizResult.passed ? "text-green-500" : "text-red-400"}`}>
              {quizResult.passed ? "🎉" : "😔"}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              {quizResult.passed ? "Chúc mừng! Bạn đã đạt!" : "Chưa đạt yêu cầu"}
            </h2>
            <p className="text-gray-500 mb-6">
              Điểm của bạn: <strong className={`text-xl ${quizResult.passed ? "text-green-600" : "text-red-500"}`}>{quizResult.score}%</strong>
              {" · "}Điểm đạt: <strong>{quizDetail.passScore}%</strong>
            </p>

            {/* PHẦN GIẢI THÍCH ĐÁP ÁN */}
            <div className="text-left space-y-4 mb-6">
              {(quizDetail.questions || []).map((q, idx) => {
                const selectedId = answers[q.id];
                const correctOpt = q.options?.find((o) => o.isCorrect);
                const selectedOpt = q.options?.find((o) => o.id === selectedId);
                const isCorrect = selectedOpt?.isCorrect;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border text-sm ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="font-semibold text-gray-900 mb-2">
                      {isCorrect ? "✅" : "❌"} Câu {idx + 1}: {q.content}
                    </div>
                    <div className="text-xs text-gray-600">
                      Bạn chọn: <strong>{selectedOpt?.content || "Chưa chọn"}</strong>
                      {!isCorrect && <span className="ml-2 text-green-700">| Đáp án đúng: <strong>{correctOpt?.content}</strong></span>}
                    </div>
                    {q.explanation && (
                      <div className="mt-2 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        📌 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setAnswers({}); setQuizResult(null); }}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Làm lại
              </button>
              <button
                onClick={handleExitQuiz}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
              >
                Quay lại khóa học
              </button>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN LÀM BÀI */
          <div className="bg-white border rounded-3xl p-8 shadow-sm">
            <div className="pb-5 mb-6 border-b">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Bài Kiểm Tra</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{quizDetail.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {quizDetail.timeLimitMinutes} phút · Điểm đạt: {quizDetail.passScore}%
              </p>
            </div>

            <div className="space-y-6">
              {(quizDetail.questions || []).map((q, idx) => (
                <div key={q.id} className="pb-5 border-b last:border-0">
                  <p className="font-semibold text-gray-900 text-sm mb-3">
                    Câu {idx + 1}: {q.content}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(q.options || []).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                          answers[q.id] === opt.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300"
                        }`}
                      >
                        {opt.content}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-5 border-t">
              <span className="text-xs text-gray-400">
                Đã chọn: {Object.keys(answers).length}/{(quizDetail.questions || []).length} câu
              </span>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length === 0}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Nộp bài thi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =================== GIAO DIỆN TRANG KHÓA HỌC ===================
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
              <div className="text-center p-6">
                <p className="text-gray-400 mb-2">Chưa có video hoặc chọn bài học bên phải</p>
                <p className="text-xs text-gray-500">{course?.title}</p>
              </div>
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
              {quizLoading && <div className="text-sm text-gray-400 py-4">Đang tải bài kiểm tra...</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizzes.map((q) => (
                  <div key={q.id} className="p-4 border rounded-xl bg-indigo-50/50 border-indigo-100 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{q.title}</div>
                      <div className="text-xs text-gray-500">Điểm đạt: {q.passScore}% · {q.timeLimitMinutes} phút</div>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(q.id)}
                      disabled={quizLoading}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Làm bài
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DANH SÁCH BÀI HỌC BÊN PHẢI */}
        <div className="w-full lg:w-80 space-y-4">
          <h2 className="font-bold text-lg text-gray-900">Mục lục bài học</h2>

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
                {(lessonsByChapter[ch.id] || []).length === 0 && (
                  <div className="p-3 text-xs text-gray-400 italic">Chưa có bài học trong chương này</div>
                )}
              </div>
            </div>
          ))}

          {chapters.length === 0 && (
            <p className="text-xs text-gray-400">Khóa học chưa có chương mục nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}