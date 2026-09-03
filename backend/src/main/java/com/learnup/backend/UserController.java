package com.learnup.backend;

import com.learnup.backend.entity.User;
import com.learnup.backend.repository.UserRepository;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import java.util.Set;
import com.learnup.backend.security.CurrentUser;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private QuizResultRepository quizResultRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private CurrentUser currentUser;

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
        currentUser.requireSelf(id);
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }

        User user = optionalUser.get();
        if (body.containsKey("name")) {
            String name = body.get("name") == null ? "" : body.get("name").trim();
            if (name.isEmpty()) return Map.of("success", false, "message", "Tên không được để trống");
            user.setName(name);
        }
        if (body.containsKey("email")) {
            String email = body.get("email") == null ? "" : body.get("email").trim().toLowerCase();
            if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                return Map.of("success", false, "message", "Email không hợp lệ");
            }
            Optional<User> owner = userRepository.findByEmail(email);
            if (owner.isPresent() && !owner.get().getId().equals(id)) {
                return Map.of("success", false, "message", "Email đã được sử dụng");
            }
            user.setEmail(email);
        }
        if (body.containsKey("role")) {
            if (!currentUser.isAdmin()) return Map.of("success", false, "message", "Chỉ Admin được thay đổi vai trò");
            String role = body.get("role") == null ? "" : body.get("role").toLowerCase();
            if (!Set.of("student", "teacher", "admin").contains(role)) {
                return Map.of("success", false, "message", "Vai trò không hợp lệ");
            }
            user.setRole(role);
        }
        if (body.containsKey("dateOfBirth")) user.setDateOfBirth(body.get("dateOfBirth"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("occupation")) user.setOccupation(body.get("occupation"));
        if (body.containsKey("country")) user.setCountry(body.get("country"));
        if (body.containsKey("province")) user.setProvince(body.get("province"));
        userRepository.save(user);

        return Map.of("success", true, "user", user);
    }

    // Xóa user (dùng cho Admin)
    @DeleteMapping("/{id}")
    public Object deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }
        if (courseRepository.existsByTeacherId(id)) {
            return Map.of("success", false, "message", "Không thể xóa giáo viên đang có khóa học");
        }
        if (enrollmentRepository.existsByStudentId(id) || orderRepository.existsByStudentId(id)
                || lessonProgressRepository.existsByStudentId(id) || quizResultRepository.existsByStudentId(id)) {
            return Map.of("success", false, "message", "Không thể xóa học viên đã có dữ liệu học tập hoặc thanh toán");
        }
        userRepository.deleteById(id);
        return Map.of("success", true, "message", "Đã xóa người dùng");
    }

    // Đổi mật khẩu
    @PutMapping("/{id}/password")
    public Object changePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        currentUser.requireSelf(id);
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy người dùng");
        }

        User user = optionalUser.get();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        boolean validPassword = user.getPassword() != null && user.getPassword().startsWith("$2")
                ? passwordEncoder.matches(currentPassword, user.getPassword())
                : Objects.equals(user.getPassword(), currentPassword);
        if (!validPassword) {
            return Map.of("success", false, "message", "Mật khẩu hiện tại không đúng");
        }

        if (newPassword == null || newPassword.length() < 6) {
            return Map.of("success", false, "message", "Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return Map.of("success", true, "message", "Đổi mật khẩu thành công");
    }
}
