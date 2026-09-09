# LearnUp — Data Model Analysis

## 1. Purpose

Tài liệu này mô tả các Data Entity chính của LearnUp và relationship giữa chúng dưới góc nhìn Business Analysis và System Analysis.

Mục tiêu không phải mô tả toàn bộ physical database schema, mà làm rõ cách dữ liệu hỗ trợ các Business Requirement, Functional Requirement và Business Rule của LearnUp.

---

## 2. Core Data Entities

| Entity             | Business Meaning                                                            |
| ------------------ | --------------------------------------------------------------------------- |
| `users`            | Lưu thông tin User và Role trong LearnUp, bao gồm Student, Teacher và Admin |
| `categories`       | Phân loại các Course                                                        |
| `courses`          | Đại diện cho Course được Teacher tạo và quản lý                             |
| `chapters`         | Nhóm nội dung bên trong Course                                              |
| `lessons`          | Learning Content thuộc Chapter                                              |
| `enrollments`      | Ghi nhận quan hệ Student đăng ký Course                                     |
| `orders`           | Hỗ trợ Enrollment và simulated payment workflow                             |
| `quizzes`          | Quiz thuộc Learning Content                                                 |
| `questions`        | Question thuộc Quiz                                                         |
| `question_options` | Các Answer Option của Question                                              |
| `lesson_progress`  | Ghi nhận Learning Progress của Student                                      |
| `quiz_results`     | Ghi nhận kết quả Quiz của Student                                           |

---

## 3. Course Structure

Course là entity trung tâm của Course Management.

High-level relationship:

```text
Teacher (User)
      |
      | creates / owns
      v
    Course
      |
      +---- Category
      |
      +---- Chapter
      |       |
      |       +---- Lesson
      |
      +---- Quiz
              |
              +---- Question
                      |
                      +---- Question Option
```

Teacher tạo và quản lý Course thuộc ownership của mình.

Course có thể chứa Chapter, Lesson và Quiz phục vụ Learning Content.

Category được sử dụng để phân loại Course.

---

## 4. Student Enrollment

Student và Course có relationship nhiều-nhiều về mặt business:

- Một Student có thể enroll nhiều Course.
- Một Course có thể có nhiều Student.

Entity `enrollments` được sử dụng để biểu diễn relationship này.

```text
Student (User)
      |
      | 1
      |
      | N
 Enrollment
      | N
      |
      | 1
    Course
```

Enrollment mang business meaning:

> Student này đã đăng ký Course này.

Business Rule liên quan:

**BR-02 — Một Student không được có duplicate Enrollment cho cùng một Course.**

Do đó, Student/Course Enrollment phải duy trì uniqueness theo implemented data constraints và application validation.

---

## 5. Enrollment and Simulated Payment

Enrollment workflow của LearnUp có liên quan đến `orders`.

High-level business flow:

```text
Student
   |
   v
Select Course
   |
   v
Order / Simulated Payment
   |
   v
Enrollment
   |
   v
Course Access
```

Cần phân biệt:

**Payment** là business concept trong Enrollment workflow.

Trong implementation hiện tại, LearnUp sử dụng `orders` và simulated payment flow.

Không giả định tồn tại một entity riêng tên `payments` và không coi LearnUp là hệ thống có real payment gateway.

Main related entities:

- `users`
- `courses`
- `orders`
- `enrollments`

---

## 6. Learning Progress

Learning Progress cho phép LearnUp ghi nhận trạng thái học tập của Student đối với Learning Content.

High-level relationship:

```text
Student
   |
   v
Lesson Progress
   |
   v
Lesson
   |
   v
Chapter
   |
   v
Course
```

Entity `lesson_progress` hỗ trợ lưu trạng thái Learning Progress theo implemented behavior.

Business Rule liên quan:

**BR-06 — Learning Progress phải nằm trong phạm vi hợp lệ từ 0% đến 100%.**

---

## 7. Quiz and Assessment Data

Quiz structure:

```text
Quiz
 |
 +---- Question
 |       |
 |       +---- Question Option
 |
 +---- Quiz Result
          |
          +---- Student
```

Các Data Entity chính:

- `quizzes`
- `questions`
- `question_options`
- `quiz_results`

`quiz_results` ghi nhận kết quả Quiz của Student theo implemented behavior.

AI Tutor là capability hỗ trợ học tập và không tự động quyết định hoặc thay đổi official Quiz Result.

Business Rule liên quan:

**BR-07 — AI không tự động tạo, thay đổi hoặc quyết định official Quiz Result.**

---

## 8. Business Rule to Data Mapping

| Business Rule                     | Related Data                          | Data / System Impact                                       |
| --------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| BR-01 — Unique Email              | `users`                               | Email của User phải duy trì uniqueness                     |
| BR-02 — Unique Enrollment         | `enrollments`, `users`, `courses`     | Không tạo duplicate Enrollment cho cùng Student và Course  |
| BR-03 — Public Course Eligibility | `courses`                             | Course state quyết định khả năng xuất hiện public          |
| BR-04 — Teacher Ownership         | `users`, `courses` và owned resources | Teacher chỉ được quản lý resource thuộc ownership phù hợp  |
| BR-05 — Admin Course Review       | `users`, `courses`                    | Course review operation phải tuân theo Admin authorization |
| BR-06 — Progress Range            | `lesson_progress`                     | Learning Progress phải nằm trong phạm vi 0%–100%           |
| BR-07 — AI Result Protection      | `quiz_results`                        | AI interaction không tự động thay đổi official Quiz Result |

---

## 9. Authorization and Ownership from Data Perspective

Authorization và Ownership là hai concept khác nhau.

### Authorization

Authorization trả lời:

> User Role này có được phép thực hiện capability hay không?

Ví dụ:

```text
Admin
  |
  +---- Approve Course → Allowed

Student
  |
  +---- Approve Course → Denied
```

### Ownership

Ownership trả lời:

> Resource cụ thể này có thuộc quyền quản lý của User hay không?

Ví dụ:

```text
Teacher A
   |
   +---- Course owned by Teacher A → Allowed
   |
   +---- Course owned by Teacher B → Denied
```

Teacher Role không đồng nghĩa với quyền quản lý tất cả Course.

Điều này hỗ trợ:

**BR-04 — Teacher chỉ được quản lý resource thuộc ownership phù hợp.**

---

## 10. Key Data Relationships Summary

| Source       | Relationship    | Target              | Business Meaning                    |
| ------------ | --------------- | ------------------- | ----------------------------------- |
| Teacher/User | creates / owns  | Course              | Teacher quản lý Course của mình     |
| Category     | classifies      | Course              | Course được phân loại               |
| Course       | contains        | Chapter             | Course được chia thành các Chapter  |
| Chapter      | contains        | Lesson              | Chapter chứa Learning Content       |
| Student/User | enrolls through | Enrollment          | Student đăng ký Course              |
| Enrollment   | references      | Course              | Xác định Course Student đã đăng ký  |
| Order        | supports        | Enrollment workflow | Hỗ trợ simulated payment/enrollment |
| Quiz         | contains        | Question            | Quiz gồm các Question               |
| Question     | contains        | Question Option     | Question có các lựa chọn trả lời    |
| Student      | has             | Lesson Progress     | Theo dõi Learning Progress          |
| Student      | has             | Quiz Result         | Lưu Assessment Result               |

---

## 11. BA Analysis Notes

Business terminology và physical database terminology không phải lúc nào cũng giống nhau.

Ví dụ:

```text
Business Concept
Payment
      |
      v
Implemented Workflow / Data
Order + Simulated Payment
```

Do đó, BA không nên tự suy luận rằng:

> Có Payment Process thì Database phải có `payments` table.

Thay vào đó cần trace:

```text
Business Concept
        ↓
Requirement
        ↓
Implemented Workflow
        ↓
Actual Data Entity
```

Tương tự, Data Model không chỉ dùng để mô tả Database mà còn hỗ trợ:

- Requirement Analysis
- Business Rule validation
- API Mapping
- Impact Analysis
- Requirement Traceability
- Test Scenario design

---

## 12. Evidence Boundary

Data Model Analysis này được formalize từ LearnUp implementation và project documentation để phục vụ BA Case Study.

Tài liệu không giả định:

- Production-scale database architecture.
- Real payment gateway.
- Production transaction volume.
- Production performance metrics.
- Các Data Entity không có evidence trong LearnUp.
