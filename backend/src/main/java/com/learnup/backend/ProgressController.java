package com.learnup.backend;

import com.learnup.backend.entity.Lesson;
import com.learnup.backend.entity.LessonProgress;
import com.learnup.backend.entity.User;
import com.learnup.backend.repository.EnrollmentRepository;
import com.learnup.backend.repository.LessonProgressRepository;
import com.learnup.backend.repository.LessonRepository;
import com.learnup.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ProgressController(LessonProgressRepository lessonProgressRepository,
                              LessonRepository lessonRepository,
                              UserRepository userRepository,
                              EnrollmentRepository enrollmentRepository) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping("/student/{studentId}")
    public List<LessonProgress> getStudentProgress(@PathVariable Long studentId) {
        return lessonProgressRepository.findByStudentId(studentId);
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLessonProgress(@RequestBody Map<String, Object> body) {
        Long studentId = parseId(body.get("studentId"));
        Long lessonId = parseId(body.get("lessonId"));
        if (studentId == null || lessonId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Mã học viên và bài học không hợp lệ"));
        }

        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
        if (studentOpt.isEmpty() || !"student".equals(studentOpt.get().getRole())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Học viên không hợp lệ"));
        }
        if (lessonOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Không tìm thấy bài học"));
        }

        Lesson lesson = lessonOpt.get();
        Long courseId = lesson.getChapter().getCourse().getId();
        if (!enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "Học viên chưa đăng ký khóa học này"));
        }

        LessonProgress progress = lessonProgressRepository.findByStudentIdAndLessonId(studentId, lessonId)
                .orElseGet(() -> createProgress(studentOpt.get(), lesson));
        progress.setIsCompleted(!Boolean.TRUE.equals(progress.getIsCompleted()));
        LessonProgress saved = lessonProgressRepository.save(progress);
        return ResponseEntity.ok(Map.of("success", true, "isCompleted", saved.getIsCompleted()));
    }

    private LessonProgress createProgress(User student, Lesson lesson) {
        LessonProgress progress = new LessonProgress();
        progress.setStudent(student);
        progress.setLesson(lesson);
        progress.setIsCompleted(false);
        return progress;
    }

    private Long parseId(Object value) {
        if (value == null) return null;
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException exception) {
            return null;
        }
    }
}
