import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Practice() {
  const { user } = useAuth();
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizSearch, setQuizSearch] = useState("");

  const filteredQuizzes = useMemo(() => {
    return courseQuizzes.filter((q) => {
      return (
        !quizSearch ||
        q.title?.toLowerCase().includes(quizSearch.toLowerCase()) ||
        q.courseTitle?.toLowerCase().includes(quizSearch.toLowerCase()) ||
        q.teacherName?.toLowerCase().includes(quizSearch.toLowerCase())
      );
    });
  }, [courseQuizzes, quizSearch]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then(async (enList) => {
          if (!Array.isArray(enList)) {
            setLoading(false);
            return;
          }
          const list = [];
          for (const en of enList) {
            if (en.course?.id) {
              try {
                const qRes = await fetch(`http://localhost:8080/api/quizzes/course/${en.course.id}`);
                const qData = await qRes.json();
                if (Array.isArray(qData)) {
                  qData.forEach((q) =>
                    list.push({
                      ...q,
                      courseId: en.course.id,
                      courseTitle: en.course.title,
                      teacherName: en.course.teacher?.name,
                    })
                  );
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
          setCourseQuizzes(list);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user?.id]);

  const handleStartQuiz = async (quizId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}`);
      const data = await res.json();
      setActiveQuiz(data);
      setAnswers({});
      setQuizResult(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !user?.id) return;

    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${activeQuiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          answers,
        }),
      });
      const result = await res.json();
      setQuizResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <span>📝 Trung Tâm Bài Kiểm Tra & Luyện Tập</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp các bài kiểm tra đánh giá kiến thức do Giảng viên biên soạn theo từng khóa học
          </p>
        </div>
        <Link to="/student" className="text-sm font-semibold text-blue-600 hover:underline">
          ← Về Dashboard Học Viên
        </Link>
      </div>

      {!activeQuiz ? (
        <div>
          {loading ? (
            <div className="text-center py-16 text-gray-400">Đang tải danh sách bài kiểm tra...</div>
          ) : (
            <div>
              {/* SEARCH */}
              <div className="relative mb-6 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm bài quiz, khóa học..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                />
                {quizSearch && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{filteredQuizzes.length} kết quả</span>}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition border-gray-100"
                >
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {q.courseTitle}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-3 leading-snug">{q.title}</h3>
                    <div className="text-xs text-gray-500 space-y-1.5 mt-3 pt-3 border-t border-gray-100">
                      <div>⏱️ Thời gian làm bài: <strong>{q.timeLimitMinutes || 15} phút</strong></div>
                      <div>🎯 Điểm đạt chuẩn: <strong>{q.passScore || 80}%</strong></div>
                      <div>📋 Số lượng: <strong>{q.questions?.length || 0} câu hỏi trắc nghiệm</strong></div>
                      {q.teacherName && <div className="text-gray-400">👨‍🏫 Giảng viên: {q.teacherName}</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(q.id)}
                    className="mt-6 w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
                  >
                    Bắt đầu làm bài thi
                  </button>
                </div>
              ))}

              {filteredQuizzes.length === 0 && courseQuizzes.length > 0 && (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border text-gray-400">
                  <p className="text-base font-semibold text-gray-600 mb-2">Không tìm thấy bài quiz phù hợp.</p>
                  <button onClick={() => setQuizSearch("")} className="text-xs font-bold text-blue-600 hover:underline">Xóa bộ lọc</button>
                </div>
              )}
              {courseQuizzes.length === 0 && (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border text-gray-400">
                  <p className="text-base font-semibold text-gray-600 mb-2">Chưa có bài kiểm tra nào.</p>
                  <p className="text-xs text-gray-400 mb-4">
                    Các bài kiểm tra sẽ tự động xuất hiện khi Giảng viên cập nhật Quiz cho các khóa học bạn tham gia.
                  </p>
                  <Link to="/courses" className="text-xs font-bold text-blue-600 hover:underline">
                    Khám phá thêm khóa học →
                  </Link>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border rounded-3xl p-8 shadow-sm max-w-3xl mx-auto border-gray-100">
          <div className="flex justify-between items-start pb-5 mb-6 border-b">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                Bài Kiểm Tra Khóa Học
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{activeQuiz.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Thời gian: {activeQuiz.timeLimitMinutes || 15} phút · Điểm đạt: {activeQuiz.passScore || 80}%
              </p>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-gray-500 hover:text-gray-800 border px-3.5 py-2 rounded-xl transition"
            >
              ← Thoát bài thi
            </button>
          </div>

          {quizResult ? (
            /* KẾT QUẢ VÀ GIẢI THÍCH CHI TIẾT */
            <div className="space-y-8">
              <div className="text-center py-6 bg-gray-50 rounded-2xl border">
                <div className={`text-6xl font-black mb-2 ${quizResult.passed ? "text-green-600" : "text-red-600"}`}>
                  {quizResult.score}%
                </div>
                <div className={`text-xl font-bold mb-2 ${quizResult.passed ? "text-green-700" : "text-red-700"}`}>
                  {quizResult.passed ? "🎉 XUẤT SẮC! BẠN ĐÃ ĐẠT BÀI KIỂM TRA" : "❌ CHƯA ĐẠT ĐIỂM YÊU CẦU"}
                </div>
                <p className="text-sm text-gray-600">
                  Trả lời đúng <strong>{quizResult.correct}</strong> trên tổng số <strong>{quizResult.total}</strong> câu hỏi.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setAnswers({});
                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition"
                  >
                    Làm lại bài thi
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-5 py-2.5 bg-white border text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition"
                  >
                    Danh sách bài kiểm tra khác
                  </button>
                </div>
              </div>

              {/* BẢNG GIẢI THÍCH ĐÁP ÁN CHI TIẾT */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-4">💡 Chi tiết đáp án & Lời giải thích:</h3>
                <div className="space-y-4">
                  {(activeQuiz.questions || []).map((q, idx) => {
                    const userOptId = answers[q.id];
                    const correctOpt = (q.options || []).find((o) => o.isCorrect);
                    const isUserCorrect = userOptId === correctOpt?.id;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border ${
                          isUserCorrect ? "bg-green-50/50 border-green-200" : "bg-red-50/50 border-red-200"
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-900 mb-2 flex items-start gap-2">
                          <span>{isUserCorrect ? "✅" : "❌"}</span>
                          <span>Câu {idx + 1}: {q.content}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs my-2">
                          {(q.options || []).map((opt) => (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-lg border ${
                                opt.isCorrect
                                  ? "bg-green-100 border-green-300 text-green-900 font-bold"
                                  : opt.id === userOptId
                                    ? "bg-red-100 border-red-300 text-red-900 line-through"
                                    : "bg-white border-gray-200 text-gray-600"
                              }`}
                            >
                              {opt.content} {opt.isCorrect && " ✓ (Đáp án đúng)"}
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div className="mt-3 p-3 bg-white/80 rounded-xl text-xs text-gray-700 border border-gray-200/80">
                            <strong>📌 Giải thích:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* DANH SÁCH CÂU HỎI LÀM BÀI */
            <div className="space-y-8">
              {(activeQuiz.questions || []).map((q, qIdx) => (
                <div key={q.id} className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200/80">
                  <div className="font-bold text-gray-900 text-sm mb-3">
                    Câu {qIdx + 1}: {q.content}
                  </div>
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                          answers[q.id] === opt.id
                            ? "bg-blue-50 border-blue-600 font-bold text-blue-900 shadow-2xs"
                            : "bg-white border-gray-200 hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={answers[q.id] === opt.id}
                          onChange={() => handleSelectOption(q.id, opt.id)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{opt.content}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t flex justify-end">
                <button
                  onClick={handleSubmitQuiz}
                  className="px-10 py-3.5 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 transition shadow-md"
                >
                  Nộp bài thi & Chấm điểm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
