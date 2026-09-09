# LearnUp — UAT-style Validation

## 1. Mục đích

Tài liệu này mô tả các UAT-style Validation Scenario cho những business workflow chính của LearnUp.

Mục tiêu là kiểm tra System có đáp ứng các User Goal và expected business behavior đã được xác định trong Requirement hay không.

Các scenario được thực hiện trong phạm vi academic/local project environment.

Tài liệu này không đại diện cho formal UAT được thực hiện bởi real client hoặc production end users.

---

## 2. UAT Approach

UAT tập trung vào câu hỏi:

> System có hỗ trợ đúng business workflow và User Goal hay không?

Traceability:

```text
Business Objective
        ↓
Business Requirement
        ↓
Functional Requirement
        ↓
Use Case / User Story
        ↓
UAT Scenario
        ↓
Expected Business Result
        ↓
Validation Result
```

UAT khác với technical Test Case ở chỗ UAT tập trung nhiều hơn vào business/user outcome thay vì internal implementation detail.

---

## 3. UAT-01 — Valid Login

### Actor

Registered User

### Related Area

**UC-01 — Authenticate User**

### Business Goal

User có thể đăng nhập vào LearnUp bằng account hợp lệ để sử dụng các chức năng theo Role.

### Preconditions

- User đã có account hợp lệ.
- User chưa đăng nhập.

### Scenario

1. User truy cập Login.
2. User nhập thông tin đăng nhập hợp lệ.
3. User thực hiện Login.

### Expected Result

- User được Authentication thành công.
- User có thể tiếp tục sử dụng các chức năng phù hợp với Role.

### Validation Result

**PASS**

---

## 4. UAT-02 — Invalid Login

### Actor

User

### Related Area

**UC-01 — Authenticate User**

### Business Goal

System không cho phép User truy cập bằng thông tin đăng nhập không hợp lệ.

### Preconditions

- User đang ở Login flow.

### Scenario

1. User nhập thông tin đăng nhập không hợp lệ.
2. User thực hiện Login.

### Expected Result

- Authentication không thành công.
- User không nhận được authenticated access.

### Validation Result

**PASS**

---

## 5. UAT-03 — Teacher Creates Course

### Actor

Teacher

### Related Requirement

**FR-04 — Course Content Management**

### Related Use Case

**UC-02 — Create & Manage Course**

### Business Goal

Teacher có thể tạo Course để chuẩn bị Learning Content trước khi Submit for Review.

### Preconditions

- Teacher đã đăng nhập.
- Teacher có quyền sử dụng Course Management.

### Scenario

1. Teacher truy cập Course Management.
2. Teacher tạo Course.
3. Teacher nhập thông tin Course theo implemented flow.
4. Teacher lưu Course.

### Expected Result

- Course được tạo theo implemented behavior.
- Teacher có thể tiếp tục quản lý Course Content thuộc ownership của mình.

### Validation Result

**PASS**

---

## 6. UAT-04 — Invalid Course Submission

### Actor

Teacher

### Related Requirement

**FR-05 — Course Submission**

### Related Use Case

**UC-03 — Submit Course for Review**

### Business Goal

System không cho phép Course chưa đáp ứng Submission Conditions đi vào Admin Review.

### Preconditions

- Teacher đã đăng nhập.
- Teacher sở hữu Course.
- Course chưa đáp ứng Submission Conditions.

### Scenario

1. Teacher chọn Course.
2. Teacher thực hiện Submit for Review.
3. System thực hiện validation.

### Expected Result

- Submission bị từ chối.
- Course không chuyển sang Pending.
- Teacher có thể tiếp tục chỉnh sửa Course theo workflow.

### Validation Result

**PASS**

---

## 7. UAT-05 — Admin Approves Course

### Actor

Admin

### Related Requirement

**FR-06 — Course Review**

### Related Use Case

**UC-04 — Review Course**

### Business Goal

Admin có thể Approve Course đã được Teacher Submit để Course đủ điều kiện Published.

### Preconditions

- Admin đã đăng nhập.
- Course đang ở trạng thái Pending.

### Scenario

1. Admin truy cập Course Review.
2. Admin kiểm tra Pending Course.
3. Admin thực hiện Approve.

### Expected Result

- Course chuyển từ Pending sang Published.
- Course có thể tham gia public Course flow theo BR-03.

### Validation Result

**PASS**

---

## 8. UAT-06 — Admin Rejects Course

### Actor

Admin

### Related Requirement

**FR-06 — Course Review**

### Related Use Case

**UC-04 — Review Course**

### Business Goal

Admin có thể Reject Course chưa phù hợp và cung cấp Rejection Reason để Teacher có thể revise.

### Preconditions

- Admin đã đăng nhập.
- Course đang ở trạng thái Pending.

### Scenario

1. Admin truy cập Pending Course.
2. Admin thực hiện Reject.
3. Admin cung cấp Rejection Reason theo implemented workflow.

### Expected Result

- Course chuyển sang Rejected.
- Rejection Reason được ghi nhận.
- Teacher có thể revise và tiếp tục Course lifecycle theo supported workflow.

### Validation Result

**PASS**

---

## 9. UAT-07 — First Enrollment

### Actor

Student

### Related Requirement

**FR-02 — Student Enrollment**

### Related Use Case

**UC-05 — Enroll in Course**

### Business Goal

Student có thể đăng ký Course đủ điều kiện và nhận quyền truy cập Learning Content.

### Preconditions

- Student đã đăng nhập.
- Course đủ điều kiện Enrollment.
- Student chưa Enrollment Course.

### Scenario

1. Student chọn Course.
2. Student thực hiện Enrollment flow.
3. System xử lý Order/simulated payment theo implemented workflow.
4. Enrollment được xử lý.

### Expected Result

- Enrollment được ghi nhận.
- Student nhận Course access theo implemented behavior.
- Không cần real payment gateway.

### Validation Result

**PASS**

---

## 10. UAT-08 — Duplicate Enrollment Prevention

### Actor

Student

### Related Requirement

**FR-02 — Student Enrollment**

### Related Business Rule

**BR-02 — Unique Enrollment**

### Business Goal

Student không tạo nhiều Enrollment cho cùng một Course.

### Preconditions

- Student đã đăng nhập.
- Student đã Enrollment Course.

### Scenario

1. Student truy cập Course đã Enrollment.
2. Student cố thực hiện Enrollment lại.

### Expected Result

- System không tạo duplicate Enrollment.
- Existing Enrollment vẫn được giữ nguyên.

### Validation Result

**PASS**

---

## 11. UAT-09 — Learning Progress

### Actor

Student

### Related Requirement

**FR-03 — Learning, Quiz & Progress**

### Related Use Case

**UC-06 — Learn & Track Progress**

### Business Goal

Student có thể theo dõi Learning Progress trong quá trình học.

### Preconditions

- Student đã đăng nhập.
- Student có quyền truy cập Course và Learning Content.

### Scenario

1. Student truy cập Learning Content.
2. Student thực hiện learning/progress action.
3. System cập nhật Progress theo implemented behavior.

### Expected Result

- Learning Progress được ghi nhận/cập nhật.
- Progress nằm trong phạm vi 0%–100%.

### Validation Result

**PASS**

---

## 12. UAT-10 — Quiz Completion

### Actor

Student

### Related Requirement

**FR-03 — Learning, Quiz & Progress**

### Related Use Case

**UC-07 — Complete Quiz**

### Business Goal

Student có thể hoàn thành Quiz và nhận Result theo implemented behavior.

### Preconditions

- Student đã đăng nhập.
- Student có quyền truy cập Quiz.

### Scenario

1. Student bắt đầu Quiz.
2. Student trả lời Question.
3. Student Submit Quiz.

### Expected Result

- Quiz Submission được xử lý.
- Quiz Result được ghi nhận/hiển thị theo implemented behavior.

### Validation Result

**PASS**

---

## 13. UAT-11 — Teacher Ownership Protection

### Actor

Teacher

### Related Requirement

**FR-04 — Course Content Management**

### Related Business Rule

**BR-04 — Teacher Ownership**

### Business Goal

Course Content của Teacher không thể bị Teacher khác chỉnh sửa trái phép.

### Preconditions

- Teacher A đã đăng nhập.
- Target Course thuộc Teacher B.

### Scenario

1. Teacher A cố chỉnh sửa Course của Teacher B.
2. System kiểm tra quyền và Ownership.

### Expected Result

- Unauthorized operation bị từ chối.
- Course của Teacher B không bị thay đổi.

### Validation Result

**PASS**

---

## 14. UAT-12 — AI Streaming Response

### Actor

Authenticated User

### Related Requirement

**FR-08 — AI Tutor**

### Related Use Case

**UC-08 — Use AI Tutor**

### Business Goal

User có thể sử dụng AI Tutor để nhận AI-assisted learning response.

### Preconditions

- User đã đăng nhập.
- AI integration được cấu hình trong project environment.

### Scenario

1. User mở AI Tutor.
2. User nhập learning Prompt.
3. User gửi Prompt.
4. LearnUp xử lý request thông qua Gemini integration.

### Expected Result

- User nhận được AI-assisted response theo implemented streaming behavior.
- UI không cần chờ toàn bộ response mới bắt đầu xử lý nội dung nếu streaming flow được sử dụng.

### Validation Result

**PASS**

---

## 15. UAT-13 — AI Failure Handling

### Actor

Authenticated User

### Related Requirement

**FR-08 — AI Tutor**

### Business Goal

User không bị mắc kẹt trong AI workflow khi external AI service gặp failure.

### Preconditions

- User đã đăng nhập.
- AI Tutor đang được sử dụng.

### Scenario

1. User gửi AI request.
2. External AI service xảy ra failure hoặc timeout trong tested flow.
3. LearnUp xử lý failure.

### Expected Result

- System xử lý error/failure.
- User không bị giữ ở trạng thái chờ vô thời hạn.
- Official Quiz Result không bị AI interaction thay đổi.

### Validation Result

**PASS**

---

## 16. UAT-14 — Expired JWT

### Actor

Authenticated/Previously Authenticated User

### Related Area

**Authentication / Security**

### Business Goal

Protected functionality không được tiếp tục sử dụng bằng expired authentication credential.

### Preconditions

- User có JWT đã hết hạn.
- User cố truy cập protected functionality.

### Scenario

1. User thực hiện protected request bằng expired JWT.
2. System kiểm tra authentication credential.

### Expected Result

- Protected request không được xử lý như authenticated request.
- User phải thực hiện Authentication lại theo implemented behavior.

### Validation Result

**PASS**

---

## 17. UAT Summary

| UAT ID | Business Workflow         | Actor              | Result |
| ------ | ------------------------- | ------------------ | ------ |
| UAT-01 | Valid Login               | User               | PASS   |
| UAT-02 | Invalid Login             | User               | PASS   |
| UAT-03 | Create Course             | Teacher            | PASS   |
| UAT-04 | Invalid Course Submission | Teacher            | PASS   |
| UAT-05 | Approve Course            | Admin              | PASS   |
| UAT-06 | Reject Course             | Admin              | PASS   |
| UAT-07 | First Enrollment          | Student            | PASS   |
| UAT-08 | Duplicate Enrollment      | Student            | PASS   |
| UAT-09 | Learning Progress         | Student            | PASS   |
| UAT-10 | Quiz Completion           | Student            | PASS   |
| UAT-11 | Ownership Protection      | Teacher            | PASS   |
| UAT-12 | AI Streaming              | Authenticated User | PASS   |
| UAT-13 | AI Failure Handling       | Authenticated User | PASS   |
| UAT-14 | Expired JWT               | User               | PASS   |

---

## 18. UAT vs Test Case

### Test Case

Tập trung vào việc kiểm tra System Behavior cụ thể:

```text
Input / Preconditions
        ↓
Test Steps
        ↓
Expected Result
        ↓
Actual Result
        ↓
PASS / FAIL
```

### UAT

Tập trung vào User Goal và Business Workflow:

```text
User Goal
      ↓
Business Scenario
      ↓
System Behavior
      ↓
Expected Business Result
      ↓
Acceptance
```

Ví dụ:

```text
Test Case:
Student không thể duplicate Enrollment.

UAT:
Student có thể hoàn thành Enrollment workflow
mà không tạo dữ liệu đăng ký trùng.
```

---

## 19. Evidence Boundary

Các scenario trong tài liệu này được sử dụng như **UAT-style validation** trong phạm vi LearnUp academic/local project environment.

Không có evidence cho thấy formal UAT đã được thực hiện với:

- Real Client.
- Commercial Stakeholder.
- Production End User.
- Production Environment.

Do đó, portfolio và CV không nên sử dụng các claim như:

> "Conducted UAT with clients."

hoặc:

> "Led client UAT."

Cách mô tả phù hợp:

> "Developed UAT scenarios and validated core workflows in the project test environment."

Tài liệu này không khẳng định LearnUp đã được business client chính thức sign-off hoặc production acceptance.
