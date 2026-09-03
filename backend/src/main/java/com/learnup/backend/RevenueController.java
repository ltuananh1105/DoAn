package com.learnup.backend;

import com.learnup.backend.entity.Order;
import com.learnup.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired private OrderRepository orderRepository;

    @GetMapping("/admin")
    public Map<String, Object> getAdminRevenue() {
        List<Order> completedOrders = orderRepository.findByStatus("COMPLETED");

        double totalGross = completedOrders.stream().mapToDouble(o -> o.getAmount() != null ? o.getAmount() : 0).sum();
        double platformRevenue = totalGross * 0.2;
        double teacherPayout = totalGross * 0.8;

        List<Map<String, Object>> recentOrders = new ArrayList<>();
        List<Order> sorted = new ArrayList<>(completedOrders);
        sorted.sort((a, b) -> b.getCreatedAt() != null && a.getCreatedAt() != null ? b.getCreatedAt().compareTo(a.getCreatedAt()) : 0);

        for (Order o : sorted.subList(0, Math.min(50, sorted.size()))) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("orderCode", o.getOrderCode());
            row.put("amount", o.getAmount());
            row.put("paymentMethod", o.getPaymentMethod());
            row.put("status", o.getStatus());
            row.put("createdAt", o.getCreatedAt());
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
        result.put("recentOrders", recentOrders);
        return result;
    }
}
