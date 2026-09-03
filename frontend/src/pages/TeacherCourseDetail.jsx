import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // CHẾ ĐỘ CHỈNH SỬA CHO PHẦN CHƯƠNG TRÌNH BÀI HỌC
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftChapters, setDraftChapters] = useState([]);
  const [draftLessons, setDraftLessons] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Form thêm chương mới trong Edit Mode
  const [newChapterTitle, setNewChapterTitle] = useState("");

  // Quiz State
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: "", passScore: 80, timeLimitMinutes: 15 });

  // State thêm câu hỏi vào Quiz
  const [activeQuizForQuestion, setActiveQuizForQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    content: "",
    explanation: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctOpt: "A",
  });

  const loadAll = useCallback(() => {
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then(setCourse);

    fetch(`/api/courses/${courseId}/chapters`)
      .then((res) => res.json())
      .then(async (chs) => {
        if (Array.isArray(chs)) {
          setChapters(chs);
          const entries = await Promise.all(
            chs.map((ch) =>
              fetch(`/api/chapters/${ch.id}/lessons`)
                .then((res) => res.json())
                .then((lessons) => [ch.id, Array.isArray(lessons) ? lessons : []])
                .catch(() => [ch.id, []])
            )
          );
          const map = Object.fromEntries(entries);
          setLessonsByChapter(map);
          setDraftChapters(JSON.parse(JSON.stringify(chs)));
          setDraftLessons(JSON.parse(JSON.stringify(map)));
        } else {
          setChapters([]);
          setDraftChapters([]);
          setDraftLessons({});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`/api/quizzes/course/${courseId}/manage`)
      .then((res) => res.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []));
  }, [courseId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // BẬT CHẾ ĐỘ SỬA
  const handleEnterEditMode = () => {
    setDraftChapters(JSON.parse(JSON.stringify(chapters)));
    setDraftLessons(JSON.parse(JSON.stringify(lessonsByChapter)));
    setIsEditMode(true);
  };

  // HỦY SỬA
  const handleCancelEditMode = () => {
    setDraftChapters(JSON.parse(JSON.stringify(chapters)));
    setDraftLessons(JSON.parse(JSON.stringify(lessonsByChapter)));
    setIsEditMode(false);
  };

  // LƯU TOÀN BỘ THAY ĐỔI
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // 1. Cập nhật các chương
      for (const ch of draftChapters) {
        if (ch.id) {
          await fetch(`/api/chapters/${ch.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: ch.title }),
          });
        }
      }

      // 2. Cập nhật các bài học
      for (const chId of Object.keys(draftLessons)) {
        const lessons = draftLessons[chId] || [];
        for (const l of lessons) {
          if (l.id) {
            await fetch(`/api/lessons/${l.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: l.title,
                videoUrl: l.videoUrl || "",
              }),
            });
          }
        }
      }

      alert("Đã lưu toàn bộ thay đổi giáo trình thành công!");
      setIsEditMode(false);
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lưu thay đổi, vui lòng thử lại.");
    }
    setIsSaving(false);
  };

  // Thêm chương mới
  const handleAddChapterInline = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const res = await fetch(`/api/courses/${courseId}/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newChapterTitle }),
    });

    if (res.ok) {
      setNewChapterTitle("");
      loadAll();
    }
  };

  // Xóa chương trong Edit Mode
  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Bạn có chắc muốn xóa chương này cùng toàn bộ bài học bên trong?")) return;
    const res = await fetch(`/api/chapters/${chapterId}`, { method: "DELETE" });
    if (res.ok) loadAll();
  };

  // Thêm bài học mới trong Edit Mode
  const handleAddLessonInline = async (chapterId) => {
    const res = await fetch(`/api/chapters/${chapterId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bài học mới",
        videoUrl: "",
      }),
    });

    if (res.ok) {
      loadAll();
    }
  };

  // Xóa bài học trong Edit Mode
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài học này?")) return;
    const res = await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" });
    if (res.ok) loadAll();
  };

  // --- QUIZ ACTIONS ---
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    const res = await fetch(`/api/quizzes/course/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizForm),
    });

    if (res.ok) {
      setQuizForm({ title: "", passScore: 80, timeLimitMinutes: 15 });
      setShowCreateQuizModal(false);
      alert("Tạo bài Quiz mới thành công!");
      loadAll();
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài Quiz này?")) return;
    const res = await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" });
    if (res.ok) loadAll();
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuizForQuestion?.id || !questionForm.content.trim()) return;

    const options = [
      { content: questionForm.optA, isCorrect: questionForm.correctOpt === "A" },
      { content: questionForm.optB, isCorrect: questionForm.correctOpt === "B" },
      { content: questionForm.optC, isCorrect: questionForm.correctOpt === "C" },
      { content: questionForm.optD, isCorrect: questionForm.correctOpt === "D" },
    ].filter((o) => o.content.trim() !== "");

    const res = await fetch(`/api/quizzes/${activeQuizForQuestion.id}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: questionForm.content,
        explanation: questionForm.explanation,
        options,
      }),
    });

    if (res.ok) {
      alert("Đã thêm câu hỏi vào Quiz!");
      setActiveQuizForQuestion(null);
      loadAll();
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    const res = await fetch(`/api/quizzes/questions/${questionId}`, {
      method: "DELETE",
    });
    if (res.ok) loadAll();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* THANH ĐIỀU HƯỚNG */}
      <div className="mb-6">
        <Link to="/teacher" className="text-sm text-blue-600 font-semibold hover:underline">
          ← Quay lại Khóa học của tôi
        </Link>
      </div>

      {/* THÔNG TIN KHÓA HỌC */}
      <div className="bg-white border rounded-3xl p-6 mb-8 shadow-xs border-gray-200">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
          {course?.category?.name || "Khóa học"}
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-2 mb-1">{course?.title}</h1>
        <p className="text-xs text-gray-500">{course?.description}</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải nội dung...</div>
      ) : (
        <div className="space-y-12">
          {/* ================= 1. NỘI DUNG CHƯƠNG & BÀI HỌC ================= */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">1. Chương trình bài học & Video</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isEditMode
                    ? "Đang ở chế độ chỉnh sửa: Nhập trực tiếp tên chương, tên bài, link video và bấm 'Lưu thay đổi'"
                    : "Danh sách chương và bài giảng video của khóa học"}
                </p>
              </div>

              {/* NÚT CHỈNH SỬA / LƯU ĐẶT NGAY TẠI HEADER CỦA PHẦN BÀI HỌC */}
              <div>
                {!isEditMode ? (
                  <button
                    onClick={handleEnterEditMode}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>✏️</span>
                    <span>Chỉnh Sửa Bài Học</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 p-1 rounded-xl">
                    <button
                      onClick={handleCancelEditMode}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveAll}
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-1"
                    >
                      {isSaving ? "Đang lưu..." : "💾 Lưu Thay Đổi"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FORM THÊM CHƯƠNG KHI Ở CHẾ ĐỘ SỬA */}
            {isEditMode && (
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 mb-6">
                <form onSubmit={handleAddChapterInline} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tên chương mới (VD: Chương 2: Giao tiếp thực hành)..."
                    required
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="flex-1 bg-white border px-3.5 py-2 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700"
                  >
                    + Thêm chương
                  </button>
                </form>
              </div>
            )}

            {/* DANH SÁCH CÁC CHƯƠNG */}
            <div className="space-y-6">
              {(isEditMode ? draftChapters : chapters).map((ch, chIdx) => (
                <div key={ch.id} className="border rounded-2xl p-5 bg-white shadow-xs border-gray-200">
                  {/* TIÊU ĐỀ CHƯƠNG */}
                  <div className="flex justify-between items-center pb-3 mb-4 border-b gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {chIdx + 1}
                      </span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => {
                            const updated = [...draftChapters];
                            updated[chIdx].title = e.target.value;
                            setDraftChapters(updated);
                          }}
                          className="flex-1 font-bold text-sm text-gray-900 border px-2.5 py-1 rounded-lg bg-yellow-50/50 border-yellow-300 focus:outline-none"
                        />
                      ) : (
                        <h3 className="font-bold text-sm text-gray-900">{ch.title}</h3>
                      )}
                    </div>

                    {isEditMode && (
                      <button
                        onClick={() => handleDeleteChapter(ch.id)}
                        className="px-2.5 py-1 text-red-500 hover:text-red-700 text-xs font-semibold rounded-lg hover:bg-red-50"
                      >
                        Xóa chương
                      </button>
                    )}
                  </div>

                  {/* DANH SÁCH BÀI HỌC TRONG CHƯƠNG */}
                  <div className="space-y-3 mb-3">
                    {((isEditMode ? draftLessons[ch.id] : lessonsByChapter[ch.id]) || []).map(
                      (lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 rounded-xl border bg-gray-50/70 border-gray-200/80 text-xs"
                        >
                          {isEditMode ? (
                            /* GIAO DIỆN SỬA TRỰC TIẾP TRONG EDIT MODE */
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-500">#{lIdx + 1}</span>
                                <input
                                  type="text"
                                  placeholder="Tên bài học"
                                  value={lesson.title}
                                  onChange={(e) => {
                                    const updatedMap = { ...draftLessons };
                                    updatedMap[ch.id][lIdx].title = e.target.value;
                                    setDraftLessons(updatedMap);
                                  }}
                                  className="flex-1 font-semibold text-gray-900 border px-2.5 py-1.5 rounded-lg bg-white border-gray-300 focus:border-blue-500 outline-none"
                                />
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="text-red-500 hover:text-red-700 px-2 py-1 text-xs"
                                >
                                  Xóa bài
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-mono text-[11px]">🔗 Video:</span>
                                <input
                                  type="text"
                                  placeholder="Link YouTube (https://www.youtube.com/watch?v=...)"
                                  value={lesson.videoUrl || ""}
                                  onChange={(e) => {
                                    const updatedMap = { ...draftLessons };
                                    updatedMap[ch.id][lIdx].videoUrl = e.target.value;
                                    setDraftLessons(updatedMap);
                                  }}
                                  className="flex-1 text-[11px] text-gray-600 border px-2.5 py-1 rounded-lg bg-white border-gray-200 focus:border-blue-500 outline-none font-mono"
                                />
                              </div>
                            </div>
                          ) : (
                            /* GIAO DIỆN XEM GỌN GÀNG */
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 truncate">
                                <span className="font-mono font-bold text-gray-400">#{lIdx + 1}</span>
                                <div className="truncate">
                                  <div className="font-bold text-gray-900">{lesson.title}</div>
                                  <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                    🔗 {lesson.videoUrl || "Chưa có link video"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {((isEditMode ? draftLessons[ch.id] : lessonsByChapter[ch.id]) || []).length ===
                      0 && (
                      <p className="text-xs text-gray-400 italic py-1">Chương này chưa có bài học nào.</p>
                    )}
                  </div>

                  {/* NÚT THÊM BÀI HỌC KHI Ở CHẾ ĐỘ SỬA */}
                  {isEditMode && (
                    <button
                      onClick={() => handleAddLessonInline(ch.id)}
                      className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition mt-2"
                    >
                      + Thêm bài học mới vào chương này
                    </button>
                  )}
                </div>
              ))}

              {chapters.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border text-gray-400">
                  Khóa học chưa có chương nào. Bấm <strong>"✏️ Chỉnh Sửa Bài Học"</strong> để bắt đầu tạo nội dung.
                </div>
              )}
            </div>
          </div>

          {/* ================= 2. QUẢN LÝ QUIZ & CÂU HỎI TRẮC NGHIỆM ================= */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">2. Bài kiểm tra & Câu hỏi Quiz ({quizzes.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5">Tạo đề thi và bấm "+ Thêm câu hỏi" trực tiếp trên từng bài Quiz</p>
              </div>

              <button
                onClick={() => setShowCreateQuizModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>+</span>
                <span>Tạo Bài Quiz Mới</span>
              </button>
            </div>

            {/* DANH SÁCH QUIZ */}
            <div className="space-y-6">
              {quizzes.map((q) => (
                <div key={q.id} className="bg-white border rounded-2xl p-5 shadow-xs border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 mb-4 border-b">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{q.title}</h3>
                      <div className="text-xs text-gray-500 mt-0.5">
                        ⏱️ Thời gian: <strong>{q.timeLimitMinutes || 15} phút</strong> · 🎯 Điểm đạt: <strong>{q.passScore || 80}%</strong> · 📋 Số lượng: <strong>{q.questions?.length || 0} câu hỏi</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveQuizForQuestion(q);
                          setQuestionForm({
                            content: "",
                            explanation: "",
                            optA: "",
                            optB: "",
                            optC: "",
                            optD: "",
                            correctOpt: "A",
                          });
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
                      >
                        + Thêm câu hỏi
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                      >
                        Xóa Quiz
                      </button>
                    </div>
                  </div>

                  {/* DANH SÁCH CÂU HỎI */}
                  <div className="space-y-3">
                    {(q.questions || []).map((quest, qIdx) => (
                      <div key={quest.id} className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/70 text-xs">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="font-bold text-gray-900">
                            Câu {qIdx + 1}: {quest.content}
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(quest.id)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-semibold"
                          >
                            Xóa câu hỏi
                          </button>
                        </div>

                        {/* 4 ĐÁP ÁN */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                          {(quest.options || []).map((opt) => (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-lg border ${
                                opt.isCorrect
                                  ? "bg-green-100 border-green-300 text-green-800 font-bold"
                                  : "bg-white border-gray-200 text-gray-600"
                              }`}
                            >
                              {opt.content} {opt.isCorrect && " ✓ (Đáp án đúng)"}
                            </div>
                          ))}
                        </div>

                        {quest.explanation && (
                          <div className="text-[11px] text-gray-500 bg-white/70 p-2 rounded-lg border">
                            <strong>📌 Giải thích:</strong> {quest.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    {(q.questions || []).length === 0 && (
                      <p className="text-xs text-gray-400 italic py-2">
                        Bài Quiz chưa có câu hỏi nào. Bấm <strong>"+ Thêm câu hỏi"</strong> ở trên để thêm câu trắc nghiệm.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {quizzes.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border text-gray-400">
                  Khóa học chưa có bài Quiz nào. Bấm <strong>"+ Tạo Bài Quiz Mới"</strong> để tạo bài kiểm tra.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TẠO BÀI QUIZ MỚI ================= */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border">
            <h3 className="font-bold text-base text-gray-900 mb-4">Tạo bài Quiz mới</h3>
            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tiêu đề Quiz</label>
                <input
                  type="text"
                  placeholder="VD: Kiểm tra kiến thức Ngữ pháp tuần 1"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Điểm đạt (%)</label>
                  <input
                    type="number"
                    required
                    value={quizForm.passScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passScore: Number(e.target.value) })}
                    className="w-full border px-3 py-2 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    required
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full border px-3 py-2 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  Tạo Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM CÂU HỎI VÀO QUIZ ĐƯỢC CHỌN ================= */}
      {activeQuizForQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 mb-4 border-b">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Thêm câu hỏi
                </span>
                <h3 className="font-bold text-sm text-gray-900 mt-1">Quiz: {activeQuizForQuestion.title}</h3>
              </div>
              <button onClick={() => setActiveQuizForQuestion(null)} className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows="2"
                  placeholder="Nhập nội dung câu hỏi..."
                  required
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              {/* 4 ĐÁP ÁN */}
              <div className="space-y-2">
                <label className="block font-semibold">Các lựa chọn đáp án:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl bg-gray-50">
                    <span className="font-bold text-gray-700">A:</span>
                    <input
                      type="text"
                      placeholder="Đáp án A"
                      required
                      value={questionForm.optA}
                      onChange={(e) => setQuestionForm({ ...questionForm, optA: e.target.value })}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl bg-gray-50">
                    <span className="font-bold text-gray-700">B:</span>
                    <input
                      type="text"
                      placeholder="Đáp án B"
                      required
                      value={questionForm.optB}
                      onChange={(e) => setQuestionForm({ ...questionForm, optB: e.target.value })}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl bg-gray-50">
                    <span className="font-bold text-gray-700">C:</span>
                    <input
                      type="text"
                      placeholder="Đáp án C"
                      value={questionForm.optC}
                      onChange={(e) => setQuestionForm({ ...questionForm, optC: e.target.value })}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl bg-gray-50">
                    <span className="font-bold text-gray-700">D:</span>
                    <input
                      type="text"
                      placeholder="Đáp án D"
                      value={questionForm.optD}
                      onChange={(e) => setQuestionForm({ ...questionForm, optD: e.target.value })}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CHỌN ĐÁP ÁN ĐÚNG */}
              <div className="flex items-center gap-4 py-2 border-y">
                <span className="font-semibold text-gray-700">Đáp án chính xác:</span>
                {["A", "B", "C", "D"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 font-bold cursor-pointer text-indigo-700">
                    <input
                      type="radio"
                      name="correctOpt"
                      value={opt}
                      checked={questionForm.correctOpt === opt}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctOpt: e.target.value })}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block font-semibold mb-1">Lời giải thích chi tiết (tùy chọn)</label>
                <textarea
                  rows="2"
                  placeholder="Giải thích vì sao đáp án này đúng để học viên ôn tập..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuizForQuestion(null)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-sm"
                >
                  + Lưu Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
