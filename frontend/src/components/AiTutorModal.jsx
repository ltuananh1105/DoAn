import { useState } from "react";

export default function AiTutorModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Xin chào! Tôi là **Trợ lý AI LearnUp**. Bạn cần hỗ trợ giải thích bài học, hỏi ngữ pháp, hay muốn **tôi tự động tạo đề Quiz luyện tập** theo chủ đề?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMsgs);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { sender: "ai", text: data.reply || "Xin lỗi, tôi chưa hiểu ý bạn." }]);
    } catch (e) {
      setMessages([
        ...newMsgs,
        { sender: "ai", text: "⚠️ Đã xảy ra lỗi kết nối tới máy chủ AI. Vui lòng thử lại sau ít phút." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* HEADER */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Trợ Lý Học Tập AI</div>
            <div className="text-[11px] text-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Sẵn sàng hỗ trợ 24/7
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CHAT MESSAGES */}
      <div className="p-4 h-80 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-2xs ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border text-gray-400 text-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              AI đang soạn câu trả lời...
            </div>
          </div>
        )}
      </div>

      {/* QUICK PROMPTS */}
      <div className="px-3 py-2 bg-white border-t flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() => handleSend("Mẹo đạt IELTS Band 7.0+")}
          className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full whitespace-nowrap text-gray-600 transition"
        >
          🎯 Mẹo IELTS 7.0+
        </button>
        <button
          onClick={() => handleSend("Bí quyết làm Part 5 TOEIC")}
          className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full whitespace-nowrap text-gray-600 transition"
        >
          📘 Mẹo TOEIC
        </button>
        <button
          onClick={() => handleSend("Giải thích thì Hiện tại hoàn thành")}
          className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full whitespace-nowrap text-gray-600 transition"
        >
          📚 Ngữ pháp
        </button>
      </div>

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi trợ lý AI mọi thứ..."
          className="flex-1 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
