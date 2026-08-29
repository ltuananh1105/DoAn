import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [quizzes, setQuizzes] = useState([]);

  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonForms, setLessonForms] = useState({});
  const [quizForm, setQuizForm] = useState({ title: "", passScore: 80, timeLimitMinutes: 15 });
  const [questionForm, setQuestionForm] = useState({
    quizId: "",
    content: "",
    explanation: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctOpt: "A",
  });
  const [message, setMessage] = useState("");

  const loadAll = () => {
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
        setLessonsByChapter(Object.fromEntries(entries));
      });

    fetch(`http://localhost:8080/api/quizzes/course/${courseId}`)
      .then((res) => res.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    loadAll();
  }, [courseId]);

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;

    const res = await fetch(`http://localhost:8080/api/courses/${courseId}/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: chapterTitle }),
    });

    if (res.ok) {
      setChapterTitle("");
      setMessage("Đã thêm chương mới.");
      loadAll();
    }
  };

  const handleAddLesson = async (chapterId) => {
    const formData = lessonForms[chapterId];
    if (!formData?.title?.trim()) return;

    const res = await fetch(`http://localhost:8080/api/chapters/${chapterId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        videoUrl: formData.videoUrl || "",
      }),
    });

    if (res.ok) {
      setLessonForms((f) => ({ ...f, [chapterId]: { title: "", videoUrl: "" } }));
      loadAll();
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;

    const res = await fetch(`http://localhost:8080/api/quizzes/course/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizForm),
    });

    if (res.ok) {
      setQuizForm({ title: "", passScore: 80, timeLimitMinutes: 15 });
      alert("Tạo Quiz thành công!");
      loadAll();
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.quizId || !questionForm.content.trim()) return;

    const options = [
      { content: questionForm.optA, isCorrect: questionForm.correctOpt === "A" },
      { content: questionForm.optB, isCorrect: questionForm.correctOpt === "B" },
      { content: questionForm.optC, isCorrect: questionForm.correctOpt === "C" },
      { content: questionForm.optD, isCorrect: questionForm.correctOpt === "D" },
    ].filter((o) => o.content.trim() !== "");

    const res = await fetch(`http://localhost:8080/api/quizzes/${questionForm.quizId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: questionForm.content,
        explanation: questionForm.explanation,
        options,
      }),
    });

    if (res.ok) {
      setQuestionForm({
        quizId: questionForm.quizId,
        content: "",
        explanation: "",
        optA: "",
        optB: "",
        optC: "",
        optD: "",
        correctOpt: "A",
      });
      alert("Đã thêm câu hỏi trắc nghiệm thành công!");
      loadAll();
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài Quiz này?")) return;
    const res = await fetch(`http://localhost:8080/api/quizzes/${quizId}`, { method: "DELETE" });
    if (res.ok) loadAll();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/teacher" className="text-sm text-blue-600 mb-4 inline-block font-semibold">
        ← Quay lại Khóa học của tôi
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{course?.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{course?.description}</p>

      {/* 1. QUẢN LÝ CHƯƠNG & BÀI HỌC */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-900">1. Chương trình bài học</h2>
        </div>

        <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-sm text-gray-800 mb-3">Thêm chương mới</h3>
          <form onSubmit={handleAddChapter} className="flex gap-3">
            <input
              type="text"
              placeholder="Tên chương (VD: Chương 1: Giới thiệu)"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="flex-1 border px-3 py-2 rounded text-sm outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Thêm chương
            </button>
          </form>
        </div>

        {chapters.map((ch) => (
          <div key={ch.id} className="mb-6 border rounded-xl p-5 bg-white shadow-xs">
            <h3 className="font-bold text-base text-gray-900 mb-3">{ch.title}</h3>

            {/* DANH SÁCH LESSON */}
            <div className="space-y-2 mb-4">
              {(lessonsByChapter[ch.id] || []).map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center gap-4 border rounded-lg p-3 bg-gray-50/50">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-medium text-sm text-gray-900">{lesson.title}</div>
                    <div className="text-xs text-gray-400 truncate">{lesson.videoUrl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM THÊM LESSON */}
            <div className="bg-gray-50 rounded-lg p-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Tên bài học..."
                value={lessonForms[ch.id]?.title || ""}
                onChange={(e) =>
                  setLessonForms((f) => ({
                    ...f,
                    [ch.id]: { ...f[ch.id], title: e.target.value },
                  }))
                }
                className="flex-1 border px-3 py-1.5 rounded text-xs"
              />
              <input
                type="text"
                placeholder="Link video YouTube..."
                value={lessonForms[ch.id]?.videoUrl || ""}
                onChange={(e) =>
                  setLessonForms((f) => ({
                    ...f,
                    [ch.id]: { ...f[ch.id], videoUrl: e.target.value },
                  }))
                }
                className="flex-1 border px-3 py-1.5 rounded text-xs"
              />
              <button
                onClick={() => handleAddLesson(ch.id)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-semibold whitespace-nowrap"
              >
                + Thêm bài học
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. QUẢN LÝ QUIZ & BÀI TEST */}
      <div className="pt-8 border-t">
        <h2 className="font-bold text-xl text-gray-900 mb-4">2. Quản lý Quiz & Bài kiểm tra trắc nghiệm</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* TẠO QUIZ */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Tạo bài Quiz mới</h3>
            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tiêu đề Quiz</label>
                <input
                  type="text"
                  placeholder="VD: Kiểm tra cuối khóa IELTS Band 7.0"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Điểm đạt (%)</label>
                  <input
                    type="number"
                    value={quizForm.passScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passScore: Number(e.target.value) })}
                    className="w-full border px-3 py-2 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full border px-3 py-2 rounded outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700">
                Tạo Quiz
              </button>
            </form>
          </div>

          {/* THÊM CÂU HỎI */}
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Thêm câu hỏi trắc nghiệm</h3>
            <form onSubmit={handleAddQuestion} className="space-y-2 text-xs">
              <select
                required
                value={questionForm.quizId}
                onChange={(e) => setQuestionForm({ ...questionForm, quizId: e.target.value })}
                className="w-full border px-3 py-1.5 rounded font-medium"
              >
                <option value="">-- Chọn bài Quiz --</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nội dung câu hỏi..."
                required
                value={questionForm.content}
                onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                className="w-full border px-3 py-1.5 rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Đáp án A"
                  required
                  value={questionForm.optA}
                  onChange={(e) => setQuestionForm({ ...questionForm, optA: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Đáp án B"
                  required
                  value={questionForm.optB}
                  onChange={(e) => setQuestionForm({ ...questionForm, optB: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Đáp án C"
                  value={questionForm.optC}
                  onChange={(e) => setQuestionForm({ ...questionForm, optC: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Đáp án D"
                  value={questionForm.optD}
                  onChange={(e) => setQuestionForm({ ...questionForm, optD: e.target.value })}
                  className="border px-2 py-1 rounded"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Đáp án đúng:</span>
                {["A", "B", "C", "D"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer">
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

              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
                + Lưu câu hỏi
              </button>
            </form>
          </div>
        </div>

        {/* DANH SÁCH QUIZ ĐÃ TẠO */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-800">Danh sách Quiz của khóa học ({quizzes.length})</h3>
          {quizzes.map((q) => (
            <div key={q.id} className="bg-white border rounded-xl p-4 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{q.title}</h4>
                  <p className="text-xs text-gray-500">
                    Thời gian: {q.timeLimitMinutes} phút · Điểm đạt: {q.passScore}% · {q.questions?.length || 0} câu hỏi
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuiz(q.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Xóa Quiz
                </button>
              </div>

              {/* LIST QUESTIONS */}
              <div className="mt-3 space-y-2 border-t pt-2">
                {(q.questions || []).map((quest, idx) => (
                  <div key={quest.id} className="text-xs bg-gray-50 p-2.5 rounded-lg">
                    <div className="font-semibold text-gray-800">
                      Câu {idx + 1}: {quest.content}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-gray-600">
                      {(quest.options || []).map((o) => (
                        <div key={o.id} className={o.isCorrect ? "text-green-600 font-bold" : ""}>
                          • {o.content} {o.isCorrect ? "✓ (Đúng)" : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}