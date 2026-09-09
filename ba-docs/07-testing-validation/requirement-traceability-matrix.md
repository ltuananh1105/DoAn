# LearnUp — Requirement Traceability Matrix

## 1. Mục đích

Tài liệu này xây dựng Requirement Traceability Matrix (RTM) cho LearnUp nhằm theo dõi Requirement xuyên suốt từ Business Objective đến System Validation.

RTM giúp trả lời:

- Requirement xuất phát từ Business Objective nào?
- Requirement được thể hiện qua Use Case/User Story nào?
- Business Rule nào chi phối Requirement?
- Acceptance Criteria nào dùng để xác định expected behavior?
- Test/UAT nào được sử dụng để validation?
- Requirement hiện có validation coverage hay chưa?

Traceability tổng quát:

```text
Business Objective
        ↓
Business Requirement
        ↓
Functional Requirement
        ↓
Use Case
        ↓
User Story
        ↓
Business Rule
        ↓
Acceptance Criteria
        ↓
Test / UAT
        ↓
Validation Status
```

---

## 2. Requirement Traceability Matrix

| FR    | Business Objective | Business Requirement | Use Case                        | User Story          | Business Rule       | Acceptance Criteria          | Test / Validation          | Status              |
| ----- | ------------------ | -------------------- | ------------------------------- | ------------------- | ------------------- | ---------------------------- | -------------------------- | ------------------- |
| FR-01 | OBJ-02             | BRQ-02               | Public Course browsing behavior | US-04               | BR-03               | Public Course eligibility    | TC-01                      | PASS                |
| FR-02 | OBJ-02             | BRQ-02               | UC-05                           | US-05               | BR-02               | AC-07, AC-08, AC-09          | TC-02, UAT-07, UAT-08      | PASS                |
| FR-03 | OBJ-02, OBJ-03     | BRQ-03, BRQ-04       | UC-06, UC-07                    | US-06, US-07, US-08 | BR-06               | AC-10, AC-11, AC-12, AC-13   | TC-03, UAT-09, UAT-10      | PASS                |
| FR-04 | OBJ-01             | BRQ-01               | UC-02                           | US-01               | BR-04               | AC-03 / Ownership validation | TC-04, UAT-03, UAT-11      | PASS                |
| FR-05 | OBJ-01             | BRQ-01               | UC-03                           | US-02               | BR-04               | AC-01, AC-02, AC-03          | TC-05, UAT-04              | PASS                |
| FR-06 | OBJ-01             | BRQ-01               | UC-04                           | US-03               | BR-03, BR-05        | AC-04, AC-05, AC-06          | TC-06, UAT-05, UAT-06      | PASS                |
| FR-07 | OBJ-04             | BRQ-05               | UC-09                           | US-09               | Authorization Rules | AC-14, AC-15                 | Admin validation scenarios | Coverage documented |
| FR-08 | OBJ-02             | BRQ-06               | UC-08                           | US-10               | BR-07               | AC-16, AC-17, AC-18          | TC-07, UAT-12, UAT-13      | PASS                |

---

## 3. FR-01 — Public Course Discovery

### Traceability

```text
OBJ-02
Course Discovery & Learning
        ↓
BRQ-02
Course Discovery & Enrollment
        ↓
FR-01
Public Course Discovery
        ↓
US-04
Discover Course
        ↓
BR-03
Public Course Eligibility
        ↓
TC-01
Public Course Filtering
        ↓
PASS
```

### Validation Focus

System chỉ hiển thị Course đủ điều kiện public.

Không phải mọi Functional Requirement bắt buộc phải có một standalone Use Case riêng. Trong LearnUp, Public Course Discovery được thể hiện qua public browsing behavior và related User Story.

---

## 4. FR-02 — Student Enrollment

### Traceability

```text
OBJ-02
        ↓
BRQ-02
        ↓
FR-02
Student Enrollment
        ↓
UC-05
Enroll in Course
        ↓
US-05
Enroll in Course
        ↓
BR-02
Unique Enrollment
        ↓
AC-07
Successful Enrollment
        +
AC-08
Duplicate Enrollment
        +
AC-09
Course Not Available
        ↓
TC-02
Duplicate Enrollment Prevention
        +
UAT-07
First Enrollment
        +
UAT-08
Duplicate Enrollment
        ↓
PASS
```

### Validation Coverage

Đã có validation evidence cho:

- Successful Enrollment workflow.
- Duplicate Enrollment prevention.

Course availability scenario được document trong Acceptance Criteria và có thể tiếp tục mở rộng thành detailed Test Case nếu cần thêm coverage.

---

## 5. FR-03 — Learning, Quiz & Progress

### Traceability

```text
OBJ-02 / OBJ-03
        ↓
BRQ-03 / BRQ-04
        ↓
FR-03
Learning, Quiz & Progress
        ↓
UC-06
Learn & Track Progress
        +
UC-07
Complete Quiz
        ↓
US-06 / US-07 / US-08
        ↓
BR-06
Progress Range
        ↓
AC-10 / AC-11 / AC-12 / AC-13
        ↓
TC-03
Learning Progress Validation
        +
UAT-09
Learning Progress
        +
UAT-10
Quiz Completion
        ↓
PASS
```

### Validation Focus

- Learning Content access.
- Learning Progress.
- Progress range.
- Quiz execution.
- Quiz Result.

---

## 6. FR-04 — Course Content Management

### Traceability

```text
OBJ-01
        ↓
BRQ-01
Course Lifecycle Management
        ↓
FR-04
Course Content Management
        ↓
UC-02
Create & Manage Course
        ↓
US-01
Manage Course Content
        ↓
BR-04
Teacher Ownership
        ↓
Ownership Acceptance Criteria
        ↓
TC-04
Teacher Ownership Protection
        +
UAT-03
Teacher Creates Course
        +
UAT-11
Teacher Ownership Protection
        ↓
PASS
```

### Validation Focus

Teacher có thể quản lý Course Content thuộc ownership của mình nhưng không thể chỉnh sửa resource của Teacher khác.

---

## 7. FR-05 — Course Submission

### Traceability

```text
OBJ-01
        ↓
BRQ-01
        ↓
FR-05
Course Submission
        ↓
UC-03
Submit Course for Review
        ↓
US-02
Submit Course
        ↓
BR-04
Teacher Ownership
        ↓
AC-01
Successful Submission
        +
AC-02
Invalid Submission
        +
AC-03
Ownership Violation
        ↓
TC-05
Invalid Course Submission
        +
UAT-04
Invalid Course Submission
        ↓
PASS
```

### Validation Focus

- Valid Course có thể chuyển sang Pending.
- Invalid Course không được chuyển sang Pending.
- Ownership phải được enforce.

---

## 8. FR-06 — Course Review

### Traceability

```text
OBJ-01
        ↓
BRQ-01
        ↓
FR-06
Course Review
        ↓
UC-04
Review Course
        ↓
US-03
Review Course
        ↓
BR-03
Public Course Eligibility
        +
BR-05
Only Admin Approve/Reject
        ↓
AC-04
Approve
        +
AC-05
Reject
        +
AC-06
Unauthorized Review
        ↓
TC-06
Unauthorized Course Review
        +
UAT-05
Admin Approves Course
        +
UAT-06
Admin Rejects Course
        ↓
PASS
```

### Validation Focus

```text
Admin Approve
Pending → Published

Admin Reject
Pending → Rejected

Non-Admin Review
Operation Denied
Status Unchanged
```

---

## 9. FR-07 — Platform Administration

### Traceability

```text
OBJ-04
Platform Administration
        ↓
BRQ-05
Platform Administration
        ↓
FR-07
Platform Administration
        ↓
UC-09
Manage Platform Data
        ↓
US-09
Manage Platform Data
        ↓
AC-14
Authorized Admin Operation
        +
AC-15
Unauthorized Admin Operation
        ↓
Admin Validation Coverage
```

### Validation Status

**Coverage documented**

FR-07 có Requirement và Acceptance Criteria rõ ràng.

Tuy nhiên, trong test evidence hiện được formalize cho portfolio, không gán một TC ID cụ thể nếu chưa có evidence tương ứng rõ ràng.

Do đó không tự động ghi `PASS` cho một Test Case chưa được xác nhận.

---

## 10. FR-08 — AI Tutor

### Traceability

```text
OBJ-02
        ↓
BRQ-06
AI-assisted Learning
        ↓
FR-08
AI Tutor
        ↓
UC-08
Use AI Tutor
        ↓
US-10
Use AI Tutor
        ↓
BR-07
AI Result Protection
        ↓
AC-16
AI Success
        +
AC-17
AI Failure
        +
AC-18
Quiz Result Protection
        ↓
TC-07
AI Failure / Timeout Handling
        +
UAT-12
AI Streaming
        +
UAT-13
AI Failure Handling
        ↓
PASS
```

### External Dependency

```text
LearnUp
   ↓
Gemini API
```

### Validation Focus

- Successful AI interaction.
- Streaming behavior.
- Failure/timeout handling.
- AI không tự động thay đổi official Quiz Result.

---

## 11. Security-related Validation

Authentication, Authorization và Ownership là cross-cutting concerns và có thể ảnh hưởng nhiều Requirement.

### Authentication

```text
User
 ↓
Login
 ↓
JWT
 ↓
Protected Function
```

Related validation:

**UAT-14 — Expired JWT**

### Authorization

```text
Authenticated User
        ↓
Role Check
        ↓
Allowed / Denied
```

Example:

**TC-06 — Unauthorized Course Review**

### Ownership

```text
Authenticated Teacher
        ↓
Teacher Role
        ↓
Resource Ownership
        ↓
Allowed / Denied
```

Example:

**TC-04 — Teacher Ownership Protection**

---

## 12. Requirement Coverage Summary

| Requirement | Requirement Defined | Use Case / Story | Acceptance Criteria | Validation Evidence | Overall Coverage                |
| ----------- | ------------------: | ---------------: | ------------------: | ------------------: | ------------------------------- |
| FR-01       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-02       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-03       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-04       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-05       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-06       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |
| FR-07       |                 Yes |              Yes |                 Yes |             Partial | Documented / Partial Validation |
| FR-08       |                 Yes |              Yes |                 Yes |                 Yes | Covered                         |

---

## 13. RTM trong Change Impact Analysis

RTM không chỉ phục vụ Testing.

Khi Requirement thay đổi, BA có thể trace:

```text
Requirement Change
        ↓
Affected Business Rule
        ↓
Affected Use Case
        ↓
Affected User Story
        ↓
Affected API
        ↓
Affected Data
        ↓
Affected Acceptance Criteria
        ↓
Affected Test / UAT
```

Ví dụ nếu Enrollment thay đổi từ simulated payment sang real payment gateway:

```text
FR-02
        ↓
UC-05
        ↓
US-05
        ↓
Enrollment Workflow
        ↓
Order / Payment Integration
        ↓
API + Data
        ↓
AC-07 / AC-08 / AC-09
        ↓
Enrollment Test / UAT
```

Đây là nền tảng cho Change Request và Impact Analysis ở Phase 08.

---

## 14. Evidence Boundary

RTM này được formalize retrospectively từ LearnUp Requirement, implementation và project validation evidence.

Tài liệu không khẳng định:

- Requirement được elicited từ commercial client.
- User Story được quản lý bằng Jira trong development.
- Formal client UAT đã được thực hiện.
- Production acceptance đã được thực hiện.
- Production testing đã được thực hiện.
- LearnUp có real payment gateway.
- LearnUp có production KPI hoặc SLA.

Các `PASS` status chỉ được sử dụng khi có project validation evidence tương ứng.

Các Requirement chưa có explicit executed test evidence được ghi nhận đúng mức coverage thay vì tự động gán `PASS`.
