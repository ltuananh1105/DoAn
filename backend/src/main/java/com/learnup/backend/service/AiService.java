package com.learnup.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AiService {

    // 1. Chat với Trợ lý AI
    public String chatWithAi(String userMessage) {
        String msg = userMessage.toLowerCase().trim();

        if (msg.contains("ielts") || msg.contains("band")) {
            return "🎯 **Lời khuyên luyện thi IELTS từ AI:**\n- **Writing Task 2:** Luôn lập dàn ý 4 đoạn (Intro, 2 Body, Conclusion) và sử dụng từ nối học thuật (Furthermore, In contrast, Consequently).\n- **Speaking:** Mở rộng câu trả lời bằng công thức A.R.E.A (Answer, Reason, Example, Alternative).\n- Bạn muốn tôi kiểm tra bài viết hay tạo câu hỏi luyện Speaking nào không?";
        }

        if (msg.contains("toeic") || msg.contains("nghe") || msg.contains("part 5")) {
            return "📘 **Mẹo luyện thi TOEIC cấp tốc:**\n- **Part 5:** Xác định ngay loại từ (Noun, Verb, Adj, Adv) trước khi đọc dịch nghĩa.\n- **Part 1 & 2:** Chú ý bẫy từ đồng âm và các đại từ nghi vấn (Who, Where, When).\n- Hãy thử làm bài test TOEIC trong mục Luyện tập nhé!";
        }

        if (msg.contains("ngữ pháp") || msg.contains("thì") || msg.contains("grammar")) {
            return "📚 **Cẩm nang Ngữ pháp Tiếng Anh:**\n- **Hiện tại hoàn thành (Present Perfect):** `S + have/has + V3/ed` (Dùng cho hành động bắt đầu trong quá khứ kéo dài đến hiện tại).\n- **Câu điều kiện loại 2:** `If + S + V2/ed, S + would/could + V-inf` (Giả định trái với hiện tại).\n- Bạn cần giải thích cấu trúc ngữ pháp nào cụ thể hơn không?";
        }

        if (msg.contains("từ vựng") || msg.contains("vocabulary")) {
            return "💡 **Phương pháp học từ vựng hiệu quả:**\n1. Học theo cụm từ (Collocations) thay vì học từ đơn lẻ.\n2. Áp dụng kỹ thuật Spaced Repetition (Lặp lại ngắt quãng).\n3. Đặt câu thực tế gắn liền với công việc hàng ngày của bạn.";
        }

        return "🤖 **Xin chào! Tôi là Trợ lý Học tập AI của LearnUp.**\nTôi có thể giúp bạn:\n1. Giải thích chi tiết ngữ pháp, từ vựng và bài tập tiếng Anh.\n2. Đưa ra lộ trình ôn thi IELTS, TOEIC, Giao tiếp công sở.\n3. **Tự động tạo bài Quiz trắc nghiệm** theo bất kỳ chủ đề nào bạn yêu cầu!\n\nBạn đang muốn học hay luyện tập phần nào hôm nay?";
    }

    // 2. Tự động sinh đề thi Quiz theo chủ đề & độ khó bằng AI
    public Map<String, Object> generateQuizWithAi(String topic, String level, int numQuestions) {
        String cleanTopic = (topic != null && !topic.trim().isEmpty()) ? topic.trim() : "Tiếng Anh Tổng Quát";
        String cleanLevel = (level != null && !level.trim().isEmpty()) ? level.trim() : "Intermediate";
        int count = Math.max(3, Math.min(numQuestions, 10));

        List<Map<String, Object>> questions = new ArrayList<>();

        if (cleanTopic.toLowerCase().contains("it") || cleanTopic.toLowerCase().contains("cntt") || cleanTopic.toLowerCase().contains("lập trình")) {
            questions.add(createGeneratedQuestion(
                    "In Agile Scrum, what is the main purpose of the \"Daily Standup\" meeting?",
                    "Quickly synchronize activities and report blockers (within 15 minutes).",
                    "Daily Standup giúp cả team đồng bộ tiến độ và chia sẻ các khó khăn (blockers) gặp phải.",
                    List.of("Writing detailed documentation", "Quickly synchronize activities and report blockers (within 15 minutes)", "Negotiating salaries", "Conducting annual code review"),
                    1
            ));
            questions.add(createGeneratedQuestion(
                    "Which HTTP status code indicates that a resource was \"Not Found\"?",
                    "404 Not Found",
                    "404 là mã chuẩn của HTTP khi không tìm thấy tài nguyên yêu cầu.",
                    List.of("200 OK", "500 Server Error", "404 Not Found", "301 Redirect"),
                    2
            ));
            questions.add(createGeneratedQuestion(
                    "Choose the correct phrase: \"Please review my pull request and ______ your feedback.\"",
                    "leave / provide",
                    "Trong môi trường phát triển phần mềm, cụm 'leave/provide feedback' được dùng phổ biến.",
                    List.of("leave / provide", "make out", "throw over", "do up"),
                    0
            ));
        } else if (cleanTopic.toLowerCase().contains("ielts") || cleanTopic.toLowerCase().contains("writing") || cleanTopic.toLowerCase().contains("reading")) {
            questions.add(createGeneratedQuestion(
                    "What is the recommended word count for IELTS Academic Writing Task 1?",
                    "At least 150 words",
                    "IELTS Writing Task 1 yêu cầu tối thiểu 150 từ, nên viết khoảng 160-180 từ.",
                    List.of("At least 150 words", "At least 250 words", "Maximum 100 words", "Exactly 200 words"),
                    0
            ));
            questions.add(createGeneratedQuestion(
                    "Which linking word shows a clear contrast between two arguments?",
                    "Nevertheless",
                    "'Nevertheless' mang nghĩa 'tuy nhiên/mặc dù vậy', biểu thị sự tương phản trang trọng.",
                    List.of("Furthermore", "In addition", "Nevertheless", "Consequently"),
                    2
            ));
            questions.add(createGeneratedQuestion(
                    "In IELTS Reading, what does \"Not Given\" strictly mean?",
                    "The information is impossible to verify from the passage text",
                    "Not Given nghĩa là văn bản không hề đề cập hoặc không đủ bằng chứng để khẳng định Đúng hay Sai.",
                    List.of("The statement contradicts the passage", "The statement is 100% false", "The information is impossible to verify from the passage text", "The passage mentions it vaguely"),
                    2
            ));
        } else if (cleanTopic.toLowerCase().contains("giao tiếp") || cleanTopic.toLowerCase().contains("công sở") || cleanTopic.toLowerCase().contains("business")) {
            questions.add(createGeneratedQuestion(
                    "How should you politely ask someone to repeat what they just said in a conference call?",
                    "\"Could you please repeat that? You were breaking up a bit.\"",
                    "Đây là mẫu câu chuẩn mực, lịch sự khi gặp sự cố đường truyền mạng trong cuộc họp.",
                    List.of("\"Say that again loud!\"", "\"Could you please repeat that? You were breaking up a bit.\"", "\"What is your problem?\"", "\"Speak better please.\""),
                    1
            ));
            questions.add(createGeneratedQuestion(
                    "Which idiom means \"to make a business decision or take immediate action\"?",
                    "Take the initiative",
                    "'Take the initiative' nghĩa là chủ động hành động/đưa ra quyết định trước.",
                    List.of("Beat around the bush", "Take the initiative", "Call it a day", "Bite the bullet"),
                    1
            ));
            questions.add(createGeneratedQuestion(
                    "What is the best closing phrase for a professional business proposal email?",
                    "\"I look forward to discussing this opportunity further with you.\"",
                    "Câu kết thúc chuyên nghiệp thể hiện mong muốn tiếp tục trao đổi hợp tác.",
                    List.of("\"See ya later!\"", "\"I look forward to discussing this opportunity further with you.\"", "\"Bye bye.\"", "\"Send money fast.\""),
                    1
            ));
        } else {
            // General / Grammar
            questions.add(createGeneratedQuestion(
                    "If she ______ harder, she would pass the exam with flying colors.",
                    "studied",
                    "Câu điều kiện loại 2 diễn tả điều kiện trái với hiện tại: If + S + V2/ed, S + would + V.",
                    List.of("studies", "studied", "had studied", "will study"),
                    1
            ));
            questions.add(createGeneratedQuestion(
                    "They have lived in this city ______ over ten years.",
                    "for",
                    "Dùng 'for' đi kèm khoảng thời gian (for ten years), dùng 'since' cho mốc thời gian.",
                    List.of("since", "for", "during", "at"),
                    1
            ));
            questions.add(createGeneratedQuestion(
                    "Neither the manager nor the employees ______ satisfied with the decision.",
                    "were",
                    "Quy tắc 'Neither... nor...': Động từ chia theo chủ ngữ gần nó nhất ('employees' số nhiều -> 'were').",
                    List.of("was", "were", "is", "has been"),
                    1
            ));
        }

        Map<String, Object> quizMap = new LinkedHashMap<>();
        quizMap.put("title", "AI Smart Quiz: " + cleanTopic + " (" + cleanLevel + ")");
        quizMap.put("topic", cleanTopic);
        quizMap.put("level", cleanLevel);
        quizMap.put("timeLimitMinutes", count * 2);
        quizMap.put("passScore", 80);
        quizMap.put("totalQuestions", questions.size());
        quizMap.put("questions", questions);
        return quizMap;
    }

    private Map<String, Object> createGeneratedQuestion(String content, String correctText, String explanation, List<String> optionTexts, int correctIndex) {
        List<Map<String, Object>> options = new ArrayList<>();
        for (int i = 0; i < optionTexts.size(); i++) {
            options.add(Map.of(
                    "id", (long) (i + 1),
                    "content", optionTexts.get(i),
                    "isCorrect", i == correctIndex
            ));
        }
        Map<String, Object> q = new LinkedHashMap<>();
        q.put("id", (long) (Math.random() * 100000));
        q.put("content", content);
        q.put("explanation", explanation);
        q.put("options", options);
        return q;
    }
}
