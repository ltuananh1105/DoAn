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
        return courseRepository.findByStatus("approved");
    }

    @GetMapping("/public/{id}")
    public Object getPublicCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .filter(course -> "approved".equals(course.getStatus()))
                .<Object>map(course -> course)
                .orElseGet(() -> Map.of("success", false, "message", "Không tìm thấy khóa học đang mở"));
    }

    @GetMapping("/public/{id}/chapters")
    public List<Chapter> getPublicCourseChapters(@PathVariable Long id) {
        return courseRepository.findById(id)
                .filter(course -> "approved".equals(course.getStatus()))
                .map(course -> chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(id))
                .orElseGet(List::of);
    }

    @GetMapping("/public/{id}/curriculum")
    public List<Map<String, Object>> getPublicCurriculum(@PathVariable Long id) {
        if (courseRepository.findById(id).filter(course -> "approved".equals(course.getStatus())).isEmpty()) return List.of();
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
        currentUser.requireCourseOwner(id);
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
        course.setStatus("pending");
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
        updatedCourse.setTeacher(course.getTeacher());
        String error = validateAndResolveCourse(updatedCourse);
        if (error != null) return Map.of("success", false, "message", error);
        course.setTitle(updatedCourse.getTitle());
        course.setDescription(updatedCourse.getDescription());
        course.setPrice(updatedCourse.getPrice());
        course.setTeacher(updatedCourse.getTeacher());
        course.setCategory(updatedCourse.getCategory());
        return courseRepository.save(course);
    }

    // Xóa khóa học
    @DeleteMapping("/{id}")
    public Object deleteCourse(@PathVariable Long id) {
        currentUser.requireCourseOwner(id);
        if (!courseRepository.existsById(id)) {
            return Map.of("success", false, "message", "Không tìm thấy khóa học");
        }
        courseRepository.deleteById(id);
        return Map.of("success", true, "message", "Đã xóa khóa học");
    }

    @PutMapping("/{id}/approve")
    public Course approveCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow();
        course.setStatus("approved");
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/reject")
    public Course rejectCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id).orElseThrow();
        course.setStatus("rejected");
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
}
