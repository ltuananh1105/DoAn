package com.learnup.backend.repository;

import com.learnup.backend.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByStudentId(Long studentId);
    List<LessonProgress> findByStudentIdAndLessonChapterId(Long studentId, Long chapterId);
    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    void deleteByLessonId(Long lessonId);
}
