package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import com.learnup.backend.security.CurrentUser;

@RestController
@RequestMapping("/api/teacher/{teacherId}")
public class TeacherManagementController {

    @Autowired private CourseRepository courseRepository;
    @Autowired private ChapterRepository chapterRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private QuizResultRepository quizResultRepository;
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuestionOptionRepository questionOptionRepository;
    @Autowired private CurrentUser currentUser;

    // ===================== COURSES =====================

    @GetMapping("/courses-detail")
    public List<Map<String, Object>> getTeacherCourses(@PathVariable Long teacherId) {
        currentUser.requireTeacher(teacherId);
        List<Course> courses = courseRepository.findByTeacherId(teacherId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Course c : courses) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", c.getId());
            map.put("title", c.getTitle());
            map.put("description", c.getDescription());
            map.put("price", c.getPrice());
            map.put("status", c.getStatus());
            map.put("reviewNote", c.getReviewNote());
            map.put("submittedAt", c.getSubmittedAt());
            map.put("reviewedAt", c.getReviewedAt());
            map.put("category", c.getCategory());
            long enrollCount = enrollmentRepository.countByCourseId(c.getId());
            map.put("enrollmentCount", enrollCount);
            result.add(map);
        }
        return result;
    }

    @PutMapping("/courses/{courseId}/toggle-visibility")
    public Object toggleVisibility(@PathVariable Long teacherId, @PathVariable Long courseId) {
        currentUser.requireTeacher(teacherId);
        currentUser.requireCourseOwner(courseId);
        Optional<Course> opt = courseRepository.findById(courseId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy khóa học");
        Course c = opt.get();
        if ("archived".equals(c.getStatus())) {
            return Map.of("success", false, "message", "Khóa học đã lưu trữ cần Admin khôi phục");
        } else if ("published".equals(c.getStatus()) || "approved".equals(c.getStatus())) {
            c.setStatus("archived");
        } else {
            return Map.of("success", false, "message", "Chỉ có thể lưu trữ khóa học đang xuất bản");
        }
        courseRepository.save(c);
        return Map.of("success", true, "newStatus", c.getStatus());
    }

    @DeleteMapping("/courses/{courseId}")
    @Transactional
    public Object deleteCourse(@PathVariable Long teacherId, @PathVariable Long courseId) {
        currentUser.requireTeacher(teacherId);
        currentUser.requireCourseOwner(courseId);
        Optional<Course> opt = courseRepository.findById(courseId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy khóa học");

        if (!"draft".equalsIgnoreCase(opt.get().getStatus())) {
            return Map.of("success", false, "message", "Chỉ được xóa khóa học đang ở trạng thái bản nháp");
        }

        long enrollCount = enrollmentRepository.countByCourseId(courseId);
        if (enrollCount > 0) {
            return Map.of("success", false,
                    "message", "Không thể xóa khóa học đã có " + enrollCount + " học viên đang học. Hãy chọn 'Ẩn khóa học' thay thế.",
                    "canHide", true);
        }

        // Xóa cascade
        if (!chapterRepository.findByCourseId(courseId).isEmpty() || !quizRepository.findByCourseId(courseId).isEmpty()) {
            return Map.of("success", false, "message", "Hãy xóa chương, bài học và quiz trước khi xóa bản nháp");
        }

        List<Chapter> chapters = chapterRepository.findByCourseId(courseId);
        for (Chapter ch : chapters) {
            List<Lesson> lessons = lessonRepository.findByChapterId(ch.getId());
            for (Lesson l : lessons) {
                lessonProgressRepository.deleteByLessonId(l.getId());
            }
            lessonRepository.deleteAll(lessons);
        }
        chapterRepository.deleteAll(chapters);

        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        for (Quiz q : quizzes) {
            quizResultRepository.deleteByQuizId(q.getId());
            List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(q.getId());
            for (Question question : questions) {
                questionOptionRepository.deleteByQuestionId(question.getId());
            }
            questionRepository.deleteByQuizId(q.getId());
        }
        quizRepository.deleteAll(quizzes);

        courseRepository.deleteById(courseId);
        return Map.of("success", true, "message", "Đã xóa khóa học thành công");
    }

    // ===================== STUDENTS OF TEACHER =====================

    @GetMapping("/students")
    public List<Map<String, Object>> getTeacherStudents(@PathVariable Long teacherId) {
        currentUser.requireTeacher(teacherId);
        List<Course> teacherCourses = courseRepository.findByTeacherId(teacherId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Course course : teacherCourses) {
            List<Enrollment> enrollments = enrollmentRepository.findByCourseId(course.getId());
            List<Lesson> allLessons = new ArrayList<>();
            List<Chapter> chapters = chapterRepository.findByCourseId(course.getId());
            for (Chapter ch : chapters) {
                allLessons.addAll(lessonRepository.findByChapterId(ch.getId()));
            }
            int totalLessons = allLessons.size();

            List<Quiz> quizzes = quizRepository.findByCourseId(course.getId());

            for (Enrollment en : enrollments) {
                User student = en.getStudent();
                if (student == null) continue;

                Map<String, Object> row = new LinkedHashMap<>();
                row.put("enrollmentId", en.getId());
                row.put("student", Map.of(
                        "id", student.getId(),
                        "name", student.getName() != null ? student.getName() : "",
                        "email", student.getEmail() != null ? student.getEmail() : "",
                        "phone", student.getPhone() != null ? student.getPhone() : "",
                        "province", student.getProvince() != null ? student.getProvince() : ""
                ));
                row.put("course", Map.of(
                        "id", course.getId(),
                        "title", course.getTitle(),
                        "price", course.getPrice() != null ? course.getPrice() : 0,
                        "categoryName", course.getCategory() != null ? course.getCategory().getName() : ""
                ));

                // Tiến độ bài học
                int completedLessons = 0;
                for (Lesson l : allLessons) {
                    Optional<LessonProgress> lp = lessonProgressRepository.findByStudentIdAndLessonId(student.getId(), l.getId());
                    if (lp.isPresent() && Boolean.TRUE.equals(lp.get().getIsCompleted())) {
                        completedLessons++;
                    }
                }
                int progressPercent = totalLessons > 0 ? (int) Math.round((double) completedLessons / totalLessons * 100) : 0;
                row.put("completedLessons", completedLessons);
                row.put("totalLessons", totalLessons);
                row.put("progressPercent", progressPercent);

                // Kết quả quiz
                int quizzesTaken = 0;
                int passedQuizzes = 0;
                double totalScore = 0;
                for (Quiz q : quizzes) {
                    Optional<QuizResult> qr = quizResultRepository
                            .findTopByStudentIdAndQuizIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(student.getId(), q.getId());
                    if (qr.isPresent()) {
                        quizzesTaken++;
                        if (Boolean.TRUE.equals(qr.get().getPassed())) passedQuizzes++;
                        totalScore += qr.get().getScore() != null ? qr.get().getScore() : 0;
                    }
                }
                row.put("quizzesTaken", quizzesTaken);
                row.put("passedQuizzes", passedQuizzes);
                row.put("avgScore", quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken * 10.0) / 10.0 : 0);

                result.add(row);
            }
        }
        return result;
    }

    @DeleteMapping("/enrollments/{enrollmentId}")
    @Transactional
    public Object removeStudentFromCourse(@PathVariable Long teacherId, @PathVariable Long enrollmentId) {
        currentUser.requireTeacher(teacherId);
        Optional<Enrollment> opt = enrollmentRepository.findById(enrollmentId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy ghi danh");

        Enrollment en = opt.get();
        Course c = en.getCourse();
        if (c == null || c.getTeacher() == null || !c.getTeacher().getId().equals(teacherId)) {
            return Map.of("success", false, "message", "Không có quyền xóa học viên này");
        }

        enrollmentRepository.delete(en);
        return Map.of("success", true, "message", "Đã xóa học viên khỏi khóa học");
    }

    // ===================== REVENUE =====================

    @GetMapping("/revenue")
    public Map<String, Object> getTeacherRevenue(@PathVariable Long teacherId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        currentUser.requireTeacher(teacherId);
        LocalDate endDate = to == null ? LocalDate.now() : to;
        LocalDate startDate = from == null ? endDate.minusDays(29) : from;
        if (startDate.isAfter(endDate)) throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
        if (ChronoUnit.DAYS.between(startDate, endDate) > 366) throw new IllegalArgumentException("Khoảng báo cáo tối đa là 366 ngày");
        List<Course> teacherCourses = courseRepository.findByTeacherId(teacherId);

        double totalGrossRevenue = 0;
        int totalCoursesSold = 0;
        long totalEnrollments = 0;
        Set<Long> uniqueStudents = new HashSet<>();
        List<Map<String, Object>> coursesBreakdown = new ArrayList<>();
        List<Map<String, Object>> transactions = new ArrayList<>();

        for (Course c : teacherCourses) {
            List<Order> orders = orderRepository.findByCourseId(c.getId())
                    .stream().filter(o -> "COMPLETED".equals(o.getStatus()))
                    .filter(o -> {
                        LocalDateTime time = o.getCompletedAt() != null ? o.getCompletedAt() : o.getCreatedAt();
                        return time != null && !time.toLocalDate().isBefore(startDate) && !time.toLocalDate().isAfter(endDate);
                    }).toList();
            
            // Doanh thu chỉ được ghi nhận từ giao dịch đã hoàn tất. Ghi danh miễn phí
            // hoặc dữ liệu nhập tay không được xem là một giao dịch bán khóa học.
            double courseRevenue = orders.stream()
                    .mapToDouble(o -> o.getAmount() != null ? o.getAmount() : 0).sum();
            int count = orders.size();
            long enrollmentCount = enrollmentRepository.countByCourseId(c.getId());
            totalEnrollments += enrollmentCount;
            orders.stream().filter(o -> o.getStudent() != null).forEach(o -> uniqueStudents.add(o.getStudent().getId()));

            double teacherEarnings = courseRevenue * 0.8;
            totalGrossRevenue += courseRevenue;
            totalCoursesSold += count;

            Map<String, Object> breakdown = new LinkedHashMap<>();
            breakdown.put("courseId", c.getId());
            breakdown.put("courseTitle", c.getTitle());
            breakdown.put("price", c.getPrice() != null ? c.getPrice() : 0);
            breakdown.put("soldCount", count);
            breakdown.put("enrollmentCount", enrollmentCount);
            breakdown.put("conversionRate", enrollmentCount == 0 ? 0 : Math.round((count * 1000.0 / enrollmentCount)) / 10.0);
            breakdown.put("totalRevenue", courseRevenue);
            breakdown.put("teacherEarnings", teacherEarnings);
            coursesBreakdown.add(breakdown);
            for (Order order : orders) {
                Map<String, Object> transaction = new LinkedHashMap<>();
                transaction.put("orderCode", order.getOrderCode()); transaction.put("transactionNo", order.getTransactionNo());
                transaction.put("completedAt", order.getCompletedAt() != null ? order.getCompletedAt() : order.getCreatedAt());
                transaction.put("studentName", order.getStudent() == null ? "" : order.getStudent().getName());
                transaction.put("studentEmail", order.getStudent() == null ? "" : order.getStudent().getEmail());
                transaction.put("courseTitle", c.getTitle()); transaction.put("amount", order.getAmount());
                transaction.put("teacherEarning", (order.getAmount() == null ? 0 : order.getAmount()) * 0.8);
                transaction.put("paymentMethod", order.getPaymentMethod());
                transactions.add(transaction);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalGrossRevenue", totalGrossRevenue);
        result.put("teacherNetEarnings", totalGrossRevenue * 0.8);
        result.put("totalCoursesSold", totalCoursesSold);
        result.put("totalEnrollments", totalEnrollments);
        result.put("uniquePayingStudents", uniqueStudents.size());
        result.put("averageOrderValue", totalCoursesSold == 0 ? 0 : totalGrossRevenue / totalCoursesSold);
        result.put("from", startDate); result.put("to", endDate); result.put("generatedAt", LocalDateTime.now());
        transactions.sort((a, b) -> ((LocalDateTime) b.get("completedAt")).compareTo((LocalDateTime) a.get("completedAt")));
        result.put("transactions", transactions);
        result.put("coursesBreakdown", coursesBreakdown);
        return result;
    }
}
