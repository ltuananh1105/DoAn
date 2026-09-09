# Business Rules

## 1. Mục đích

Business Rule xác định các rule và constraint chi phối behavior của LearnUp System và các Business Process liên quan.

Business Rule khác Functional Requirement ở chỗ:

- Functional Requirement mô tả System phải cung cấp capability gì.
- Business Rule xác định capability/process đó phải tuân theo rule nào.

---

## BR-01 — Unique Email

Mỗi User Account phải sử dụng Email duy nhất trong hệ thống.

**Related Area:** Authentication / User Management

---

## BR-02 — Unique Enrollment

Một Student không được có duplicate Enrollment cho cùng một Course.

**Related Requirement:** FR-02

---

## BR-03 — Public Course Visibility

Chỉ Course ở trạng thái được phép public theo Course lifecycle mới được hiển thị trong public Course discovery.

**Related Requirements:** FR-01, FR-06

---

## BR-04 — Teacher Resource Ownership

Teacher chỉ được chỉnh sửa và quản lý các Course/resource thuộc phạm vi ownership của mình.

**Related Requirement:** FR-04

---

## BR-05 — Course Review Authority

Chỉ Admin được phép thực hiện Approve hoặc Reject Course trong Course Review workflow.

**Related Requirement:** FR-06

---

## BR-06 — Learning Progress Range

Learning Progress phải được quản lý trong phạm vi từ 0% đến 100%.

**Related Requirement:** FR-03

---

## BR-07 — AI Result Boundary

AI Tutor không được tự động tạo, quyết định hoặc thay đổi official Quiz Result của Student.

**Related Requirement:** FR-08

---

## 2. Business Rule Mapping

| Rule  | Related Requirement            | Purpose                          |
| ----- | ------------------------------ | -------------------------------- |
| BR-01 | Authentication/User Management | Bảo đảm Email uniqueness         |
| BR-02 | FR-02                          | Ngăn duplicate Enrollment        |
| BR-03 | FR-01, FR-06                   | Kiểm soát Course visibility      |
| BR-04 | FR-04                          | Bảo vệ Teacher ownership         |
| BR-05 | FR-06                          | Giới hạn Course Review authority |
| BR-06 | FR-03                          | Kiểm soát Progress value         |
| BR-07 | FR-08                          | Giới hạn quyền của AI Tutor      |
