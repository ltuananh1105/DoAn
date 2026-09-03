package com.learnup.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {
    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(ObjectMapper objectMapper, @Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String createToken(Long id, String email, String role) {
        long now = Instant.now().getEpochSecond();
        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("sub", email); claims.put("userId", id); claims.put("role", role);
        claims.put("iat", now); claims.put("exp", now + expirationSeconds);
        try {
            String header = encode(objectMapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            String payload = encode(objectMapper.writeValueAsBytes(claims));
            return header + "." + payload + "." + sign(header + "." + payload);
        } catch (Exception exception) {
            throw new IllegalStateException("Không thể tạo access token", exception);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> verify(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !constantTimeEquals(parts[2], sign(parts[0] + "." + parts[1]))) return null;
            Map<String, Object> claims = objectMapper.readValue(Base64.getUrlDecoder().decode(parts[1]), Map.class);
            Number exp = (Number) claims.get("exp");
            return exp != null && exp.longValue() > Instant.now().getEpochSecond() ? claims : null;
        } catch (Exception exception) {
            return null;
        }
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return encode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private String encode(byte[] value) { return Base64.getUrlEncoder().withoutPadding().encodeToString(value); }
    private boolean constantTimeEquals(String left, String right) {
        return java.security.MessageDigest.isEqual(left.getBytes(StandardCharsets.US_ASCII), right.getBytes(StandardCharsets.US_ASCII));
    }
}
