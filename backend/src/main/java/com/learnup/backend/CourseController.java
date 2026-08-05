package com.learnup.backend;

import com.learnup.backend.entity.Course;
import com.learnup.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        course.setStatus("pending");
        return courseRepository.save(course);
    }

    // Sửa thông tin khóa học (không đổi status qua API này)
    @PutMapping("/{id}")
    public Object updateCourse(@PathVariable Long id, @RequestBody Course updatedCourse) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        if (optionalCourse.isEmpty()) {
            return Map.of("success", false, "message", "Không tìm thấy khóa học");
        }

        Course course = optionalCourse.get();
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
}