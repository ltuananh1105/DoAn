package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@Service
@Profile("legacy-seed")
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private ChapterRepository chapterRepository;
    @Autowired private LessonRepository lessonRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private QuizRepository quizRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private QuestionOptionRepository questionOptionRepository;
    @Autowired private QuizResultRepository quizResultRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        migrateLegacyStatuses();
        // Chỉ seed khi cơ sở dữ liệu hoàn toàn mới. Không tự xóa dữ liệu chỉ vì
        // một bảng đang trống hoặc dữ liệu đang được nhập dở.
        if (userRepository.count() == 0 && courseRepository.count() == 0) {
            try {
                resetDatabase();
            } catch (Exception e) {
                System.err.println("Auto reset error: " + e.getMessage());
            }
        }
    }

    private void migrateLegacyStatuses() {
        List<User> users = userRepository.findAll();
        users.stream().filter(user -> user.getStatus() == null || user.getStatus().isBlank())
                .forEach(user -> user.setStatus("active"));
        userRepository.saveAll(users);

        List<Course> courses = courseRepository.findAll();
        courses.forEach(course -> {
            if ("approved".equalsIgnoreCase(course.getStatus())) course.setStatus("published");
            if ("hidden".equalsIgnoreCase(course.getStatus())) course.setStatus("archived");
        });
        courseRepository.saveAll(courses);
    }

    @PostMapping("/reset-sample-data")
    @Transactional
    public Object resetApi() {
        resetDatabase();
        return Map.of("success", true, "message", "Đã reset và nạp dữ liệu mẫu demo thành công!");
    }

    @Transactional
    public void resetDatabase() {
        System.out.println("🔄 RESET DATABASE VÀ SEED DỮ LIỆU ĐẦY ĐỦ...");

        // Xóa theo thứ tự sạch sẽ
        quizResultRepository.deleteAll();
        quizResultRepository.flush();

        questionOptionRepository.deleteAll();
        questionOptionRepository.flush();

        questionRepository.deleteAll();
        questionRepository.flush();

        quizRepository.deleteAll();
        quizRepository.flush();

        lessonProgressRepository.deleteAll();
        lessonProgressRepository.flush();

        lessonRepository.deleteAll();
        lessonRepository.flush();

        chapterRepository.deleteAll();
        chapterRepository.flush();

        orderRepository.deleteAll();
        orderRepository.flush();

        enrollmentRepository.deleteAll();
        enrollmentRepository.flush();

        courseRepository.deleteAll();
        courseRepository.flush();

        categoryRepository.deleteAll();
        categoryRepository.flush();

        userRepository.deleteAll();
        userRepository.flush();

        // 1. USERS
        User admin = saveUser("Quản Trị Viên", "admin@gmail.com", "admin", "0901234567", "Quản trị hệ thống", "TP. Hồ Chí Minh");
        User t1 = saveUser("ThS. Nguyễn Văn Hùng", "teacher@gmail.com", "teacher", "0912345678", "Giảng viên Tiếng Anh", "Hà Nội");
        User t2 = saveUser("Cô Lê Thị Mai (IELTS 8.5)", "teacher2@gmail.com", "teacher", "0923456789", "Chuyên gia Luyện thi IELTS", "Đà Nẵng");
        User t3 = saveUser("Thầy Trần Quốc Bảo", "teacher3@gmail.com", "teacher", "0924567890", "Giảng viên TOEIC & Giao tiếp", "TP. Hồ Chí Minh");

        User s1 = saveUser("Lê Tuấn Anh", "student@gmail.com", "student", "0934567890", "Sinh viên", "TP. Hồ Chí Minh");
        User s2 = saveUser("Trần Minh Quang", "student2@gmail.com", "student", "0945678901", "Kỹ sư phần mềm", "Hà Nội");
        User s3 = saveUser("Hoàng Thị Thảo", "student3@gmail.com", "student", "0956789012", "Nhân viên Marketing", "Hải Phòng");
        User s4 = saveUser("Nguyễn Phương Linh", "student4@gmail.com", "student", "0967890123", "Sinh viên Đại học", "Đà Nẵng");
        User s5 = saveUser("Phạm Đức Duy", "student5@gmail.com", "student", "0978901234", "Nhân viên Ngân hàng", "Cần Thơ");

        // 2. CATEGORIES
        Category catGT = cat("Tiếng Anh Giao Tiếp");
        Category catIELTS = cat("Luyện thi IELTS");
        Category catTOEIC = cat("Luyện thi TOEIC");
        Category catIT = cat("Tiếng Anh Thương Mại & CNTT");
        Category catNP = cat("Ngữ Pháp & Từ Vựng Căn Bản");

        // 3. COURSES, CHAPTERS & LESSONS
        // Course 1 (Teacher 1)
        Course c1 = saveCourse("Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm",
                "Khóa học chuẩn hóa phát âm, phản xạ giao tiếp tự tin trong môi trường công sở, viết email và đàm phán hợp đồng chuyên nghiệp.",
                499000.0, "published", t1, catGT);
        Chapter c1ch1 = chapter("Chương 1: Phản xạ giao tiếp công sở căn bản", c1);
        Lesson c1l1 = lesson("Bài 1: Tự tin giới thiệu bản thân & công việc", "https://www.youtube.com/watch?v=juKd26qkNAw", c1ch1);
        Lesson c1l2 = lesson("Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp", "https://www.youtube.com/watch?v=juKd26qkNAw", c1ch1);
        Lesson c1l3 = lesson("Bài 3: Đặt lịch họp và xác nhận qua điện thoại", "https://www.youtube.com/watch?v=juKd26qkNAw", c1ch1);
        Chapter c1ch2 = chapter("Chương 2: Họp nhóm & Thuyết trình", c1);
        Lesson c1l4 = lesson("Bài 4: Mẫu câu đưa ra ý kiến trong cuộc họp", "https://www.youtube.com/watch?v=juKd26qkNAw", c1ch2);
        Lesson c1l5 = lesson("Bài 5: Kỹ năng thuyết trình dự án bằng tiếng Anh", "https://www.youtube.com/watch?v=juKd26qkNAw", c1ch2);

        Quiz q1 = quiz("Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)", 80, 15, c1);
        createQuestion(q1, "Mẫu câu nào sau đây phù hợp nhất để mở đầu một email trang trọng gửi đối tác?",
                "\"Dear Mr. Smith, I hope this email finds you well.\" là mở đầu chuẩn mực và trang trọng.",
                List.of(
                        new Opt("Hey Mr. Smith, what's up?", false),
                        new Opt("Dear Mr. Smith, I hope this email finds you well.", true),
                        new Opt("Yo, check this out.", false),
                        new Opt("Hi friend, write me back asap.", false)
                ));
        createQuestion(q1, "Khi muốn xin phép ngắt lời ai đó một cách lịch sự trong cuộc họp, bạn nên nói gì?",
                "\"May I interrupt for a moment?\" là cách ngắt lời lịch thiệp nhất trong môi trường chuyên nghiệp.",
                List.of(
                        new Opt("Stop talking now!", false),
                        new Opt("Listen to me first.", false),
                        new Opt("May I interrupt for a moment?", true),
                        new Opt("Shut up please.", false)
                ));
        createQuestion(q1, "Từ nào đồng nghĩa với \"Postpone a meeting\"?",
                "\"Postpone\" và \"Put off\" đều có nghĩa là hoãn lại.",
                List.of(
                        new Opt("Put off", true),
                        new Opt("Call off", false),
                        new Opt("Carry on", false),
                        new Opt("Bring about", false)
                ));

        // Course 2 (Teacher 2)
        Course c2 = saveCourse("Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng",
                "Lộ trình bứt phá band điểm IELTS từ 5.5 lên 7.0+. Tập trung chuyên sâu Listening, Reading, Writing Task 2 và Speaking.",
                890000.0, "published", t2, catIELTS);
        Chapter c2ch1 = chapter("Chương 1: Chiến thuật Listening & Reading", c2);
        Lesson c2l1 = lesson("Bài 1: Phương pháp xử lý Multiple Choice trong Listening", "https://www.youtube.com/watch?v=juKd26qkNAw", c2ch1);
        Lesson c2l2 = lesson("Bài 2: Chiến lược Skimming & Scanning trong Reading", "https://www.youtube.com/watch?v=juKd26qkNAw", c2ch1);
        Chapter c2ch2 = chapter("Chương 2: Writing & Speaking", c2);
        Lesson c2l3 = lesson("Bài 3: Cấu trúc bài luận Writing Task 2", "https://www.youtube.com/watch?v=juKd26qkNAw", c2ch2);
        Lesson c2l4 = lesson("Bài 4: Bứt phá Speaking Part 2 và 3", "https://www.youtube.com/watch?v=juKd26qkNAw", c2ch2);

        Quiz q2 = quiz("IELTS Diagnostic Assessment (Band 7.0 Test)", 75, 20, c2);
        createQuestion(q2, "Trong IELTS Reading, kỹ thuật \"Scanning\" dùng để làm gì?",
                "Scanning dùng để tìm kiếm thông tin cụ thể (tên riêng, số liệu, từ khóa) một cách nhanh chóng.",
                List.of(
                        new Opt("Đọc hiểu ý chính toàn bài", false),
                        new Opt("Tìm kiếm thông tin chi tiết cụ thể (tên, số liệu, keyword)", true),
                        new Opt("Dịch từng từ sang tiếng mẹ đẻ", false),
                        new Opt("Đoán nghĩa của tiêu đề", false)
                ));
        createQuestion(q2, "Một bài Writing Task 2 tiêu chuẩn nên có tối thiểu bao nhiêu từ?",
                "IELTS Writing Task 2 yêu cầu tối thiểu 250 từ.",
                List.of(
                        new Opt("150 từ", false),
                        new Opt("200 từ", false),
                        new Opt("250 từ", true),
                        new Opt("350 từ", false)
                ));

        // Course 3 (Teacher 1)
        Course c3 = saveCourse("Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày",
                "Tổng hợp trọng tâm ngữ pháp và từ vựng TOEIC format mới, rèn luyện kỹ năng nghe Part 1-4 và đọc Part 5-7.",
                350000.0, "published", t1, catTOEIC);
        Chapter c3ch1 = chapter("Chương 1: Trọng tâm Ngữ pháp TOEIC", c3);
        Lesson c3l1 = lesson("Bài 1: Dạng câu hỏi về Từ loại", "https://www.youtube.com/watch?v=juKd26qkNAw", c3ch1);
        Lesson c3l2 = lesson("Bài 2: Bẫy Mệnh đề quan hệ", "https://www.youtube.com/watch?v=juKd26qkNAw", c3ch1);

        Quiz q3 = quiz("TOEIC Mini Mock Test (Part 5 Focus)", 70, 10, c3);
        createQuestion(q3, "The manager asked all staff members to submit ______ reports by Friday.",
                "Cần một tính từ sở hữu đứng trước danh từ 'reports', đáp án là 'their'.",
                List.of(
                        new Opt("they", false),
                        new Opt("them", false),
                        new Opt("their", true),
                        new Opt("theirs", false)
                ));

        // Course 4 (Teacher 3)
        Course c4 = saveCourse("Tiếng Anh Chuyên Ngành CNTT (IT English)",
                "Cung cấp thuật ngữ IT, giao tiếp trong Daily Standup, Sprint Planning, đọc tài liệu kỹ thuật.",
                550000.0, "published", t3, catIT);
        Chapter c4ch1 = chapter("Chương 1: Giao tiếp Scrum/Agile", c4);
        Lesson c4l1 = lesson("Bài 1: Báo cáo tiến độ Daily Standup Meeting", "https://www.youtube.com/watch?v=juKd26qkNAw", c4ch1);
        Lesson c4l2 = lesson("Bài 2: Đọc hiểu API Specs & Git Workflow", "https://www.youtube.com/watch?v=juKd26qkNAw", c4ch1);

        // Course 5 (Teacher 2 - Pending)
        Course c5 = saveCourse("Từ Vựng Siêu Tốc 3000 Từ Tiếng Anh Căn Bản",
                "Học từ vựng nhanh qua phương pháp Flashcard, phủ toàn bộ từ vựng giao tiếp hàng ngày.",
                199000.0, "pending", t2, catNP);
        Chapter c5ch1 = chapter("Chương 1: Từ vựng đời sống", c5);
        lesson("Bài 1: Từ vựng gia đình", "https://www.youtube.com/watch?v=juKd26qkNAw", c5ch1);

        // Course 6 (Teacher 3)
        Course c6 = saveCourse("Ngữ Pháp Tiếng Anh Nền Tảng A-Z",
                "Hệ thống hóa toàn bộ ngữ pháp tiếng Anh từ cơ bản đến nâng cao.",
                299000.0, "published", t3, catNP);
        Chapter c6ch1 = chapter("Chương 1: Các thì cơ bản", c6);
        Lesson c6l1 = lesson("Bài 1: Hiện tại đơn & Tiếp diễn", "https://www.youtube.com/watch?v=juKd26qkNAw", c6ch1);
        Lesson c6l2 = lesson("Bài 2: Quá khứ đơn & Hoàn thành", "https://www.youtube.com/watch?v=juKd26qkNAw", c6ch1);

        // 4. ORDERS & ENROLLMENTS
        orderAndEnroll(s1, c1, 499000.0, "VNPAY", -12);
        orderAndEnroll(s1, c2, 890000.0, "MOMO", -10);

        orderAndEnroll(s2, c1, 499000.0, "BANK_TRANSFER", -8);
        orderAndEnroll(s2, c2, 890000.0, "VNPAY", -6);
        orderAndEnroll(s2, c3, 350000.0, "MOMO", -5);

        orderAndEnroll(s3, c1, 499000.0, "VNPAY", -7);
        orderAndEnroll(s3, c3, 350000.0, "BANK_TRANSFER", -4);
        orderAndEnroll(s3, c4, 550000.0, "MOMO", -2);

        orderAndEnroll(s4, c2, 890000.0, "VNPAY", -9);
        orderAndEnroll(s4, c4, 550000.0, "MOMO", -3);
        orderAndEnroll(s4, c6, 299000.0, "BANK_TRANSFER", -1);

        orderAndEnroll(s5, c1, 499000.0, "VNPAY", -11);
        orderAndEnroll(s5, c3, 350000.0, "MOMO", -6);
        orderAndEnroll(s5, c6, 299000.0, "BANK_TRANSFER", -2);

        // 5. LESSON PROGRESS
        // Student 1 progress in c1 & c2
        progress(s1, c1l1, true); progress(s1, c1l2, true); progress(s1, c1l3, true); progress(s1, c1l4, true); progress(s1, c1l5, true);
        progress(s1, c2l1, true); progress(s1, c2l2, true); progress(s1, c2l3, false);

        // Student 2 progress
        progress(s2, c1l1, true); progress(s2, c1l2, true); progress(s2, c1l3, true);
        progress(s2, c3l1, true); progress(s2, c3l2, true);

        // Student 3 progress
        progress(s3, c1l1, true); progress(s3, c1l2, true);
        progress(s3, c4l1, true); progress(s3, c4l2, true);

        // Student 4 progress
        progress(s4, c2l1, true); progress(s4, c2l2, true); progress(s4, c2l3, true); progress(s4, c2l4, true);
        progress(s4, c6l1, true);

        // Student 5 progress
        progress(s5, c1l1, true); progress(s5, c6l1, true); progress(s5, c6l2, true);

        // 6. QUIZ RESULTS
        quizResult(s1, q1, 100.0, 3, 3, true, -10);
        quizResult(s1, q2, 85.0, 2, 2, true, -8);
        quizResult(s2, q1, 66.7, 2, 3, false, -5);
        quizResult(s2, q3, 100.0, 1, 1, true, -4);
        quizResult(s3, q1, 100.0, 3, 3, true, -3);
        quizResult(s4, q2, 90.0, 2, 2, true, -2);
        quizResult(s5, q1, 100.0, 3, 3, true, -1);

        System.out.println("✅ ĐÃ SEED THÀNH CÔNG DỮ LIỆU ĐẦY ĐỦ CHO DEMO!");
    }

    private User saveUser(String name, String email, String role, String phone, String occupation, String province) {
        User u = new User();
        u.setName(name); u.setEmail(email); u.setPassword(passwordEncoder.encode("123456"));
        u.setRole(role); u.setStatus("active"); u.setPhone(phone); u.setOccupation(occupation);
        u.setCountry("Việt Nam"); u.setProvince(province);
        return userRepository.save(u);
    }

    private Category cat(String name) {
        Category c = new Category(); c.setName(name);
        return categoryRepository.save(c);
    }

    private Course saveCourse(String title, String desc, Double price, String status, User teacher, Category category) {
        Course c = new Course();
        c.setTitle(title); c.setDescription(desc); c.setPrice(price);
        c.setStatus(status); c.setTeacher(teacher); c.setCategory(category);
        return courseRepository.save(c);
    }

    private Chapter chapter(String title, Course course) {
        Chapter ch = new Chapter(); ch.setTitle(title); ch.setCourse(course);
        return chapterRepository.save(ch);
    }

    private Lesson lesson(String title, String videoUrl, Chapter chapter) {
        Lesson l = new Lesson(); l.setTitle(title); l.setVideoUrl(videoUrl); l.setChapter(chapter);
        return lessonRepository.save(l);
    }

    private Quiz quiz(String title, Integer passScore, Integer timeLimit, Course course) {
        Quiz q = new Quiz();
        q.setTitle(title); q.setPassScore(passScore); q.setTimeLimitMinutes(timeLimit); q.setCourse(course);
        return quizRepository.save(q);
    }

    private static class Opt {
        String content; boolean correct;
        Opt(String content, boolean correct) { this.content = content; this.correct = correct; }
    }

    private void createQuestion(Quiz quiz, String content, String explanation, List<Opt> options) {
        Question q = new Question();
        q.setQuiz(quiz); q.setContent(content); q.setExplanation(explanation);
        q.setOrderIndex(1);
        Question savedQ = questionRepository.save(q);
        for (Opt o : options) {
            QuestionOption opt = new QuestionOption();
            opt.setQuestion(savedQ); opt.setContent(o.content); opt.setIsCorrect(o.correct);
            questionOptionRepository.save(opt);
        }
    }

    private void orderAndEnroll(User student, Course course, Double amount, String paymentMethod, int daysAgo) {
        Order o = new Order();
        o.setOrderCode("ORD" + (System.currentTimeMillis() + (int)(Math.random()*10000)));
        o.setStudent(student); o.setCourse(course); o.setAmount(amount);
        o.setPaymentMethod(paymentMethod); o.setStatus("COMPLETED");
        o.setTransactionNo("TXN_" + System.currentTimeMillis());
        o.setCreatedAt(LocalDateTime.now().plusDays(daysAgo));
        o.setCompletedAt(LocalDateTime.now().plusDays(daysAgo));
        orderRepository.save(o);

        Enrollment e = new Enrollment();
        e.setStudent(student); e.setCourse(course);
        enrollmentRepository.save(e);
    }

    private void progress(User student, Lesson lesson, boolean completed) {
        LessonProgress lp = new LessonProgress();
        lp.setStudent(student); lp.setLesson(lesson); lp.setIsCompleted(completed);
        lessonProgressRepository.save(lp);
    }

    private void quizResult(User student, Quiz quiz, double score, int correct, int total, boolean passed, int daysAgo) {
        QuizResult r = new QuizResult();
        r.setStudent(student); r.setQuiz(quiz); r.setScore(score);
        r.setCorrectCount(correct); r.setTotalQuestions(total); r.setPassed(passed);
        r.setSubmittedAt(LocalDateTime.now().plusDays(daysAgo));
        quizResultRepository.save(r);
    }
}
