package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import com.learnup.backend.security.CurrentUser;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CurrentUser currentUser;

    // Kiểm tra đã mua hoặc đã đăng ký chưa
    @GetMapping("/check")
    public Map<String, Object> checkPurchased(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        currentUser.requireStudentSelf(studentId);
        boolean purchased = orderRepository.existsByStudentIdAndCourseIdAndStatus(studentId, courseId, "COMPLETED");
        boolean enrolled = enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
        return Map.of("purchased", purchased || enrolled, "enrolled", enrolled);
    }

    // Tạo đơn hàng mới
    @PostMapping
    public Object createOrder(@RequestBody Map<String, Object> body) {
        Long studentId;
        Long courseId;
        try {
            studentId = Long.parseLong(Objects.toString(body.get("studentId"), ""));
            courseId = Long.parseLong(Objects.toString(body.get("courseId"), ""));
        } catch (NumberFormatException ex) {
            return Map.of("success", false, "message", "Thông tin đơn hàng không hợp lệ");
        }
        currentUser.requireStudentSelf(studentId);

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy khóa học");

        Course course = courseOpt.get();
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isEmpty() || !"student".equalsIgnoreCase(studentOpt.get().getRole())) {
            return Map.of("success", false, "message", "Học viên không hợp lệ");
        }
        if (!("published".equals(course.getStatus()) || "approved".equals(course.getStatus()))) return Map.of("success", false, "message", "Khóa học chưa được mở bán");
        if (course.getPrice() == null || course.getPrice() <= 0) return Map.of("success", false, "message", "Khóa học này không cần thanh toán");

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return Map.of("success", false, "message", "Bạn đã đăng ký khóa học này rồi");
        }

        Optional<Order> pending = orderRepository.findFirstByStudentIdAndCourseIdAndStatusOrderByCreatedAtDesc(studentId, courseId, "PENDING");
        if (pending.isPresent()) {
            Order pendingOrder = pending.get();
            boolean stillValid = pendingOrder.getCreatedAt() != null
                    && pendingOrder.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusMinutes(15));
            if (stillValid) return buildPaymentResponse(pendingOrder);
            pendingOrder.setStatus("FAILED");
            orderRepository.save(pendingOrder);
        }

        Order order = new Order();
        order.setOrderCode("ORD" + System.currentTimeMillis());
        order.setStudent(studentOpt.get());
        order.setCourse(course);
        order.setAmount(course.getPrice() != null ? course.getPrice() : 0);
        order.setStatus("PENDING");
        order.setCreatedAt(java.time.LocalDateTime.now());
        Order saved = orderRepository.save(order);

        return buildPaymentResponse(saved);
    }

    // Thanh toán Demo
    @PostMapping("/{orderId}/demo-pay")
    @Transactional
    public Object processDemoPayment(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy đơn hàng");

        Order order = orderOpt.get();
        currentUser.requireStudentSelf(order.getStudent().getId());
        if ("COMPLETED".equals(order.getStatus())) return Map.of("success", true, "message", "Đơn hàng đã được thanh toán", "order", order);
        if (!"PENDING".equals(order.getStatus())) return Map.of("success", false, "message", "Đơn hàng không còn hiệu lực");
        order.setStatus("COMPLETED");
        order.setPaymentMethod("DEMO_PAY");
        order.setTransactionNo("DEMO_TXN_" + System.currentTimeMillis());
        order.setCompletedAt(java.time.LocalDateTime.now());
        orderRepository.save(order);

        // Cấp quyền học
        if (order.getStudent() != null && order.getCourse() != null) {
            if (!enrollmentRepository.existsByStudentIdAndCourseId(order.getStudent().getId(), order.getCourse().getId())) {
                Enrollment en = new Enrollment();
                en.setStudent(order.getStudent());
                en.setCourse(order.getCourse());
                enrollmentRepository.save(en);
            }
        }

        return Map.of("success", true, "message", "Thanh toán thành công! Đã kích hoạt khóa học.", "order", order);
    }

    // Lịch sử đơn hàng của học viên
    @GetMapping("/student/{studentId}")
    public List<Order> getStudentOrders(@PathVariable Long studentId) {
        currentUser.requireStudentSelf(studentId);
        return orderRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    private Map<String, Object> buildPaymentResponse(Order order) {
        return Map.of("success", true, "orderId", order.getId(), "orderCode", order.getOrderCode(),
                "amount", order.getAmount());
    }
}
