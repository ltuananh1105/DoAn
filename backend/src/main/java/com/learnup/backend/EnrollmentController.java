package com.learnup.backend;

import com.learnup.backend.entity.Course;
import com.learnup.backend.entity.Enrollment;
import com.learnup.backend.entity.User;
import com.learnup.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @PostMapping("/courses/{courseId}/enroll")
    public Enrollment enroll(@PathVariable Long courseId, @RequestBody Map<String, Long> body) {
        Long studentId = body.get("studentId");

        User student = new User();
        student.setId(studentId);

        Course course = new Course();
        course.setId(courseId);

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);
    }

    @GetMapping("/students/{studentId}/enrollments")
    public List<Enrollment> getMyEnrollments(@PathVariable Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }
}