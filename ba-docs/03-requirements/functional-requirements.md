# Functional Requirements

## 1. Mục đích

Functional Requirement mô tả các behavior/capability mà LearnUp System phải cung cấp để hỗ trợ Business Requirement và các workflow chính.

Các FR dưới đây được formalize dựa trên Functional Requirement đã được document trong LearnUp project.

---

## FR-01 — Public Course Discovery

**Description**

System shall allow Guest và Student khám phá, tìm kiếm và xem thông tin các Course được public.

**Expected Behavior**

- System chỉ hiển thị các Course đủ điều kiện public.
- User có thể truy cập thông tin public của Course.

**Related Business Requirement:** BRQ-02

---

## FR-02 — Student Enrollment

**Description**

System shall allow Student thực hiện Enrollment vào Course thông qua Enrollment/simulated payment workflow.

**Expected Behavior**

- System ghi nhận Enrollment của Student.
- System ngăn duplicate Enrollment cho cùng Student và Course.
- Payment trong project chỉ là simulated payment.

**Related Business Requirement:** BRQ-02

---

## FR-03 — Learning, Quiz & Progress

**Description**

System shall allow enrolled Student truy cập Learning Content, thực hiện Quiz và theo dõi Learning Progress.

**Expected Behavior**

- Student có thể truy cập nội dung học phù hợp.
- System lưu Progress.
- System xử lý và lưu Quiz Result.

**Related Business Requirements:** BRQ-03, BRQ-04

---

## FR-04 — Course Content Management

**Description**

System shall allow Teacher tạo và quản lý Course Content thuộc phạm vi Course của mình.

**Expected Behavior**

Teacher có thể quản lý:

- Course.
- Chapter.
- Lesson.
- Quiz và các nội dung liên quan.

System phải kiểm soát ownership đối với resource thuộc Teacher.

**Related Business Requirement:** BRQ-01

---

## FR-05 — Course Submission

**Description**

System shall allow Teacher Submit một Course đủ điều kiện cho Admin review.

**Expected Behavior**

- System kiểm tra điều kiện Submission.
- Submission hợp lệ chuyển Course từ Draft sang Pending.
- Submission không hợp lệ không được chuyển Course sang Pending.

**Related Business Requirement:** BRQ-01

---

## FR-06 — Course Review

**Description**

System shall allow Admin review Course được Teacher Submit và thực hiện Approve hoặc Reject.

**Expected Behavior**

- Approved Course có thể chuyển sang Published.
- Rejected Course được ghi nhận trạng thái Reject.
- Rejection Reason được ghi nhận theo implemented workflow.
- User không có Admin Role không được thực hiện Course Approval/Reject.

**Related Business Requirement:** BRQ-01

---

## FR-07 — Platform Administration

**Description**

System shall provide Admin các chức năng quản trị User và Course Category.

**Expected Behavior**

Admin có thể thực hiện các operation quản trị được LearnUp cung cấp đối với User và Category.

**Related Business Requirement:** BRQ-05

---

## FR-08 — AI Tutor

**Description**

System shall allow Authenticated User gửi Prompt và nhận AI-assisted English learning response thông qua AI Tutor.

**Expected Behavior**

- Frontend gửi request thông qua LearnUp Backend.
- Backend giao tiếp với Gemini API.
- System hỗ trợ AI response theo implemented behavior, bao gồm streaming response.
- AI failure/timeout phải được xử lý mà không để UI chờ vô thời hạn.

**Related Business Requirement:** BRQ-06

---

## 2. Functional Requirement Summary

| ID    | Requirement               | Related BRQ    |
| ----- | ------------------------- | -------------- |
| FR-01 | Public Course Discovery   | BRQ-02         |
| FR-02 | Student Enrollment        | BRQ-02         |
| FR-03 | Learning, Quiz & Progress | BRQ-03, BRQ-04 |
| FR-04 | Course Content Management | BRQ-01         |
| FR-05 | Course Submission         | BRQ-01         |
| FR-06 | Course Review             | BRQ-01         |
| FR-07 | Platform Administration   | BRQ-05         |
| FR-08 | AI Tutor                  | BRQ-06         |
