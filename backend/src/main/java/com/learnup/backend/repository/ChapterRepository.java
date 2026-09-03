package com.learnup.backend.repository;

import com.learnup.backend.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourseId(Long courseId);
    List<Chapter> findByCourseIdOrderByOrderIndexAscIdAsc(Long courseId);
}
