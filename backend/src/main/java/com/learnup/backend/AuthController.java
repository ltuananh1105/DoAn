package com.learnup.backend;

import com.learnup.backend.entity.User;
import com.learnup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Object login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return Map.of("success", false, "message", "Email không tồn tại");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            return Map.of("success", false, "message", "Sai mật khẩu");
        }

        return Map.of(
            "success", true,
            "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail(), "role", user.getRole())
        );
    }
}