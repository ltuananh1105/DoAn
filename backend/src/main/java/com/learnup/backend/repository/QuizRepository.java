package com.learnup.backend.repository;

import com.learnup.backend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseId(Long courseId);
    Optional<Quiz> findByCourseIdAndId(Long courseId, Long quizId);
}
