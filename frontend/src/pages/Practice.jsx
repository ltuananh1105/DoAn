import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Practice() {
  const { user } = useAuth();
  const [courseQuizzes, setCourseQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI Quiz Generator State
  const [aiTopic, setAiTopic] = useState("");
  const [aiLevel, setAiLevel] = useState("Intermediate");
  const [aiCount, setAiCount] = useState(5);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then(async (enList) => {
          if (!Array.isArray(enList)) return;
          const list = [];
          for (const en of enList) {
            if (en.course?.id) {
              try {
                const qRes = await fetch(`http://localhost:8080/api/quizzes/course/${en.course.id}`);
                const qData = await qRes.json();
                if (Array.isArray(qData)) {
                  qData.forEach((q) => list.push({ ...q, courseTitle: en.course.title }));
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
          setCourseQuizzes(list);
        });
    }
  }, [user?.id]);

  const handleGenerateAiQuiz = async (e) => {
    e.preventDefault();
    setGeneratingAi(true);
    try {
      const res = await fetch("http://localhost:8080/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic || "Tiếng Anh Tổng Quát",
          level: aiLevel,
          numQuestions: aiCount,
        }),
      });
      const data = await res.json();
      if (data.success && data.quiz) {
        setActiveQuiz(data.quiz);
        setAnswers({});
        setQuizResult(null);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể sinh đề AI lúc này. Vui lòng thử lại!");
    }
    setGeneratingAi(false);
  };

  const handleStartCourseQuiz = async (quizId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}`);
      const data = await res.json();
      setActiveQuiz(data);
      setAnswers({});
      setQuizResult(null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    // Chấm điểm Local nếu là AI Quiz, hoặc gửi API nếu là Course Quiz
    if (activeQuiz.id) {
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
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // AI Quiz / Client Evaluation
    let correct = 0;
    const questions = activeQuiz.questions || [];
    questions.forEach((q) => {
      const chosenOptId = answers[q.id];
      const correctOpt = (q.options || []).find((o) => o.isCorrect);
      if (chosenOptId && correctOpt && chosenOptId === correctOpt.id) {
        correct++;
      }
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const passed = score >= (activeQuiz.passScore || 80);

    setQuizResult({
      score,
      correct,
      total: questions.length,
      passed,
      passScore: activeQuiz.passScore || 80,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <span>⚡ Trung Tâm Luyện Tập & AI Quiz</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tự tạo đề thi trắc nghiệm theo chủ đề yêu cầu hoặc luyện tập các bài kiểm tra từ khóa học
          </p>
        </div>
        <Link to="/student" className="text-sm font-semibold text-blue-600 hover:underline">
          ← Về Dashboard
        </Link>
      </div>

      {!activeQuiz ? (
        <div className="space-y-10">
          {/* 1. KHU VỰC TỰ TẠO ĐỀ BẰNG AI */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="max-w-2xl">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                🤖 AI Smart Exam Generator
              </span>
              <h2 className="text-2xl font-bold mt-3 mb-2">Tự tạo bài Quiz trắc nghiệm bằng AI</h2>
              <p className="text-sm text-blue-100 mb-6">
                Nhập bất kỳ chủ đề tiếng Anh nào (IELTS, TOEIC, IT English, Giao tiếp phỏng vấn...), AI sẽ tạo ngay đề thi chuẩn kèm giải thích chi tiết!
              </p>

              <form onSubmit={handleGenerateAiQuiz} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nhập chủ đề (VD: Phỏng vấn IT, IELTS Writing Task 2, Mệnh đề quan hệ...)"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <select
                      value={aiLevel}
                      onChange={(e) => setAiLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl text-sm outline-none font-medium"
                    >
                      <option value="Beginner">Căn bản (A1-A2)</option>
                      <option value="Intermediate">Trung cấp (B1-B2)</option>
                      <option value="Advanced">Nâng cao (C1-C2)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-blue-100">
                    <span>Số câu hỏi:</span>
                    {[3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAiCount(num)}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          aiCount === num ? "bg-white text-blue-700 shadow-sm" : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {num} câu
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={generatingAi}
                    className="px-6 py-3 bg-white text-indigo-700 font-extrabold text-sm rounded-xl hover:bg-blue-50 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {generatingAi ? (
                      <>
                        <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                        AI Đang Tạo Đề...
                      </>
                    ) : (
                      <>
                        <span>✨ Tạo Đề Thi Bằng AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 2. KHO QUIZ TỪ CÁC KHÓA HỌC */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kho đề kiểm tra từ khóa học của bạn</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseQuizzes.map((q) => (
                <div key={q.id} className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {q.courseTitle}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-3">{q.title}</h3>
                    <div className="text-xs text-gray-500 space-y-1 mt-2">
                      <div>⏱️ Thời gian: <strong>{q.timeLimitMinutes || 15} phút</strong></div>
                      <div>🎯 Điểm đạt: <strong>{q.passScore || 80}%</strong></div>
                      <div>📝 Số lượng: <strong>{q.questions?.length || 0} câu hỏi</strong></div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartCourseQuiz(q.id)}
                    className="mt-5 w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                  >
                    Bắt đầu thi thử
                  </button>
                </div>
              ))}
              {courseQuizzes.length === 0 && (
                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border text-gray-400">
                  Chưa có bài quiz nào từ các khóa học. Bạn có thể sử dụng công cụ **Tạo đề bằng AI** ở trên để làm bài ngay!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN LÀM BÀI QUIZ (AI HOẶC COURSE QUIZ) */
        <div className="bg-white border rounded-3xl p-8 shadow-sm max-w-3xl mx-auto">
          <div className="flex justify-between items-center pb-5 mb-6 border-b">
            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase">
                {activeQuiz.topic ? `AI Quiz: ${activeQuiz.topic}` : "Bài Kiểm Tra Khóa Học"}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{activeQuiz.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Thời gian: {activeQuiz.timeLimitMinutes || 15} phút · Điểm đạt yêu cầu: {activeQuiz.passScore || 80}%
              </p>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-gray-500 hover:text-gray-800 border px-3.5 py-2 rounded-xl transition"
            >
              ← Thoát
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
                    Tạo đề AI khác
                  </button>
                </div>
              </div>

              {/* BẢNG GIẢI THÍCH ĐÁP ÁN CHI TIẾT TỪ AI */}
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
