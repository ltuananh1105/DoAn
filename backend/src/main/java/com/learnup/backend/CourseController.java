package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Course;
import com.learnup.backend.repository.ChapterRepository;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.CategoryRepository;
import com.learnup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;

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
                .map(course -> chapterRepository.findByCourseId(id))
                .orElseGet(List::of);
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/chapters")
    public List<Chapter> getChaptersByCourseId(@PathVariable Long id) {
        return chapterRepository.findByCourseId(id);
    }

    @PostMapping("/{id}/chapters")
    public Chapter addChapterToCourse(@PathVariable Long id, @RequestBody Chapter chapter) {
        Course course = courseRepository.findById(id).orElseThrow();
        if (chapter.getTitle() == null || chapter.getTitle().isBlank()) throw new IllegalArgumentException("Tên chương không được để trống");
        chapter.setTitle(chapter.getTitle().trim());
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    @PostMapping
    public Object createCourse(@RequestBody Course course) {
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
}
