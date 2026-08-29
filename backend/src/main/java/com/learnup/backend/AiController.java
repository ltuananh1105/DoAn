package com.learnup.backend;

import com.learnup.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        String reply = aiService.chatWithAi(message);
        return Map.of("success", true, "reply", reply);
    }

    @PostMapping("/generate-quiz")
    public Map<String, Object> generateQuiz(@RequestBody Map<String, Object> body) {
        String topic = (String) body.getOrDefault("topic", "Tiếng Anh Tổng Quát");
        String level = (String) body.getOrDefault("level", "Intermediate");
        int count = body.containsKey("numQuestions") ? Integer.parseInt(body.get("numQuestions").toString()) : 5;

        Map<String, Object> generated = aiService.generateQuizWithAi(topic, level, count);
        return Map.of("success", true, "quiz", generated);
    }
}
