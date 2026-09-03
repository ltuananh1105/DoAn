package com.learnup.backend;

import com.learnup.backend.service.AiService;
import com.learnup.backend.service.AiService.AiServiceException;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    public AiController(AiService aiService, ObjectMapper objectMapper) {
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, String>> messages = (List<Map<String, String>>) body.get("messages");
            if ((messages == null || messages.isEmpty()) && body.get("message") instanceof String message) {
                messages = List.of(Map.of("sender", "user", "text", message));
            }
            String reply = aiService.chatWithAi(messages);
            return ResponseEntity.ok(Map.of("success", true, "reply", reply));
        } catch (AiServiceException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("success", false, "message", exception.getMessage()));
        } catch (Exception exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Dữ liệu hội thoại không hợp lệ."));
        }
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<StreamingResponseBody> streamChat(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, String>> messages = (List<Map<String, String>>) body.get("messages");

        StreamingResponseBody stream = outputStream -> {
            try {
                aiService.streamChatWithAi(messages, text -> {
                    try {
                        String event = "data: " + objectMapper.writeValueAsString(Map.of("text", text)) + "\n\n";
                        outputStream.write(event.getBytes(StandardCharsets.UTF_8));
                        outputStream.flush();
                    } catch (Exception exception) {
                        throw new AiServiceException("Kết nối streaming đã bị gián đoạn.");
                    }
                });
                outputStream.write("event: done\ndata: {}\n\n".getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            } catch (Exception exception) {
                String event = "event: error\ndata: " + objectMapper.writeValueAsString(
                        Map.of("message", exception.getMessage() != null ? exception.getMessage() : "Lỗi Gemini")) + "\n\n";
                outputStream.write(event.getBytes(StandardCharsets.UTF_8));
                outputStream.flush();
            }
        };

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .header("Cache-Control", "no-cache")
                .body(stream);
    }
}
