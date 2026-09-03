package com.learnup.backend.repository;

import com.learnup.backend.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByStudentId(Long studentId);
    List<QuizResult> findByQuizId(Long quizId);
    Optional<QuizResult> findTopByStudentIdAndQuizIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(Long studentId, Long quizId);
    Optional<QuizResult> findTopByStudentIdAndQuizIdAndSubmittedAtIsNullOrderByStartedAtDesc(Long studentId, Long quizId);
    List<QuizResult> findByStudentIdAndQuizIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(Long studentId, Long quizId);
    void deleteByQuizId(Long quizId);
    boolean existsByStudentId(Long studentId);
}
