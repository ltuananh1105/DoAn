# Non-Functional Requirements

## 1. Mục đích

Non-Functional Requirement mô tả các quality attribute và technical constraint liên quan đến cách LearnUp vận hành.

Do project chưa thực hiện production-scale validation, tài liệu không tự bổ sung các performance target, uptime target hoặc concurrency target không có evidence.

---

## NFR-01 — Security

LearnUp phải bảo vệ Authentication và Authorization của User.

Implemented security mechanisms bao gồm:

- Password hashing bằng BCrypt.
- JWT-based Authentication.
- Role-based Access Control.
- Ownership validation đối với resource thuộc Teacher.
- Hạn chế quyền truy cập đối với operation yêu cầu Role cụ thể.

---

## NFR-02 — Data Integrity

System cần duy trì tính toàn vẹn của các dữ liệu quan trọng.

Các integrity control được thể hiện trong project bao gồm:

- Email uniqueness.
- Enrollment uniqueness.
- Progress-related data constraint.
- Business validation tại các workflow liên quan.

---

## NFR-03 — Usability

LearnUp được triển khai dưới dạng responsive web application.

UI hỗ trợ các trạng thái tương tác cần thiết như:

- Loading.
- Modal.
- Error feedback.
- Responsive presentation.

---

## NFR-04 — Performance & Responsiveness

AI Tutor hỗ trợ streaming response thông qua SSE để cải thiện trải nghiệm phản hồi trong AI interaction.

Project không xác định hoặc xác nhận các production performance target như response time SLA, throughput hoặc concurrent-user capacity.

---

## NFR-05 — Maintainability

Frontend và Backend được tổ chức với separation of concerns giữa các thành phần chính của application.

System structure hỗ trợ việc quản lý riêng:

- Frontend UI.
- Backend business logic.
- Data access.
- API communication.

---

## NFR-06 — Configuration & Portability

Các configuration quan trọng như:

- Database configuration.
- JWT configuration.
- CORS configuration.
- Gemini configuration.

được quản lý thông qua application/environment configuration phù hợp với implementation của project.

---

## 2. Validation Boundary

LearnUp chưa có evidence về:

- Production load testing.
- Defined SLA.
- Large-scale concurrency testing.
- Independent penetration testing.
- Production availability target.

Do đó các metric tương ứng không được tự bổ sung vào NFR.
