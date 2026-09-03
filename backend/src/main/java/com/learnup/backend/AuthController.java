package com.learnup.backend;

import com.learnup.backend.entity.User;
import com.learnup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Hàm dùng chung: chuyển User entity -> Map, loại bỏ password
    private Map<String, Object> toUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole());
        userInfo.put("dateOfBirth", user.getDateOfBirth());
        userInfo.put("phone", user.getPhone());
        userInfo.put("occupation", user.getOccupation());
        userInfo.put("country", user.getCountry());
        userInfo.put("province", user.getProvince());
        return userInfo;
    }

    @PostMapping("/register")
    public Object register(@RequestBody User user) {
        String name = user.getName() == null ? "" : user.getName().trim();
        String email = user.getEmail() == null ? "" : user.getEmail().trim().toLowerCase();
        String password = user.getPassword() == null ? "" : user.getPassword();
        String role = user.getRole() == null ? "student" : user.getRole().toLowerCase();
        if (name.isEmpty() || email.isEmpty() || password.length() < 6) return Map.of("success", false, "message", "Thông tin đăng ký không hợp lệ");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) return Map.of("success", false, "message", "Email không hợp lệ");
        if (!Set.of("student", "teacher").contains(role)) return Map.of("success", false, "message", "Vai trò không hợp lệ");
        if (userRepository.findByEmail(email).isPresent()) return Map.of("success", false, "message", "Email đã được sử dụng");
        user.setName(name); user.setEmail(email); user.setRole(role);
        User savedUser = userRepository.save(user);
        return toUserInfo(savedUser);
    }

    @PostMapping("/login")
    public Object login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email") == null ? "" : loginRequest.get("email").trim().toLowerCase();
        String password = loginRequest.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return Map.of("success", false, "message", "Email không tồn tại");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            return Map.of("success", false, "message", "Sai mật khẩu");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", toUserInfo(user));
        return response;
    }
}
