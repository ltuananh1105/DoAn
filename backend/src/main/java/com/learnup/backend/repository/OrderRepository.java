package com.learnup.backend.repository;

import com.learnup.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Order> findByCourseId(Long courseId);
    List<Order> findByStatus(String status);
    boolean existsByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, String status);
    Optional<Order> findByOrderCode(String orderCode);
    Optional<Order> findFirstByStudentIdAndCourseIdAndStatusOrderByCreatedAtDesc(Long studentId, Long courseId, String status);
}
