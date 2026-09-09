# LearnUp — API Mapping

## 1. Purpose

Tài liệu này mapping các Business/System Capability của LearnUp với các REST API được triển khai trong hệ thống.

Mục tiêu của API Mapping là giúp trace từ Requirement và Use Case xuống System Implementation.

Cần phân biệt:

```text
Requirement
→ System cần làm gì?

API
→ System expose capability đó như thế nào?
```

API là implementation của Requirement và không phải bản thân Business Requirement.

---

## 2. Authentication

### Business Capability

User có thể Register và Login vào LearnUp.

### Related Use Case

**UC-01 — Authenticate User**

### Relevant APIs

```text
/api/auth/register
/api/auth/login
```

### System Behavior

Register flow hỗ trợ việc tạo User Account theo implemented validation.

Login flow thực hiện Authentication và hỗ trợ JWT-based access theo implementation.

High-level flow:

```text
User
 |
 v
Register / Login
 |
 v
Authentication
 |
 v
Role-based Access
```

---

## 3. User Management

### Business Capability

LearnUp hỗ trợ User/Profile management và các User administration operation tương ứng.

### Related Requirement

**FR-07 — Platform Administration**

### Relevant API Area

```text
/api/users
```

Implemented operations trong User API area bao gồm các operation liên quan đến:

- Current User/Profile.
- User management.
- Password operations.
- Account status.
- Administrative User operations.

### System Consideration

Các protected operation phải tuân theo Authentication và Authorization phù hợp.

---

## 4. Public Course Discovery

### Business Capability

Guest và Student có thể khám phá các Course đủ điều kiện xuất hiện public.

### Related Requirement

**FR-01 — Public Course Discovery**

### Related Business Rule

**BR-03 — Public Course Eligibility**

### Relevant API Area

```text
/api/courses
```

### Expected Behavior

System chỉ expose Course phù hợp với public Course rule theo implemented behavior.

High-level flow:

```text
Guest / Student
      |
      v
Browse / Search Course
      |
      v
Course API
      |
      v
Eligible Public Courses
```

---

## 5. Course Content Management

### Business Capability

Teacher có thể tạo và quản lý Course Content thuộc ownership phù hợp.

### Related Requirement

**FR-04 — Course Content Management**

### Related Use Case

**UC-02 — Create & Manage Course**

### Related Business Rule

**BR-04 — Teacher Ownership**

### Relevant API Areas

```text
/api/courses
/api/chapters
/api/lessons
/api/quizzes/...
```

### Expected Behavior

System hỗ trợ Teacher:

- Create/update Course.
- Manage Chapter.
- Manage Lesson.
- Manage Quiz và related content.

Protected operation phải kiểm tra Role và ownership phù hợp với implemented behavior.

Teacher Role không đồng nghĩa với quyền quản lý Course của Teacher khác.

---

## 6. Course Submission

### Business Action

Teacher Submit Course cho Admin Review.

### Related Requirement

**FR-05 — Course Submission**

### Related Use Case

**UC-03 — Submit Course for Review**

### Related User Story

**US-02 — Submit Course**

### Related Business Rule

**BR-04 — Teacher Ownership**

### Relevant API

```text
/api/courses/{id}/submit
```

### Expected System Behavior

```text
Teacher
   |
   v
Submit owned Course
   |
   v
Authorization / Ownership / Validation
   |
   +---- Invalid → Submission rejected
   |
   +---- Valid → Course becomes Pending
```

System phải đảm bảo invalid Submission không làm Course chuyển sang Pending.

---

## 7. Course Review

### Business Action

Admin Review Course đã được Teacher Submit.

### Related Requirement

**FR-06 — Course Review**

### Related Use Case

**UC-04 — Review Course**

### Related User Story

**US-03 — Review Course**

### Related Business Rules

- **BR-03 — Public Course Eligibility**
- **BR-05 — Only Admin can Approve/Reject Course**

### Relevant APIs

```text
/api/courses/{id}/approve
/api/courses/{id}/reject
```

### Expected System Behavior

Approve flow:

```text
Pending
   |
Admin Approve
   |
   v
Published
```

Reject flow:

```text
Pending
   |
Admin Reject
   |
   v
Rejected
   |
   v
Rejection Reason recorded
```

Non-Admin User không được phép thực hiện protected Course Review operation.

Course Status không được thay đổi bởi unauthorized Review operation.

Các Course lifecycle operation khác như suspend, restore và archive cũng tồn tại trong implementation, nhưng không thay đổi core Course Review requirement được mô tả ở đây.

---

## 8. Student Enrollment

### Business Action

Student đăng ký một Published Course.

### Related Requirement

**FR-02 — Student Enrollment**

### Related Use Case

**UC-05 — Enroll in Course**

### Related User Story

**US-05 — Enroll in Course**

### Related Business Rule

**BR-02 — Unique Enrollment**

### Relevant APIs

```text
/api/courses/{courseId}/enroll
/api/orders/check
/api/orders
/api/orders/{orderId}/demo-pay
```

### High-Level System Flow

```text
Student
   |
   v
Select Published Course
   |
   v
Check current state
   |
   v
Order
   |
   v
Simulated Payment
   |
   v
Enrollment
   |
   v
Course Access
```

### Expected System Behavior

System cần hỗ trợ:

- Kiểm tra trạng thái liên quan trước Enrollment.
- Hỗ trợ Order flow.
- Hỗ trợ simulated payment.
- Ghi nhận Enrollment theo implemented behavior.
- Không tạo duplicate Enrollment cho cùng Student và Course.

### Data Impact

Main related entities:

```text
users
courses
orders
enrollments
```

Cần lưu ý:

`Payment` là business concept.

LearnUp hiện tại sử dụng simulated payment và không có evidence về real payment gateway.

---

## 9. Learning Progress

### Business Capability

Student có thể truy cập Learning Content và theo dõi Learning Progress.

### Related Requirement

**FR-03 — Learning, Quiz & Progress**

### Related Use Case

**UC-06 — Learn & Track Progress**

### Related Business Rule

**BR-06 — Progress Range**

### Relevant API Area

```text
/api/progress/student/...
```

Implementation có các operation liên quan đến Progress retrieval/update behavior, bao gồm toggle behavior.

### Expected System Behavior

System phải:

- Kiểm tra access phù hợp.
- Retrieve/update Learning Progress theo implemented behavior.
- Duy trì Progress trong phạm vi hợp lệ.

---

## 10. Quiz

### Business Capability

Student có thể thực hiện Quiz và nhận Quiz Result.

### Related Requirement

**FR-03 — Learning, Quiz & Progress**

### Related Use Case

**UC-07 — Complete Quiz**

### Related User Story

**US-08 — Complete Quiz**

### Relevant API Area

```text
/api/quizzes/...
```

Implemented capability bao gồm các operation liên quan đến:

- Quiz management.
- Start Quiz.
- Submit Quiz.
- Quiz history/result behavior.

### High-Level Flow

```text
Student
   |
   v
Start Quiz
   |
   v
Answer Questions
   |
   v
Submit Quiz
   |
   v
System processes answers
   |
   v
Quiz Result
```

---

## 11. Category and Administration

### Business Capability

Admin có thể thực hiện các Platform Administration operation được LearnUp hỗ trợ.

### Related Requirement

**FR-07 — Platform Administration**

### Related Use Case

**UC-09 — Manage Platform Data**

### Relevant API Areas

```text
/api/categories
/api/users
/api/revenue/admin
```

Ngoài ra implementation có Teacher-related API area:

```text
/api/teacher/{teacherId}/...
```

với các capability liên quan đến Teacher Course, Student và revenue information theo implementation.

### Evidence Boundary

Sự tồn tại của revenue-related API không được xem là evidence rằng LearnUp:

- đang vận hành thương mại thực tế;
- có production revenue;
- có validated commercial KPI;
- đã được triển khai production.

---

## 12. AI Tutor

### Business Action

Authenticated User gửi Prompt để nhận AI-assisted English learning support.

### Related Requirement

**FR-08 — AI Tutor**

### Related Use Case

**UC-08 — Use AI Tutor**

### Related User Story

**US-10 — Use AI Tutor**

### Related Business Rule

**BR-07 — AI Result Protection**

### External Dependency

**Gemini API**

### Relevant APIs

```text
/api/ai/chat
/api/ai/chat/stream
```

### High-Level System Flow

```text
User
 |
 v
Frontend
 |
 v
LearnUp Backend
 |
 v
Gemini API
 |
 v
LearnUp Backend
 |
 v
Frontend
 |
 v
User
```

### Expected System Behavior

System hỗ trợ:

- Nhận Prompt từ authenticated User.
- Backend xử lý AI request.
- Gửi request tới configured Gemini integration.
- Nhận và trả AI response.
- Hỗ trợ streaming flow theo implementation.
- Xử lý AI failure/timeout theo implemented behavior.

AI interaction không tự động tạo, thay đổi hoặc quyết định official Quiz Result.

---

## 13. API Mapping Summary

| Business Capability       | Related FR                   | Main API Area                           |
| ------------------------- | ---------------------------- | --------------------------------------- |
| Authentication            | Authentication/Security area | `/api/auth/register`, `/api/auth/login` |
| Public Course Discovery   | FR-01                        | `/api/courses`                          |
| Student Enrollment        | FR-02                        | Course Enrollment + Order APIs          |
| Learning & Progress       | FR-03                        | `/api/progress/student/...`             |
| Quiz                      | FR-03                        | `/api/quizzes/...`                      |
| Course Content Management | FR-04                        | Course/Chapter/Lesson/Quiz APIs         |
| Course Submission         | FR-05                        | `/api/courses/{id}/submit`              |
| Course Review             | FR-06                        | Approve/Reject Course APIs              |
| Platform Administration   | FR-07                        | User/Category/Admin APIs                |
| AI Tutor                  | FR-08                        | `/api/ai/chat`, `/api/ai/chat/stream`   |

---

## 14. Authorization vs Ownership

API Mapping phải xem xét cả Authorization và Ownership.

### Authorization

```text
User
 |
 v
Authentication
 |
 v
Role Check
 |
 v
Authorized Capability
```

Ví dụ:

```text
Admin → Approve Course → Allowed
Student → Approve Course → Denied
```

### Ownership

Đối với Teacher-owned resource:

```text
Teacher Role
    |
    v
Ownership Check
    |
    +---- Own Resource → Continue
    |
    +---- Other Teacher Resource → Denied
```

Do đó:

> Có đúng Role chưa chắc đã có quyền thao tác trên mọi resource.

---

## 15. BA API Analysis Principle

BA không nên bắt đầu từ câu hỏi:

> API này là GET hay POST?

Mà nên bắt đầu từ:

```text
Business Action
       ↓
Requirement
       ↓
System Capability
       ↓
API
       ↓
Data Impact
       ↓
Expected Result
```

Ví dụ:

```text
Student enrolls Course
       ↓
FR-02
       ↓
Enrollment Capability
       ↓
Enrollment + Order APIs
       ↓
users + courses + orders + enrollments
       ↓
Enrollment created
and duplicate Enrollment prevented
```

---

## 16. Mapping Cardinality

Không giả định:

```text
1 Requirement = 1 API
```

Một Requirement có thể cần nhiều API.

Ví dụ:

```text
FR-02 — Student Enrollment
        |
        +---- Check state
        |
        +---- Create/process Order
        |
        +---- Demo Payment
        |
        +---- Enrollment
```

Ngược lại, một API area cũng có thể hỗ trợ nhiều Requirement.

---

## 17. Evidence Boundary

API Mapping này được formalize từ LearnUp implementation và BA documentation để phục vụ Technical BA Case Study.

Tài liệu không giả định:

- API không tồn tại trong source.
- Real payment gateway.
- Production deployment.
- Production SLA.
- Production traffic/load.
- Commercial KPI chưa được validate.
