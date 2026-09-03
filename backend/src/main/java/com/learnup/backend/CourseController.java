package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Course;
import com.learnup.backend.repository.ChapterRepository;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.CategoryRepository;
import com.learnup.backend.repository.UserRepository;
import com.learnup.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.Set;
import com.learnup.backend.security.CurrentUser;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private CurrentUser currentUser;
    @Autowired private LessonRepository lessonRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/public")
    public List<Course> getPublicCourses() {
        return courseRepository.findAll().stream().filter(this::isPublished).toList();
    }

    @GetMapping("/public/{id}")
    public Object getPublicCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .filter(this::isPublished)
                .<Object>map(course -> course)
                .orElseGet(() -> Map.of("success", false, "message", "Không tìm thấy khóa học đang mở"));
    }

    @GetMapping("/public/{id}/chapters")
    public List<Chapter> getPublicCourseChapters(@PathVariable Long id) {
        return courseRepository.findById(id)
                .filter(this::isPublished)
                .map(course -> chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(id))
                .orElseGet(List::of);
    }

    @GetMapping("/public/{id}/curriculum")
    public List<Map<String, Object>> getPublicCurriculum(@PathVariable Long id) {
        if (courseRepository.findById(id).filter(this::isPublished).isEmpty()) return List.of();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Chapter chapter : chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(id)) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", chapter.getId()); item.put("title", chapter.getTitle()); item.put("orderIndex", chapter.getOrderIndex());
            item.put("lessons", lessonRepository.findByChapterIdOrderByOrderIndexAscIdAsc(chapter.getId()).stream()
                    .map(lesson -> Map.<String, Object>of("id", lesson.getId(), "title", lesson.getTitle())).toList());
            result.add(item);
        }
        return result;
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        currentUser.requireCourseAccess(id);
        return courseRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/chapters")
    public List<Chapter> getChaptersByCourseId(@PathVariable Long id) {
        currentUser.requireCourseAccess(id);
        return chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(id);
    }

    @PostMapping("/{id}/chapters")
    public Chapter addChapterToCourse(@PathVariable Long id, @RequestBody Chapter chapter) {
        currentUser.requireCourseEditable(id);
        Course course = courseRepository.findById(id).orElseThrow();
        if (chapter.getTitle() == null || chapter.getTitle().isBlank()) throw new IllegalArgumentException("Tên chương không được để trống");
        chapter.setTitle(chapter.getTitle().trim());
        chapter.setOrderIndex(nextChapterIndex(id));
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    @PostMapping
    public Object createCourse(@RequestBody Course course) {
        if (course.getTeacher() != null) currentUser.requireTeacher(course.getTeacher().getId());
        String error = validateAndResolveCourse(course);
        if (error != null) return Map.of("success", false, "message", error);
        course.setStatus("draft");
        course.setReviewNote(null);
        course.setSubmittedAt(null);
        course.setReviewedAt(null);
        return courseRepository.save(course);
    }

    // Sửa thông tin khóa học
    @PutMapping("/{id}")
    public Object updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy khóa học");
        }

        Course course = optionalCourse.get();
        currentUser.requireCourseOwner(id);
        if (!Set.of("draft", "rejected").contains(normalizedStatus(course))) {
            return Map.of("success", false, "message", "Chỉ được sửa khóa học ở trạng thái bản nháp hoặc bị từ chối");
        }
        updatedCourse.setTeacher(course.getTeacher());
        String error = validateAndResolveCourse(updatedCourse);
        if (error != null) return Map.of("success", false, "message", error);
        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setPrice(updatedCourse.getPrice());
        course.setTeacher(updatedCourse.getTeacher());
        course.setCategory(updatedCourse.getCategory());
        if ("rejected".equals(normalizedStatus(course))) {
            course.setStatus("draft");
            course.setReviewNote(null);
            course.setReviewedAt(null);
        }
        return courseRepository.save(course);
    }

    // Xóa khóa học
    @DeleteMapping("/{id}")
    public Object deleteCourse(@PathVariable Long id) {
        currentUser.requireCourseOwner(id);
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return Map.of("success", false, "message", "Không tìm thấy khóa học");
        }
        if (!"draft".equals(normalizedStatus(course))) {
            return Map.of("success", false, "message", "Chỉ được xóa khóa học đang ở trạng thái bản nháp");
        }
        if (!chapterRepository.findByCourseId(id).isEmpty()) {
            return Map.of("success", false, "message", "Hãy xóa nội dung khóa học trước khi xóa bản nháp");
        }
        courseRepository.deleteById(id);
        return Map.of("success", true, "message", "Đã xóa khóa học");
    }

    @PutMapping("/{id}/submit")
    public Object submitCourse(@PathVariable Long id) {
        currentUser.requireCourseOwner(id);
        Course course = courseRepository.findById(id).orElseThrow();
        if (!Set.of("draft", "rejected").contains(normalizedStatus(course))) {
            return Map.of("success", false, "message", "Khóa học không ở trạng thái có thể gửi duyệt");
        }
        List<Chapter> chapters = chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(id);
        if (chapters.isEmpty()) return Map.of("success", false, "message", "Khóa học cần có ít nhất một chương trước khi gửi duyệt");
        boolean hasEmptyChapter = chapters.stream().anyMatch(chapter ->
                lessonRepository.findByChapterIdOrderByOrderIndexAscIdAsc(chapter.getId()).isEmpty());
        if (hasEmptyChapter) return Map.of("success", false, "message", "Mỗi chương cần có ít nhất một bài học");
        course.setStatus("pending");
        course.setReviewNote(null);
        course.setSubmittedAt(LocalDateTime.now());
        course.setReviewedAt(null);
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/approve")
    public Object approveCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow();
        if (!"pending".equals(normalizedStatus(course))) return Map.of("success", false, "message", "Chỉ được duyệt khóa học đang chờ duyệt");
        course.setStatus("published");
        course.setReviewNote(null);
        course.setReviewedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/reject")
    public Object rejectCourse(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Course course = courseRepository.findById(id).orElseThrow();
        if (!"pending".equals(normalizedStatus(course))) return Map.of("success", false, "message", "Chỉ được từ chối khóa học đang chờ duyệt");
        String reason = body == null || body.get("reason") == null ? "" : body.get("reason").trim();
        if (reason.length() < 10) return Map.of("success", false, "message", "Lý do từ chối phải có ít nhất 10 ký tự");
        course.setStatus("rejected");
        course.setReviewNote(reason);
        course.setReviewedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/suspend")
    public Object suspendCourse(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Course course = courseRepository.findById(id).orElseThrow();
        if (!isPublished(course)) return Map.of("success", false, "message", "Chỉ được đình chỉ khóa học đang xuất bản");
        String reason = body.get("reason") == null ? "" : body.get("reason").trim();
        if (reason.length() < 10) return Map.of("success", false, "message", "Lý do đình chỉ phải có ít nhất 10 ký tự");
        course.setStatus("suspended"); course.setReviewNote(reason); course.setReviewedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/restore")
    public Object restoreCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow();
        if (!Set.of("suspended", "archived").contains(normalizedStatus(course))) {
            return Map.of("success", false, "message", "Khóa học không ở trạng thái có thể khôi phục");
        }
        course.setStatus("published"); course.setReviewNote(null); course.setReviewedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/archive")
    public Object archiveCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow();
        if ("pending".equals(normalizedStatus(course))) return Map.of("success", false, "message", "Không thể lưu trữ khóa học đang chờ duyệt");
        if (!currentUser.isAdmin()) currentUser.requireCourseOwner(id);
        course.setStatus("archived"); course.setReviewedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    private String validateAndResolveCourse(Course course) {
        if (course.getTitle() == null || course.getTitle().isBlank()) return "Tên khóa học không được để trống";
        if (course.getDescription() == null || course.getDescription().isBlank()) return "Mô tả khóa học không được để trống";
        if (course.getPrice() == null || !Double.isFinite(course.getPrice()) || course.getPrice() < 0) return "Giá khóa học không hợp lệ";
        if (course.getTeacher() == null || course.getTeacher().getId() == null) return "Thiếu giáo viên phụ trách";
        var teacher = userRepository.findById(course.getTeacher().getId());
        if (teacher.isEmpty() || !"teacher".equalsIgnoreCase(teacher.get().getRole())) return "Giáo viên không hợp lệ";
        if (course.getCategory() == null || course.getCategory().getId() == null) return "Thiếu danh mục khóa học";
        var category = categoryRepository.findById(course.getCategory().getId());
        if (category.isEmpty()) return "Danh mục không tồn tại";
        course.setTitle(course.getTitle().trim());
        course.setDescription(course.getDescription().trim());
        course.setTeacher(teacher.get());
        course.setCategory(category.get());
        return null;
    }

    private int nextChapterIndex(Long courseId) {
        return chapterRepository.findByCourseId(courseId).stream()
                .map(Chapter::getOrderIndex).filter(Objects::nonNull).max(Integer::compareTo).orElse(0) + 1;
    }

    private boolean isPublished(Course course) {
        return Set.of("published", "approved").contains(normalizedStatus(course));
    }

    private String normalizedStatus(Course course) {
        return course.getStatus() == null ? "draft" : course.getStatus().toLowerCase();
    }
}
