package com.learnup.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AiService {

    // Chat với Trợ lý Học tập AI
    public String chatWithAi(String userMessage) {
        String msg = userMessage.toLowerCase().trim();

        if (msg.contains("ielts") || msg.contains("band")) {
            return "🎯 **Lời khuyên luyện thi IELTS từ AI Tutor:**\n- **Writing Task 2:** Luôn lập dàn ý 4 đoạn (Intro, 2 Body, Conclusion) và sử dụng từ nối học thuật (Furthermore, In contrast, Consequently).\n- **Speaking:** Mở rộng câu trả lời bằng công thức A.R.E.A (Answer, Reason, Example, Alternative).\n- Bạn cần tôi hướng dẫn phần kỹ năng nào chi tiết hơn không?";
        }

        if (msg.contains("toeic") || msg.contains("nghe") || msg.contains("part 5")) {
            return "📘 **Mẹo luyện thi TOEIC cấp tốc:**\n- **Part 5:** Xác định ngay loại từ (Danh, Động, Tính, Trạng) trước khi dịch toàn bộ câu.\n- **Part 1 & 2:** Chú ý bẫy từ đồng âm và các từ để hỏi (Who, Where, When).\n- Bạn hãy vào mục Bài kiểm tra của khóa TOEIC để làm bài luyện tập nhé!";
        }

        if (msg.contains("ngữ pháp") || msg.contains("thì") || msg.contains("grammar")) {
            return "📚 **Cẩm nang Ngữ pháp Tiếng Anh:**\n- **Hiện tại hoàn thành (Present Perfect):** `S + have/has + V3/ed` (Hành động bắt đầu trong quá khứ kéo dài đến hiện tại).\n- **Câu điều kiện loại 2:** `If + S + V2/ed, S + would/could + V-inf` (Giả định trái với hiện tại).\n- Bạn cần giải thích cấu trúc ngữ pháp nào cụ thể hơn không?";
        }

        if (msg.contains("từ vựng") || msg.contains("vocabulary")) {
            return "💡 **Phương pháp ghi nhớ từ vựng hiệu quả:**\n1. Học theo cụm từ (Collocations) thay vì từ đơn lẻ.\n2. Áp dụng kỹ thuật Spaced Repetition (Lặp lại ngắt quãng).\n3. Đặt câu thực tế gắn liền với ngữ cảnh làm việc/học tập của bạn.";
        }

        return "🤖 **Xin chào! Tôi là Trợ lý Học tập AI của LearnUp.**\nTôi có thể hỗ trợ bạn:\n1. Giải đáp chi tiết các thắc mắc về ngữ pháp, từ vựng và bài tập tiếng Anh.\n2. Đưa ra mẹo và chiến thuật làm bài thi IELTS, TOEIC, Giao tiếp công sở.\n3. Hướng dẫn lộ trình học tập tối ưu trên nền tảng LearnUp.\n\nBạn đang muốn tìm hiểu nội dung nào hôm nay?";
    }
}
