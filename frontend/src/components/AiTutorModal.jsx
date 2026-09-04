import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const STORAGE_KEY = "learnup_ai_conversation";
const WELCOME_MESSAGE = {
  sender: "ai",
  text: "👋 Xin chào! Tôi là **LearnUp AI**. Tôi có thể giúp bạn luyện giao tiếp, sửa câu, giải thích ngữ pháp và học từ vựng tiếng Anh.",
};

function loadConversation() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function MessageText({ text }) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>
  );
}

export default function AiTutorModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState(loadConversation);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingStarted, setStreamingStarted] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customText, isRetry = false) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const lastUserIndex = messages.findLastIndex((message) => message.sender === "user");
    const newMessages = isRetry
      ? messages.slice(0, lastUserIndex + 1)
      : [...messages, { sender: "user", text: textToSend }];
    if (!isRetry) setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);
    setStreamingStarted(false);

    try {
      const response = await fetch(`${API_BASE}/ai/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });
      if (!response.ok || !response.body) {
        throw new Error("Trợ lý AI chưa thể trả lời lúc này.");
      }

      setMessages([...newMessages, { sender: "ai", text: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processEvent = (block) => {
        const eventType = block.split("\n").find((line) => line.startsWith("event:"))?.slice(6).trim() || "message";
        const dataText = block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("");
        if (!dataText) return;
        const data = JSON.parse(dataText);
        if (eventType === "error") throw new Error(data.message || "Gemini đang bận, vui lòng thử lại.");
        if (eventType === "message" && data.text) {
          setStreamingStarted(true);
          setMessages((current) => current.map((message, index) =>
            index === current.length - 1 ? { ...message, text: message.text + data.text } : message
          ));
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done }).replaceAll("\r\n", "\n");
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";
        blocks.filter(Boolean).forEach(processEvent);
        if (done) break;
      }
      if (buffer.trim()) processEvent(buffer);
    } catch (requestError) {
      setMessages((current) => {
        const last = current.at(-1);
        return last?.sender === "ai" && !last.text ? current.slice(0, -1) : current;
      });
      setError(requestError.message || "Không thể kết nối tới máy chủ AI.");
    } finally {
      setLoading(false);
      setStreamingStarted(false);
    }
  };

  const clearConversation = () => {
    if (loading) return;
    setMessages([WELCOME_MESSAGE]);
    setError("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="fixed bottom-20 right-5 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="px-4 py-3 bg-white border-b text-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">AI</div>
          <div>
            <div className="font-bold text-sm">LearnUp AI</div>
            <div className="text-[11px] text-slate-500">Trợ lý học tiếng Anh</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearConversation} title="Xóa cuộc trò chuyện" className="p-2 rounded-lg hover:bg-slate-100 text-xs text-slate-500">↻</button>
          <button onClick={onClose} aria-label="Đóng chatbox" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 h-[390px] overflow-y-auto space-y-3 bg-gray-50/70 text-sm" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[87%] px-3.5 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
              message.sender === "user"
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
            }`}>
              <MessageText text={message.text} />
            </div>
          </div>
        ))}
        {loading && !streamingStarted && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl border text-gray-500 flex items-center gap-2">
              <span className="flex gap-1"><i className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" /><i className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:120ms]" /><i className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:240ms]" /></span>
              Đang suy nghĩ
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
            <button onClick={() => handleSend([...messages].reverse().find((message) => message.sender === "user")?.text, true)} className="ml-2 font-bold underline">Thử lại</button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-3 py-2 bg-white border-t flex gap-1.5 overflow-x-auto text-[11px]">
          {["Sửa giúp tôi câu tiếng Anh", "Giải thích thì hiện tại hoàn thành", "Luyện hội thoại phỏng vấn"].map((prompt) => (
            <button key={prompt} onClick={() => handleSend(prompt)} className="px-2.5 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded-full whitespace-nowrap text-gray-600">
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(event) => { event.preventDefault(); handleSend(); }} className="p-3 bg-white border-t flex items-end gap-2">
        <textarea
          ref={inputRef}
          rows="1"
          maxLength="2000"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Hỏi về tiếng Anh..."
          className="flex-1 min-h-10 max-h-28 resize-y px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" disabled={loading || !input.trim()} className="h-10 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
          Gửi
        </button>
      </form>
    </div>
  );
}
