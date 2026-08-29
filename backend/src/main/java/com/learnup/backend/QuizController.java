package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    // Lấy danh sách quiz theo khóa học
    @GetMapping("/course/{courseId}")
    public List<Map<String, Object>> getQuizByCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Quiz q : quizzes) {
            result.add(buildQuizDetail(q));
        }
        return result;
    }

    @GetMapping("/{quizId}")
    public Object getQuizById(@PathVariable Long quizId) {
        Optional<Quiz> opt = quizRepository.findById(quizId);
        if (opt.isEmpty())
            return Map.of("error", "Không tìm thấy quiz");
        return buildQuizDetail(opt.get());
    }

    private Map<String, Object> buildQuizDetail(Quiz q) {
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(q.getId());
        List<Map<String, Object>> questionList = new ArrayList<>();
        for (Question question : questions) {
            List<QuestionOption> opts = questionOptionRepository.findByQuestionId(question.getId());
            List<Map<String, Object>> optList = new ArrayList<>();
            for (QuestionOption opt : opts) {
                optList.add(Map.of(
                        "id", opt.getId(),
                        "content", opt.getContent(),
                        "isCorrect", Boolean.TRUE.equals(opt.getIsCorrect())));
            }
            questionList.add(Map.of(
                    "id", question.getId(),
                    "content", question.getContent(),
                    "explanation", question.getExplanation() != null ? question.getExplanation() : "",
                    "orderIndex", question.getOrderIndex() != null ? question.getOrderIndex() : 0,
                    "options", optList));
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
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty())
            return Map.of("error", "Không tìm thấy khóa học");

        Quiz q = new Quiz();
        q.setTitle((String) body.get("title"));
        q.setPassScore(body.containsKey("passScore") ? Integer.parseInt(body.get("passScore").toString()) : 80);
        q.setTimeLimitMinutes(
                body.containsKey("timeLimitMinutes") ? Integer.parseInt(body.get("timeLimitMinutes").toString()) : 15);
        q.setCourse(courseOpt.get());
        Quiz saved = quizRepository.save(q);
        return Map.of("success", true, "quiz", buildQuizDetail(saved));
    }

    // Xóa quiz
    @DeleteMapping("/{quizId}")
    @Transactional
    public Object deleteQuiz(@PathVariable Long quizId) {
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
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty())
            return Map.of("success", false, "message", "Không tìm thấy quiz");

        Question q = new Question();
        q.setQuiz(quizOpt.get());
        q.setContent((String) body.get("content"));
        q.setExplanation((String) body.getOrDefault("explanation", ""));
        List<Question> existing = questionRepository.findByQuizIdOrderByOrderIndex(quizId);
        q.setOrderIndex(existing.size() + 1);
        Question saved = questionRepository.save(q);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> options = (List<Map<String, Object>>) body.get("options");
        if (options != null) {
            for (Map<String, Object> opt : options) {
                QuestionOption o = new QuestionOption();
                o.setQuestion(saved);
                o.setContent((String) opt.get("content"));
                o.setIsCorrect(Boolean.TRUE.equals(opt.get("isCorrect")));
                questionOptionRepository.save(o);
            }
        }

        return Map.of("success", true, "questionId", saved.getId());
    }

    // Nộp bài quiz
    @PostMapping("/{quizId}/submit")
    public Object submitQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> body) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty())
            return Map.of("success", false, "message", "Không tìm thấy quiz");
        Quiz quiz = quizOpt.get();

        Long studentId = Long.parseLong(body.get("studentId").toString());
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) body.get("answers");

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndex(quizId);
        int correct = 0;
        int total = questions.size();

        if (answers != null) {
            for (Question q : questions) {
                Object selectedOptId = answers.get(q.getId().toString());
                if (selectedOptId != null) {
                    Long optId = Long.parseLong(selectedOptId.toString());
                    Optional<QuestionOption> opt = questionOptionRepository.findById(optId);
                    if (opt.isPresent() && Boolean.TRUE.equals(opt.get().getIsCorrect())) {
                        correct++;
                    }
                }
            }
        }

        double score = total > 0 ? Math.round((double) correct / total * 100) : 0;
        boolean passed = score >= (quiz.getPassScore() != null ? quiz.getPassScore() : 80);

        QuizResult result = quizResultRepository.findByStudentIdAndQuizId(studentId, quizId).orElse(new QuizResult());
        User student = new User();
        student.setId(studentId);
        result.setStudent(student);
        result.setQuiz(quiz);
        result.setScore(score);
        result.setCorrectCount(correct);
        result.setTotalQuestions(total);
        result.setPassed(passed);
        result.setSubmittedAt(java.time.LocalDateTime.now());
        quizResultRepository.save(result);

        return Map.of(
                "success", true,
                "score", score,
                "correct", correct,
                "total", total,
                "passed", passed,
                "passScore", quiz.getPassScore() != null ? quiz.getPassScore() : 80);
    }
}
