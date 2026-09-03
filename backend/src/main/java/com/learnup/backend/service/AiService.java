package com.learnup.backend.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Stream;

@Service
public class AiService {
    private static final String SYSTEM_INSTRUCTION = """
            Bạn là LearnUp AI, trợ lý học tiếng Anh thân thiện cho người Việt.
            Hãy trả lời chính xác, dễ hiểu và ưu tiên ví dụ tiếng Anh kèm giải thích tiếng Việt.
            Khi sửa câu tiếng Anh, nêu câu đã sửa và giải thích ngắn gọn lỗi sai.
            Khi câu hỏi quá rộng, hãy hỏi lại để làm rõ. Không tự nhận là giáo viên.
            Không tạo hoặc quản lý quiz; bạn chỉ hỗ trợ học tập qua hội thoại.
            Trình bày gọn, dùng Markdown đơn giản khi cần.
            """;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;

    public AiService(ObjectMapper objectMapper,
                     @Value("${gemini.api.key:}") String apiKey,
                     @Value("${gemini.model:gemini-3.5-flash-lite}") String model) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    }

    public String chatWithAi(List<Map<String, String>> conversation) {
        validateConversation(conversation);

        try {
            Map<String, Object> requestBody = buildRequestBody(conversation);
            HttpRequest request = buildRequest(requestBody, "generateContent");
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new AiServiceException(readError(response.body(), response.statusCode()));
            }

            String reply = extractText(objectMapper.readTree(response.body()));
            if (reply.isEmpty()) {
                throw new AiServiceException("Gemini không trả về nội dung. Yêu cầu có thể đã bị bộ lọc an toàn chặn.");
            }
            return reply.trim();
        } catch (AiServiceException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new AiServiceException("Yêu cầu tới Gemini đã bị gián đoạn.");
        } catch (Exception exception) {
            throw new AiServiceException("Không thể kết nối tới Gemini. Vui lòng thử lại sau.");
        }
    }

    public void streamChatWithAi(List<Map<String, String>> conversation, Consumer<String> onText) {
        validateConversation(conversation);

        try {
            Map<String, Object> requestBody = buildRequestBody(conversation);
            HttpRequest request = buildRequest(requestBody, "streamGenerateContent?alt=sse");
            HttpResponse<Stream<String>> response = httpClient.send(request, HttpResponse.BodyHandlers.ofLines());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String errorBody;
                try (Stream<String> lines = response.body()) {
                    errorBody = String.join("", lines.toList());
                }
                throw new AiServiceException(readError(errorBody, response.statusCode()));
            }

            boolean[] receivedText = {false};
            try (Stream<String> lines = response.body()) {
                lines.filter(line -> line.startsWith("data:"))
                        .map(line -> line.substring(5).trim())
                        .filter(line -> !line.isEmpty())
                        .forEach(data -> {
                            try {
                                String text = extractText(objectMapper.readTree(data));
                                if (!text.isEmpty()) {
                                    receivedText[0] = true;
                                    onText.accept(text);
                                }
                            } catch (Exception exception) {
                                throw new AiServiceException("Không thể đọc phản hồi streaming từ Gemini.");
                            }
                        });
            }
            if (!receivedText[0]) {
                throw new AiServiceException("Gemini không trả về nội dung. Yêu cầu có thể đã bị bộ lọc an toàn chặn.");
            }
        } catch (AiServiceException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new AiServiceException("Yêu cầu tới Gemini đã bị gián đoạn.");
        } catch (Exception exception) {
            throw new AiServiceException("Không thể kết nối tới Gemini. Vui lòng thử lại sau.");
        }
    }

    private void validateConversation(List<Map<String, String>> conversation) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiServiceException("Chưa cấu hình GEMINI_API_KEY cho backend.");
        }
        if (conversation == null || conversation.isEmpty()) {
            throw new AiServiceException("Nội dung trò chuyện không được để trống.");
        }
    }

    private Map<String, Object> buildRequestBody(List<Map<String, String>> conversation) {
        List<Map<String, Object>> contents = new ArrayList<>();
        int fromIndex = Math.max(0, conversation.size() - 10);
        for (Map<String, String> message : conversation.subList(fromIndex, conversation.size())) {
            String content = message.getOrDefault("text", "").trim();
            if (content.isEmpty()) continue;
            String role = "ai".equals(message.get("sender")) ? "model" : "user";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", content))));
        }

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("system_instruction", Map.of("parts", List.of(Map.of("text", SYSTEM_INSTRUCTION))));
        requestBody.put("contents", contents);
        requestBody.put("generationConfig", Map.of(
                "maxOutputTokens", 600,
                "thinkingConfig", Map.of("thinkingLevel", "MINIMAL")));
        return requestBody;
    }

    private HttpRequest buildRequest(Map<String, Object> requestBody, String action) throws Exception {
        return HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":" + action))
                .timeout(Duration.ofSeconds(45))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();
    }

    private String extractText(JsonNode response) {
        JsonNode parts = response.path("candidates").path(0).path("content").path("parts");
        StringBuilder text = new StringBuilder();
        for (JsonNode part : parts) {
            if (part.path("text").isTextual()) text.append(part.path("text").asText());
        }
        return text.toString();
    }

    private String readError(String body, int statusCode) {
        try {
            JsonNode error = objectMapper.readTree(body).path("error").path("message");
            if (error.isTextual()) return error.asText();
        } catch (Exception ignored) {
            // Dùng thông báo chung nếu Gemini không trả JSON hợp lệ.
        }
        return "Gemini trả về lỗi " + statusCode;
    }

    public static class AiServiceException extends RuntimeException {
        public AiServiceException(String message) { super(message); }
    }
}
