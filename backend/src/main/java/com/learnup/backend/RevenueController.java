package com.learnup.backend;

import com.learnup.backend.entity.Order;
import com.learnup.backend.repository.OrderRepository;
import com.learnup.backend.repository.UserRepository;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private EnrollmentRepository enrollmentRepository;

    @GetMapping("/admin")
    public Map<String, Object> getAdminRevenue(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        LocalDate endDate = to == null ? LocalDate.now() : to;
        LocalDate startDate = from == null ? endDate.minusDays(29) : from;
        if (startDate.isAfter(endDate)) throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc");
        if (ChronoUnit.DAYS.between(startDate, endDate) > 366) throw new IllegalArgumentException("Khoảng báo cáo tối đa là 366 ngày");

        List<Order> allCompleted = orderRepository.findByStatus("COMPLETED");
        List<Order> completedOrders = filterByDate(allCompleted, startDate, endDate);
        long periodDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        LocalDate previousEnd = startDate.minusDays(1);
        LocalDate previousStart = previousEnd.minusDays(periodDays - 1);
        List<Order> previousOrders = filterByDate(allCompleted, previousStart, previousEnd);

        double totalGross = completedOrders.stream().mapToDouble(o -> o.getAmount() != null ? o.getAmount() : 0).sum();
        double previousGross = previousOrders.stream().mapToDouble(o -> o.getAmount() != null ? o.getAmount() : 0).sum();
        double platformRevenue = totalGross * 0.2;
        double teacherPayout = totalGross * 0.8;
        double averageOrderValue = completedOrders.isEmpty() ? 0 : totalGross / completedOrders.size();
        long uniqueBuyers = completedOrders.stream().filter(o -> o.getStudent() != null)
                .map(o -> o.getStudent().getId()).distinct().count();

        List<Map<String, Object>> recentOrders = new ArrayList<>();
        List<Order> sorted = new ArrayList<>(completedOrders);
        sorted.sort((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0);

        for (Order o : sorted) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("orderCode", o.getOrderCode());
            row.put("amount", o.getAmount());
            row.put("paymentMethod", o.getPaymentMethod());
            row.put("status", o.getStatus());
            row.put("createdAt", o.getCreatedAt());
            row.put("completedAt", o.getCompletedAt());
            row.put("transactionNo", o.getTransactionNo());
            if (o.getStudent() != null) {
                row.put("student", Map.of("id", o.getStudent().getId(), "name", o.getStudent().getName(), "email", o.getStudent().getEmail()));
            }
            if (o.getCourse() != null) {
                row.put("course", Map.of("id", o.getCourse().getId(), "title", o.getCourse().getTitle()));
            }
            recentOrders.add(row);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalGrossRevenue", totalGross);
        result.put("platformNetRevenue", platformRevenue);
        result.put("totalTeacherPayout", teacherPayout);
        result.put("totalCompletedOrders", completedOrders.size());
        result.put("averageOrderValue", averageOrderValue);
        result.put("uniqueBuyers", uniqueBuyers);
        result.put("revenueGrowthPercent", percentChange(totalGross, previousGross));
        result.put("orderGrowthPercent", percentChange(completedOrders.size(), previousOrders.size()));
        result.put("from", startDate);
        result.put("to", endDate);
        result.put("generatedAt", LocalDateTime.now());
        result.put("totalStudents", userRepository.findByRole("student").size());
        result.put("totalTeachers", userRepository.findByRole("teacher").size());
        result.put("totalCourses", courseRepository.count());
        result.put("totalEnrollments", enrollmentRepository.count());
        result.put("dailyRevenue", buildDailyRevenue(completedOrders, startDate, endDate));
        result.put("courseBreakdown", buildCourseBreakdown(completedOrders));
        result.put("recentOrders", recentOrders);
        return result;
    }

    private List<Order> filterByDate(List<Order> orders, LocalDate from, LocalDate to) {
        return orders.stream().filter(order -> {
            LocalDateTime time = order.getCompletedAt() != null ? order.getCompletedAt() : order.getCreatedAt();
            if (time == null) return false;
            LocalDate date = time.toLocalDate();
            return !date.isBefore(from) && !date.isAfter(to);
        }).toList();
    }

    private double percentChange(double current, double previous) {
        if (previous == 0) return current == 0 ? 0 : 100;
        return Math.round(((current - previous) / previous * 100) * 10.0) / 10.0;
    }

    private List<Map<String, Object>> buildDailyRevenue(List<Order> orders, LocalDate from, LocalDate to) {
        Map<LocalDate, List<Order>> byDate = orders.stream().collect(Collectors.groupingBy(order ->
                (order.getCompletedAt() != null ? order.getCompletedAt() : order.getCreatedAt()).toLocalDate()));
        List<Map<String, Object>> result = new ArrayList<>();
        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            List<Order> daily = byDate.getOrDefault(date, List.of());
            result.add(Map.of("date", date, "orders", daily.size(), "revenue",
                    daily.stream().mapToDouble(o -> o.getAmount() == null ? 0 : o.getAmount()).sum()));
        }
        return result;
    }

    private List<Map<String, Object>> buildCourseBreakdown(List<Order> orders) {
        return orders.stream().filter(order -> order.getCourse() != null)
                .collect(Collectors.groupingBy(order -> order.getCourse().getId()))
                .values().stream().map(group -> {
                    Order first = group.get(0);
                    double gross = group.stream().mapToDouble(o -> o.getAmount() == null ? 0 : o.getAmount()).sum();
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("courseId", first.getCourse().getId()); row.put("courseTitle", first.getCourse().getTitle());
                    row.put("teacherName", first.getCourse().getTeacher() == null ? "" : first.getCourse().getTeacher().getName());
                    row.put("orders", group.size()); row.put("grossRevenue", gross);
                    row.put("platformRevenue", gross * 0.2); row.put("teacherPayout", gross * 0.8);
                    return row;
                }).sorted((a, b) -> Double.compare((double) b.get("grossRevenue"), (double) a.get("grossRevenue"))).toList();
    }
}
