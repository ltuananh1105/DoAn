package com.learnup.backend;

import com.learnup.backend.entity.Course;
import com.learnup.backend.entity.Order;
import com.learnup.backend.entity.User;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.EnrollmentRepository;
import com.learnup.backend.repository.OrderRepository;
import com.learnup.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RevenueControllerTests {
    @Mock OrderRepository orderRepository;
    @Mock UserRepository userRepository;
    @Mock CourseRepository courseRepository;
    @Mock EnrollmentRepository enrollmentRepository;
    @InjectMocks RevenueController controller;

    @Test
    void reportUsesOnlyCompletedOrdersInsideSelectedPeriod() {
        LocalDate today = LocalDate.now();
        User teacher = user(1L, "Teacher");
        User student = user(2L, "Student");
        Course course = new Course(); course.setId(3L); course.setTitle("English"); course.setTeacher(teacher);

        Order inside = order("ORD-1", 500_000d, today.atTime(10, 0), student, course);
        Order outside = order("ORD-2", 900_000d, today.minusDays(40).atTime(10, 0), student, course);
        when(orderRepository.findByStatus("COMPLETED")).thenReturn(List.of(inside, outside));
        when(userRepository.findByRole("student")).thenReturn(List.of(student));
        when(userRepository.findByRole("teacher")).thenReturn(List.of(teacher));
        when(courseRepository.count()).thenReturn(1L);
        when(enrollmentRepository.count()).thenReturn(1L);

        Map<String, Object> report = controller.getAdminRevenue(today.minusDays(29), today);

        assertEquals(1, report.get("totalCompletedOrders"));
        assertEquals(500_000d, report.get("totalGrossRevenue"));
        assertEquals(100_000d, report.get("platformNetRevenue"));
        assertEquals(400_000d, report.get("totalTeacherPayout"));
        assertEquals(1L, report.get("uniqueBuyers"));
        assertEquals(30, ((List<?>) report.get("dailyRevenue")).size());
        assertEquals(1, ((List<?>) report.get("recentOrders")).size());
    }

    private User user(Long id, String name) {
        User user = new User(); user.setId(id); user.setName(name); user.setEmail(name.toLowerCase() + "@test.local");
        return user;
    }

    private Order order(String code, Double amount, LocalDateTime completedAt, User student, Course course) {
        Order order = new Order(); order.setOrderCode(code); order.setAmount(amount); order.setStatus("COMPLETED");
        order.setCompletedAt(completedAt); order.setCreatedAt(completedAt); order.setStudent(student); order.setCourse(course);
        return order;
    }
}
