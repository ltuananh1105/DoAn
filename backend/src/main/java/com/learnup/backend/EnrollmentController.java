package com.learnup.backend;

import com.learnup.backend.entity.Course;
import com.learnup.backend.entity.Enrollment;
import com.learnup.backend.entity.User;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.EnrollmentRepository;
import com.learnup.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.learnup.backend.security.CurrentUser;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class EnrollmentController {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CurrentUser currentUser;

    public EnrollmentController(EnrollmentRepository enrollmentRepository,
                                UserRepository userRepository,
                                CourseRepository courseRepository, CurrentUser currentUser) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.currentUser = currentUser;
    }

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<?> enroll(@PathVariable Long courseId, @RequestBody Map<String, Long> body) {
        Long studentId = body.get("studentId");
        if (studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Thiếu mã học viên"));
        }
        currentUser.requireStudentSelf(studentId);

        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (studentOpt.isEmpty() || !"student".equals(studentOpt.get().getRole())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Học viên không hợp lệ"));
        }
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Không tìm thấy khóa học"));
        }

        Course course = courseOpt.get();
        if (!"approved".equals(course.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "Khóa học chưa được mở đăng ký"));
        }
        if (course.getPrice() != null && course.getPrice() > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "Khóa học trả phí phải hoàn tất thanh toán trước"));
        }
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "Học viên đã đăng ký khóa học này"));
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(studentOpt.get());
        enrollment.setCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentRepository.save(enrollment));
    }

    @GetMapping("/students/{studentId}/enrollments")
    public List<Enrollment> getMyEnrollments(@PathVariable Long studentId) {
        currentUser.requireStudentSelf(studentId);
        return enrollmentRepository.findByStudentId(studentId);
    }
}
