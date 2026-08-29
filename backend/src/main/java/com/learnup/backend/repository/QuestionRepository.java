package com.learnup.backend.repository;

import com.learnup.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizIdOrderByOrderIndex(Long quizId);
    void deleteByQuizId(Long quizId);
}
