# LearnUp — Requirement to System Mapping

## 1. Purpose

Tài liệu này cung cấp traceability từ Functional Requirement của LearnUp đến Use Case, Business Rule, System/API, Data Entity và Validation/Test Evidence.

Mục tiêu là giúp xác định:

- Requirement nào được hỗ trợ bởi System Capability nào.
- Business Rule nào chi phối Requirement.
- Data nào liên quan.
- Requirement được validation như thế nào.
- Khi Requirement thay đổi, những thành phần nào có khả năng bị ảnh hưởng.

High-level traceability:

```text
Business Objective
        ↓
Business Requirement
        ↓
Functional Requirement
        ↓
Use Case / User Story
        ↓
Business Rule
        ↓
System / API
        ↓
Data
        ↓
Acceptance Criteria
        ↓
Test / Validation
```

---

## 2. Requirement-System Traceability Matrix

| FR    | Capability                | Related Use Case                | Related Business Rule | Main System/API Area                  | Main Data Entities                                      | Validation Focus                            |
| ----- | ------------------------- | ------------------------------- | --------------------- | ------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| FR-01 | Public Course Discovery   | Public Course browsing behavior | BR-03                 | `/api/courses`                        | `courses`, `categories`                                 | Chỉ Course đủ điều kiện được public         |
| FR-02 | Student Enrollment        | UC-05                           | BR-02                 | Enrollment + Order APIs               | `users`, `courses`, `enrollments`, `orders`             | Successful Enrollment, duplicate prevention |
| FR-03 | Learning, Quiz & Progress | UC-06, UC-07                    | BR-06                 | Progress + Quiz APIs                  | `lessons`, `lesson_progress`, `quizzes`, `quiz_results` | Learning access, Progress, Quiz Result      |
| FR-04 | Course Content Management | UC-02                           | BR-04                 | Course, Chapter, Lesson, Quiz APIs    | `courses`, `chapters`, `lessons`, `quizzes`             | Teacher ownership                           |
| FR-05 | Course Submission         | UC-03                           | BR-04                 | `/api/courses/{id}/submit`            | `courses`                                               | Valid/invalid Submission, ownership         |
| FR-06 | Course Review             | UC-04                           | BR-03, BR-05          | Approve/Reject Course APIs            | `courses`, `users`                                      | Admin authorization, Approve/Reject         |
| FR-07 | Platform Administration   | UC-09                           | Authorization Rules   | User/Category Administration APIs     | `users`, `categories`                                   | Authorized administration                   |
| FR-08 | AI Tutor                  | UC-08                           | BR-07                 | `/api/ai/chat`, `/api/ai/chat/stream` | External AI interaction                                 | AI success/failure, Quiz Result protection  |

---

# 3. Detailed Trace — FR-01 Public Course Discovery

## Functional Requirement

**FR-01 — Public Course Discovery**

Guest/Student có thể browse, search và view các Course đủ điều kiện xuất hiện public.

## Related Business Rule

**BR-03 — Public Course Eligibility**

Course phải đáp ứng trạng thái phù hợp trước khi xuất hiện public.

## Main System Area

```text
/api/courses
```

## Main Data

```text
courses
categories
```

## Trace

```text
FR-01
Public Course Discovery
        |
        +---- BR-03
        |     Public Course Eligibility
        |
        +---- Course API
        |
        +---- Data
        |     courses
        |     categories
        |
        +---- Validation
              Public Course filtering
```

---

# 4. Detailed Trace — FR-02 Student Enrollment

## Functional Requirement

**FR-02 — Student Enrollment**

Student có thể Enrollment vào một Course đủ điều kiện thông qua Enrollment workflow được LearnUp hỗ trợ.

## Related Use Case

**UC-05 — Enroll in Course**

## Related User Story

**US-05 — Enroll in Course**

## Related Business Rule

**BR-02 — Unique Enrollment**

Một Student không được có duplicate Enrollment cho cùng một Course.

## Main Data Entities

```text
users
courses
orders
enrollments
```

## Main System/API Area

```text
/api/courses/{courseId}/enroll
/api/orders/check
/api/orders
/api/orders/{orderId}/demo-pay
```

## Trace

```text
OBJ-02
Course Discovery & Learning
        |
        v
BRQ-02
Course Discovery & Enrollment
        |
        v
FR-02
Student Enrollment
        |
        +---- UC-05
        |     Enroll in Course
        |
        +---- US-05
        |     Enroll in Course
        |
        +---- BR-02
        |     Unique Enrollment
        |
        +---- System
        |       Check current state
        |       Process Order
        |       Simulated Payment
        |       Create/confirm Enrollment
        |
        +---- Data
        |       users
        |       courses
        |       orders
        |       enrollments
        |
        +---- Validation
                Successful Enrollment
                Duplicate Enrollment Prevention
```

## Expected Validation

### Successful Enrollment

```text
Given Student đã Authentication
And Course đủ điều kiện Enrollment
And Student chưa Enrollment Course
When Student hoàn thành supported Enrollment flow
Then Enrollment được ghi nhận
And Student nhận Course access theo implemented behavior
```

### Duplicate Enrollment

```text
Given Student đã Enrollment Course
When Student cố Enrollment lại cùng Course
Then System không tạo duplicate Enrollment
```

---

# 5. Detailed Trace — FR-03 Learning, Quiz & Progress

## Functional Requirement

**FR-03 — Learning, Quiz & Progress**

Student có Course access phù hợp có thể truy cập Learning Content, thực hiện Quiz và theo dõi Progress/Result theo implemented behavior.

## Related Use Cases

- UC-06 — Learn & Track Progress
- UC-07 — Complete Quiz

## Related Business Rule

**BR-06 — Progress Range**

Learning Progress phải nằm trong phạm vi hợp lệ từ 0% đến 100%.

## Main System/API Areas

```text
/api/progress/student/...
/api/quizzes/...
```

## Main Data Entities

```text
lessons
lesson_progress
quizzes
questions
question_options
quiz_results
```

## Trace

```text
FR-03
Learning, Quiz & Progress
        |
        +---- UC-06
        |     Learn & Track Progress
        |
        +---- UC-07
        |     Complete Quiz
        |
        +---- BR-06
        |     Progress 0% - 100%
        |
        +---- System
        |     Progress APIs
        |     Quiz APIs
        |
        +---- Data
        |     lessons
        |     lesson_progress
        |     quizzes
        |     quiz_results
        |
        +---- Validation
              Authorized Learning Access
              Progress Update
              Quiz Submission
              Quiz Result
```

---

# 6. Detailed Trace — FR-04 Course Content Management

## Functional Requirement

**FR-04 — Course Content Management**

Teacher có thể tạo và quản lý Course Content thuộc ownership phù hợp.

## Related Use Case

**UC-02 — Create & Manage Course**

## Related User Story

**US-01 — Manage Course Content**

## Related Business Rule

**BR-04 — Teacher Ownership**

Teacher chỉ được quản lý resource thuộc ownership phù hợp.

## Main System/API Areas

```text
/api/courses
/api/chapters
/api/lessons
/api/quizzes/...
```

## Main Data Entities

```text
users
courses
chapters
lessons
quizzes
```

## Validation Focus

```text
Teacher owns resource
        |
        +---- Yes → operation may continue
        |
        +---- No → operation denied
```

---

# 7. Detailed Trace — FR-05 Course Submission

## Functional Requirement

**FR-05 — Course Submission**

Eligible Teacher có thể Submit owned Course cho Admin Review.

## Related Use Case

**UC-03 — Submit Course for Review**

## Related User Story

**US-02 — Submit Course**

## Related Business Rule

**BR-04 — Teacher Ownership**

## Main API

```text
/api/courses/{id}/submit
```

## Main Data Entity

```text
courses
```

## Trace

```text
OBJ-01
Course Management & Approval
        |
        v
BRQ-01
Course Lifecycle Management
        |
        v
FR-05
Course Submission
        |
        +---- UC-03
        |
        +---- US-02
        |
        +---- BR-04
        |     Teacher Ownership
        |
        +---- API
        |     /api/courses/{id}/submit
        |
        +---- Data
        |     courses
        |
        +---- State
        |     Valid → Pending
        |     Invalid → Not Pending
        |
        +---- Validation
              Successful Submission
              Invalid Submission
              Ownership Violation
```

## Expected Validation

### Valid Submission

```text
Given Teacher đã Authentication
And Teacher sở hữu Course
And Course đáp ứng Submission Conditions
When Teacher submits Course
Then Course Status becomes Pending
```

### Invalid Submission

```text
Given Teacher sở hữu Course
And Course không đáp ứng Submission Conditions
When Teacher submits Course
Then System rejects Submission
And Course Status does not become Pending
```

### Ownership Violation

```text
Given Course không thuộc Teacher
When Teacher attempts to submit Course
Then System rejects operation
And Course Status remains unchanged
```

---

# 8. Detailed Trace — FR-06 Course Review

## Functional Requirement

**FR-06 — Course Review**

Admin có thể Review Course đã được Submit và thực hiện Approve hoặc Reject.

## Related Use Case

**UC-04 — Review Course**

## Related User Story

**US-03 — Review Course**

## Related Business Rules

- **BR-03 — Public Course Eligibility**
- **BR-05 — Only Admin can Approve/Reject**

## Main System/API Area

```text
/api/courses/{id}/approve
/api/courses/{id}/reject
```

## Main Data Entities

```text
users
courses
```

## Trace

```text
OBJ-01
Course Management & Approval
        |
        v
BRQ-01
Course Lifecycle Management
        |
        v
FR-06
Course Review
        |
        +---- UC-04
        |
        +---- US-03
        |
        +---- BR-05
        |     Only Admin Approve/Reject
        |
        +---- API
        |     Approve Course
        |     Reject Course
        |
        +---- Data
        |     users
        |     courses
        |
        +---- State
        |     Pending → Published
        |     Pending → Rejected
        |
        +---- Validation
              Admin Approve
              Admin Reject
              Unauthorized Review
```

## Expected Validation

### Approve

```text
Given Admin đã Authentication
And Course đang Pending
When Admin approves Course
Then Course Status becomes Published
```

### Reject

```text
Given Admin đã Authentication
And Course đang Pending
When Admin rejects Course
And provides Rejection Reason
Then Course Status becomes Rejected
And Rejection Reason is recorded
```

### Unauthorized Review

```text
Given User không có Admin Role
And Course đang Pending
When User attempts Approve or Reject
Then System rejects operation
And Course Status remains unchanged
```

---

# 9. Detailed Trace — FR-07 Platform Administration

## Functional Requirement

**FR-07 — Platform Administration**

Admin có thể thực hiện các User và Category administration operation được LearnUp hỗ trợ.

## Related Use Case

**UC-09 — Manage Platform Data**

## Related User Story

**US-09 — Manage Platform Data**

## Main System/API Areas

```text
/api/users
/api/categories
```

Các administration/reporting area khác tồn tại theo implementation, ví dụ:

```text
/api/revenue/admin
```

## Main Data Entities

```text
users
categories
```

## Validation Focus

```text
Authenticated User
        |
        v
Admin Role?
   |
   +---- Yes → authorized operation
   |
   +---- No → operation denied
```

Sự tồn tại của revenue-related functionality không được xem là evidence của production commercial operation hoặc validated commercial KPI.

---

# 10. Detailed Trace — FR-08 AI Tutor

## Functional Requirement

**FR-08 — AI Tutor**

Authenticated User có thể gửi learning Prompt và nhận AI-assisted response thông qua LearnUp.

## Related Use Case

**UC-08 — Use AI Tutor**

## Related User Story

**US-10 — Use AI Tutor**

## Related Business Rule

**BR-07 — AI Result Protection**

AI không tự động tạo, thay đổi hoặc quyết định official Quiz Result.

## Main APIs

```text
/api/ai/chat
/api/ai/chat/stream
```

## External Dependency

```text
Gemini API
```

## Trace

```text
OBJ-02
Course Discovery & Learning
        |
        v
BRQ-06
AI-assisted Learning
        |
        v
FR-08
AI Tutor
        |
        +---- UC-08
        |
        +---- US-10
        |
        +---- BR-07
        |     Official Quiz Result Protection
        |
        +---- API
        |     /api/ai/chat
        |     /api/ai/chat/stream
        |
        +---- External System
        |     Gemini API
        |
        +---- Validation
              Successful AI Response
              AI Failure / Timeout
              Official Quiz Result Protection
```

---

# 11. Authentication, Authorization and Ownership

Ba concept này cần được phân biệt.

## Authentication

Trả lời:

> User là ai?

Ví dụ:

```text
Email / Password
      |
      v
Authentication
      |
      v
JWT
```

---

## Authorization

Trả lời:

> User có Role/quyền phù hợp để thực hiện capability này không?

Ví dụ:

```text
Admin
  |
  +---- Approve Course → Allowed

Student
  |
  +---- Approve Course → Denied
```

---

## Ownership

Trả lời:

> Resource cụ thể có thuộc quyền quản lý của User hay không?

Ví dụ:

```text
Teacher A
   |
   +---- Own Course → Allowed
   |
   +---- Teacher B Course → Denied
```

Do đó:

```text
Authentication
      ↓
Authorization
      ↓
Ownership Check
      ↓
Business Validation
      ↓
Operation
```

Không phải mọi capability đều cần toàn bộ các bước trên.

Ví dụ Admin Review Course cần Authorization theo Admin Role, trong khi Teacher Course Management còn cần kiểm tra ownership của resource.

---

# 12. Example End-to-End Traceability

Ví dụ Student Enrollment:

```text
Business Objective
OBJ-02
        ↓
Business Requirement
BRQ-02
        ↓
Functional Requirement
FR-02
        ↓
Use Case
UC-05
        ↓
User Story
US-05
        ↓
Business Rule
BR-02
        ↓
System/API
Enrollment + Order Flow
        ↓
Data
users + courses + orders + enrollments
        ↓
Acceptance Criteria
Successful / Duplicate Enrollment
        ↓
Test Scenario
Enrollment Success / Duplicate Prevention
```

Ví dụ Course Review:

```text
OBJ-01
   ↓
BRQ-01
   ↓
FR-06
   ↓
UC-04
   ↓
US-03
   ↓
BR-05
   ↓
Approve / Reject API
   ↓
courses
   ↓
AC Approve / Reject / Unauthorized
   ↓
Test Course Review Authorization
```

---

# 13. Why Traceability Matters

Requirement Traceability hỗ trợ BA trong các hoạt động:

### Requirement Coverage

Kiểm tra Requirement có được System hỗ trợ hay chưa.

### Test Coverage

Kiểm tra Requirement và Business Rule có Test/Validation tương ứng hay chưa.

### Change Impact Analysis

Khi Requirement thay đổi, BA có thể xác định:

```text
Requirement Change
        ↓
Affected Use Case
        ↓
Affected Business Rule
        ↓
Affected API
        ↓
Affected Data
        ↓
Affected Test
```

### Communication

Giúp Business, BA, Developer và Tester hiểu cùng một System Behavior từ các góc nhìn khác nhau.

---

# 14. Evidence Boundary

Requirement-System Mapping này được formalize retrospectively từ LearnUp implementation và project documentation để phục vụ BA Case Study.

Tài liệu không khẳng định:

- Requirements đã được elicited từ commercial client.
- User Stories đã được quản lý bằng Jira trong development.
- UAT đã được thực hiện với real client/end users.
- LearnUp đã production deployment.
- LearnUp sử dụng real payment gateway.
- Có production KPI, SLA hoặc production performance evidence.

Các validation và test artifact của LearnUp phải được mô tả trong phạm vi academic/local project environment.
