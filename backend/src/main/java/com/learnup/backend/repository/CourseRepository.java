package com.learnup.backend.repository;

import com.learnup.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    long countByCategoryId(Long categoryId);
}
