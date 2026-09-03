package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDateTime;
import java.time.Duration;
import com.learnup.backend.security.CurrentUser;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionOptionRepository questionOptionRepository;
    @Autowired
    private QuizResultRepository quizResultRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired private CurrentUser currentUser;

    // Lấy danh sách quiz theo khóa học
    @GetMapping("/course/{courseId}")
    public List<Map<String, Object>> getQuizByCourse(@PathVariable Long courseId) {
        currentUser.requireCourseAccess(courseId);
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Quiz q : quizzes) {
            result.add(buildQuizDetail(q, false));
        }
        return result;
    }

    @GetMapping("/{quizId}")
    public Object getQuizById(@PathVariable Long quizId) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty())
            return Map.of("error", "Không tìm thấy quiz");
        currentUser.requireCourseAccess(opt.get().getCourse().getId());
        return buildQuizDetail(opt.get(), false);
    }

    @GetMapping("/course/{courseId}/manage")
    public List<Map<String, Object>> getQuizForManagement(@PathVariable Long courseId) {
        currentUser.requireCourseOwner(courseId);
        return quizRepository.findByCourseId(courseId).stream()
                .map(quiz -> buildQuizDetail(quiz, true))
                .toList();
    }

    private Map<String, Object> buildQuizDetail(Quiz q, boolean revealAnswers) {
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(q.getId());
        List<Map<String, Object>> questionList = new ArrayList<>();
        for (Question question : questions) {
            List<QuestionOption> opts = questionOptionRepository.findByQuestionId(question.getId());
            List<Map<String, Object>> optList = new ArrayList<>();
            for (QuestionOption opt : opts) {
                Map<String, Object> optionMap = new LinkedHashMap<>();
                optionMap.put("id", opt.getId());
                optionMap.put("content", opt.getContent());
                if (revealAnswers) optionMap.put("isCorrect", Boolean.TRUE.equals(opt.getIsCorrect()));
                optList.add(optionMap);
            }
            Map<String, Object> questionMap = new LinkedHashMap<>();
            questionMap.put("id", question.getId());
            questionMap.put("content", question.getContent());
            questionMap.put("orderIndex", question.getOrderIndex() != null ? question.getOrderIndex() : 0);
            questionMap.put("options", optList);
            if (revealAnswers) {
                questionMap.put("explanation", question.getExplanation() != null ? question.getExplanation() : "");
            }
            questionList.add(questionMap);
        }

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", q.getId());
        map.put("title", q.getTitle());
        map.put("passScore", q.getPassScore());
        map.put("timeLimitMinutes", q.getTimeLimitMinutes());
        map.put("questions", questionList);
        return map;
    }

    // Tạo quiz
    @PostMapping("/course/{courseId}")
    public Object createQuiz(@PathVariable Long courseId, @RequestBody Map<String, Object> body) {
        currentUser.requireCourseOwner(courseId);
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty())
            return Map.of("error", "Không tìm thấy khóa học");

        String title = body.get("title") instanceof String value ? value.trim() : "";
        Integer passScore = parseInteger(body.get("passScore"), 80);
        Integer timeLimit = parseInteger(body.get("timeLimitMinutes"), 15);
        String validationError = validateQuiz(title, passScore, timeLimit);
        if (validationError != null) return Map.of("success", false, "message", validationError);

        Quiz q = new Quiz();
        q.setTitle(title);
        q.setPassScore(passScore);
        q.setTimeLimitMinutes(timeLimit);
        q.setCourse(courseOpt.get());
        Quiz saved = quizRepository.save(q);
        return Map.of("success", true, "quiz", buildQuizDetail(saved, true));
    }

    // Sửa quiz
    @PutMapping("/{quizId}")
    public Object updateQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        currentUser.requireQuizOwner(quizId);
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy quiz");
        Quiz q = opt.get();
        String title = body.containsKey("title") && body.get("title") instanceof String value
                ? value.trim() : q.getTitle();
        Integer passScore = body.containsKey("passScore")
                ? parseInteger(body.get("passScore"), null) : q.getPassScore();
        Integer timeLimit = body.containsKey("timeLimitMinutes")
                ? parseInteger(body.get("timeLimitMinutes"), null) : q.getTimeLimitMinutes();
        String validationError = validateQuiz(title, passScore, timeLimit);
        if (validationError != null) return Map.of("success", false, "message", validationError);
        q.setTitle(title);
        q.setPassScore(passScore);
        q.setTimeLimitMinutes(timeLimit);
        quizRepository.save(q);
        return Map.of("success", true, "quiz", buildQuizDetail(q, true));
    }

    // Xóa quiz
    @DeleteMapping("/{quizId}")
    @Transactional
    public Object deleteQuiz(@PathVariable Long quizId) {
        currentUser.requireQuizOwner(quizId);
        if (!quizRepository.existsById(quizId))
            return Map.of("success", false, "message", "Không tìm thấy quiz");
        quizResultRepository.deleteByQuizId(quizId);
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(quizId);
        for (Question q : questions) {
            questionOptionRepository.deleteByQuestionId(q.getId());
        }
        questionRepository.deleteByQuizId(quizId);
        quizRepository.deleteById(quizId);
        return Map.of("success", true, "message", "Đã xóa quiz");
    }

    // Thêm câu hỏi
    @PostMapping("/{quizId}/questions")
    public Object addQuestion(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        currentUser.requireQuizOwner(quizId);
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty())
            return Map.of("success", false, "message", "Không tìm thấy quiz");

        String content = body.get("content") instanceof String value ? value.trim() : "";
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> options = (List<Map<String, Object>>) body.get("options");
        if (content.isEmpty()) return Map.of("success", false, "message", "Nội dung câu hỏi không được để trống");
        if (options == null || options.size() < 2) {
            return Map.of("success", false, "message", "Câu hỏi phải có ít nhất 2 phương án");
        }
        long correctCount = options.stream().filter(option -> Boolean.TRUE.equals(option.get("isCorrect"))).count();
        boolean hasBlankOption = options.stream().anyMatch(option ->
                !(option.get("content") instanceof String value) || value.trim().isEmpty());
        if (hasBlankOption) return Map.of("success", false, "message", "Nội dung phương án không được để trống");
        if (correctCount != 1) return Map.of("success", false, "message", "Câu hỏi phải có đúng 1 đáp án đúng");

        Question q = new Question();
        q.setQuiz(quizOpt.get());
        q.setContent(content);
        q.setExplanation((String) body.getOrDefault("explanation", ""));
        List<Question> existing = questionRepository.findByQuizIdOrderByOrderIndex(quizId);
        q.setOrderIndex(existing.size() + 1);
        Question saved = questionRepository.save(q);

        for (Map<String, Object> opt : options) {
            QuestionOption o = new QuestionOption();
            o.setQuestion(saved);
            o.setContent(((String) opt.get("content")).trim());
            o.setIsCorrect(Boolean.TRUE.equals(opt.get("isCorrect")));
            questionOptionRepository.save(o);
        }

        return Map.of("success", true, "questionId", saved.getId());
    }

    // Xóa câu hỏi
    @DeleteMapping("/questions/{questionId}")
    @Transactional
    public Object deleteQuestion(@PathVariable Long questionId) {
        var question = questionRepository.findById(questionId).orElseThrow();
        currentUser.requireQuizOwner(question.getQuiz().getId());
        if (!questionRepository.existsById(questionId))
            return Map.of("success", false, "message", "Không tìm thấy câu hỏi");
        questionOptionRepository.deleteByQuestionId(questionId);
        questionRepository.deleteById(questionId);
        return Map.of("success", true, "message", "Đã xóa câu hỏi");
    }

    // Nộp bài quiz
    @PostMapping("/{quizId}/start")
    @Transactional
    public Object startQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy quiz");
        Quiz quiz = quizOpt.get();
        Long studentId = parseLong(body.get("studentId"));
        if (studentId == null) return Map.of("success", false, "message", "Học viên không hợp lệ");
        currentUser.requireStudentSelf(studentId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty() || !"student".equalsIgnoreCase(studentOpt.get().getRole())) {
            return Map.of("success", false, "message", "Không tìm thấy học viên");
        }
        if (!enrollmentRepository.existsByStudentIdAndCourseId(studentId, quiz.getCourse().getId())) {
            return Map.of("success", false, "message", "Học viên chưa ghi danh khóa học này");
        }
        int total = questionRepository.findByQuizIdOrderByOrderIndex(quizId).size();
        if (total == 0) return Map.of("success", false, "message", "Quiz chưa có câu hỏi");

        Optional<QuizResult> active = quizResultRepository
                .findTopByStudentIdAndQuizIdAndSubmittedAtIsNullOrderByStartedAtDesc(studentId, quizId);
        if (active.isPresent() && !isExpired(active.get(), quiz)) return startResponse(active.get(), quiz);
        active.ifPresent(result -> {
            result.setScore(0.0); result.setCorrectCount(0); result.setTotalQuestions(total);
            result.setPassed(false); result.setSubmittedAt(LocalDateTime.now());
            quizResultRepository.save(result);
        });

        QuizResult attempt = new QuizResult();
        attempt.setStudent(studentOpt.get());
        attempt.setQuiz(quiz);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setTotalQuestions(total);
        return startResponse(quizResultRepository.save(attempt), quiz);
    }

    @PostMapping("/{quizId}/submit")
    @Transactional
    public Object submitQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty())
            return Map.of("success", false, "message", "Không tìm thấy quiz");
        Quiz quiz = quizOpt.get();

        Long studentId;
        try {
            studentId = Long.parseLong(Objects.toString(body.get("studentId"), ""));
        } catch (NumberFormatException ex) {
            return Map.of("success", false, "message", "Học viên không hợp lệ");
        }
        currentUser.requireStudentSelf(studentId);
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty() || !"student".equalsIgnoreCase(studentOpt.get().getRole())) {
            return Map.of("success", false, "message", "Không tìm thấy học viên");
        }
        if (!enrollmentRepository.existsByStudentIdAndCourseId(studentId, quiz.getCourse().getId())) {
            return Map.of("success", false, "message", "Học viên chưa ghi danh khóa học này");
        }
        Long attemptId = parseLong(body.get("attemptId"));
        if (attemptId == null) return Map.of("success", false, "message", "Lượt làm bài không hợp lệ");
        Optional<QuizResult> attemptOpt = quizResultRepository.findById(attemptId);
        if (attemptOpt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy lượt làm bài");
        QuizResult result = attemptOpt.get();
        if (result.getStudent() == null || !studentId.equals(result.getStudent().getId())
                || result.getQuiz() == null || !quizId.equals(result.getQuiz().getId()) || result.getSubmittedAt() != null) {
            return Map.of("success", false, "message", "Lượt làm bài đã kết thúc hoặc không hợp lệ");
        }
        if (isExpired(result, quiz)) {
            result.setScore(0.0); result.setCorrectCount(0); result.setPassed(false);
            result.setSubmittedAt(LocalDateTime.now()); quizResultRepository.save(result);
            return Map.of("success", false, "message", "Đã hết thời gian làm bài");
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) body.get("answers");

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(quizId);
        int correct = 0;
        int total = questions.size();
        if (total == 0) return Map.of("success", false, "message", "Quiz chưa có câu hỏi");
        List<Map<String, Object>> reviewQuestions = new ArrayList<>();

        for (Question q : questions) {
            List<QuestionOption> questionOptions = questionOptionRepository.findByQuestionId(q.getId());
            Object selectedValue = answers != null ? answers.get(q.getId().toString()) : null;
            Long selectedOptionId = null;
            if (selectedValue != null) {
                try {
                    Long requestedOptionId = Long.parseLong(selectedValue.toString());
                    selectedOptionId = questionOptions.stream()
                            .filter(option -> option.getId().equals(requestedOptionId))
                            .map(QuestionOption::getId)
                            .findFirst()
                            .orElse(null);
                } catch (NumberFormatException ignored) {
                    selectedOptionId = null;
                }
            }
            Long finalSelectedOptionId = selectedOptionId;
            boolean isCorrect = questionOptions.stream().anyMatch(option ->
                    option.getId().equals(finalSelectedOptionId) && Boolean.TRUE.equals(option.getIsCorrect()));
            if (isCorrect) correct++;

            List<Map<String, Object>> reviewOptions = questionOptions.stream().map(option -> Map.<String, Object>of(
                    "id", option.getId(),
                    "content", option.getContent(),
                    "isCorrect", Boolean.TRUE.equals(option.getIsCorrect()))).toList();
            Map<String, Object> review = new LinkedHashMap<>();
            review.put("id", q.getId());
            review.put("content", q.getContent());
            review.put("explanation", q.getExplanation() != null ? q.getExplanation() : "");
            review.put("selectedOptionId", selectedOptionId);
            review.put("isCorrect", isCorrect);
            review.put("options", reviewOptions);
            reviewQuestions.add(review);
        }

        double score = total > 0 ? Math.round((double) correct / total * 100) : 0;
        boolean passed = score >= (quiz.getPassScore() != null ? quiz.getPassScore() : 80);

        result.setStudent(studentOpt.get());
        result.setQuiz(quiz);
        result.setScore(score);
        result.setCorrectCount(correct);
        result.setTotalQuestions(total);
        result.setPassed(passed);
        result.setSubmittedAt(java.time.LocalDateTime.now());
        quizResultRepository.save(result);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("score", score);
        response.put("correct", correct);
        response.put("total", total);
        response.put("passed", passed);
        response.put("passScore", quiz.getPassScore() != null ? quiz.getPassScore() : 80);
        response.put("questions", reviewQuestions);
        return response;
    }

    @GetMapping("/{quizId}/history/student/{studentId}")
    public List<Map<String, Object>> getHistory(@PathVariable Long quizId, @PathVariable Long studentId) {
        currentUser.requireStudentSelf(studentId);
        return quizResultRepository.findByStudentIdAndQuizIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(studentId, quizId)
                .stream().map(result -> Map.<String, Object>of(
                        "id", result.getId(), "score", result.getScore() != null ? result.getScore() : 0,
                        "passed", Boolean.TRUE.equals(result.getPassed()),
                        "correct", result.getCorrectCount() != null ? result.getCorrectCount() : 0,
                        "total", result.getTotalQuestions() != null ? result.getTotalQuestions() : 0,
                        "submittedAt", result.getSubmittedAt())).toList();
    }

    private Long parseLong(Object value) {
        try { return Long.parseLong(Objects.toString(value, "")); }
        catch (NumberFormatException ex) { return null; }
    }

    private boolean isExpired(QuizResult attempt, Quiz quiz) {
        int minutes = quiz.getTimeLimitMinutes() != null ? quiz.getTimeLimitMinutes() : 15;
        return attempt.getStartedAt() == null || Duration.between(attempt.getStartedAt(), LocalDateTime.now()).toSeconds() > minutes * 60L + 5;
    }

    private Map<String, Object> startResponse(QuizResult attempt, Quiz quiz) {
        long limitSeconds = (quiz.getTimeLimitMinutes() != null ? quiz.getTimeLimitMinutes() : 15) * 60L;
        long elapsed = Math.max(0, Duration.between(attempt.getStartedAt(), LocalDateTime.now()).toSeconds());
        return Map.of("success", true, "attemptId", attempt.getId(), "remainingSeconds", Math.max(0, limitSeconds - elapsed));
    }

    private Integer parseInteger(Object value, Integer defaultValue) {
        if (value == null) return defaultValue;
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String validateQuiz(String title, Integer passScore, Integer timeLimit) {
        if (title == null || title.isBlank()) return "Tên quiz không được để trống";
        if (passScore == null || passScore < 0 || passScore > 100) return "Điểm đạt phải từ 0 đến 100";
        if (timeLimit == null || timeLimit <= 0 || timeLimit > 180) {
            return "Thời gian làm bài phải từ 1 đến 180 phút";
        }
        return null;
    }
}
