package com.learnup.backend;

import com.learnup.backend.entity.User;
import com.learnup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Lấy danh sách user, có thể lọc theo role (?role=student / teacher)
    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.findByRole(role);
        }
        return userRepository.findAll();
    }

    // Cập nhật hồ sơ — chỉ set field nào có gửi lên (dùng chung cho cả user tự sửa và admin sửa)
    @PutMapping("/{id}")
    public Object updateProfile(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }

        User user = optionalUser.get();
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("role")) user.setRole(body.get("role"));
        if (body.containsKey("dateOfBirth")) user.setDateOfBirth(body.get("dateOfBirth"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("occupation")) user.setOccupation(body.get("occupation"));
        if (body.containsKey("country")) user.setCountry(body.get("country"));
        if (body.containsKey("province")) user.setProvince(body.get("province"));
        if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
    user.setPassword(body.get("password"));
}
        userRepository.save(user);

        return Map.of("success", true, "user", user);
    }

    // Xóa user (dùng cho Admin)
    @DeleteMapping("/{id}")
    public Object deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }
        userRepository.deleteById(id);
        return Map.of("success", true, "message", "Đã xóa người dùng");
    }

    // Đổi mật khẩu
    @PutMapping("/{id}/password")
    public Object changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }

        User user = optionalUser.get();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!user.getPassword().equals(currentPassword)) {
            return Map.of("success", false, "message", "Mật khẩu hiện tại không đúng");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return Map.of("success", true, "message", "Đổi mật khẩu thành công");
    }
}