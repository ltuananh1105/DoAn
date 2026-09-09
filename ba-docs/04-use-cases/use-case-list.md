# Use Case List

## 1. Mục đích

Use Case List tổng hợp các interaction chính giữa Actor và LearnUp System nhằm đạt một goal cụ thể.

Use Case khác Business Process ở chỗ:

- Business Process mô tả workflow end-to-end giữa nhiều Actor và activity.
- Use Case tập trung vào một Actor sử dụng System để đạt một mục tiêu cụ thể.

---

## 2. Actors

### Guest

Có thể sử dụng các public function như:

- Xem Course được public.
- Tìm kiếm Course.
- Xem Course detail.
- Register.
- Login.

### Student

Có thể:

- Enroll Course.
- Truy cập Learning Content.
- Thực hiện Quiz.
- Theo dõi Learning Progress.
- Xem Quiz Result.
- Sử dụng AI Tutor.

### Teacher

Có thể:

- Tạo và quản lý Course.
- Quản lý Chapter, Lesson và Quiz.
- Submit Course cho Admin review.
- Quản lý các resource thuộc Course của mình.

### Admin

Có thể:

- Review Course.
- Approve/Reject Course.
- Quản lý User.
- Quản lý Course Category.
- Truy cập các thông tin quản trị được LearnUp cung cấp.

### Gemini API

Được xem là External System Actor trong AI interaction.

---

## 3. Use Case List

| ID    | Use Case                 | Primary Actor           | Goal                                          |
| ----- | ------------------------ | ----------------------- | --------------------------------------------- |
| UC-01 | Authenticate User        | Guest / Registered User | Register hoặc Login vào LearnUp               |
| UC-02 | Create & Manage Course   | Teacher                 | Tạo và quản lý Course Content                 |
| UC-03 | Submit Course for Review | Teacher                 | Gửi Course đủ điều kiện cho Admin review      |
| UC-04 | Review Course            | Admin                   | Approve hoặc Reject Course được Submit        |
| UC-05 | Enroll in Course         | Student                 | Đăng ký Course và nhận quyền truy cập phù hợp |
| UC-06 | Learn & Track Progress   | Student                 | Truy cập Lesson và theo dõi Learning Progress |
| UC-07 | Complete Quiz            | Student                 | Thực hiện Quiz và nhận Quiz Result            |
| UC-08 | Use AI Tutor             | Authenticated User      | Nhận AI-assisted English learning support     |
| UC-09 | Manage Platform Data     | Admin                   | Quản lý User và Course Category               |

---

## 4. Relationship với Business Process

| Process                        | Related Use Cases   |
| ------------------------------ | ------------------- |
| P01 — Course Creation & Review | UC-02, UC-03, UC-04 |
| P02 — Student Enrollment       | UC-05               |
| P03 — Learning Progress        | UC-06               |
| P04 — Quiz Execution           | UC-07               |
| P05 — AI Assistance            | UC-08               |

UC-01 hỗ trợ Authentication trước các Use Case yêu cầu authenticated access.

UC-09 hỗ trợ Platform Administration và không thuộc Course lifecycle chính.
