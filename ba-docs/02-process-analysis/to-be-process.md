# TO-BE / Implemented Process Analysis

## 1. Overview

Các process dưới đây mô tả những workflow được hỗ trợ bởi hệ thống LearnUp đã triển khai.

Do project không có validated external AS-IS Process, thuật ngữ TO-BE trong BA Case Study này được sử dụng để mô tả system-supported/implemented workflow thay vì khẳng định đây là quy trình cải tiến từ một quy trình doanh nghiệp có sẵn.

Các process chính gồm:

| ID  | Process                  | Primary Actor      |
| --- | ------------------------ | ------------------ |
| P01 | Course Creation & Review | Teacher, Admin     |
| P02 | Student Enrollment       | Student            |
| P03 | Learning Progress        | Student            |
| P04 | Quiz Execution           | Student            |
| P05 | AI Assistance            | Authenticated User |

---

# P01 — Course Creation & Review

## Objective

Cho phép Teacher xây dựng Course và gửi Course cho Admin review trước khi Course được public.

## Main Flow

1. Teacher tạo Course.
2. Teacher quản lý Course Content, bao gồm Chapter, Lesson và Quiz.
3. Teacher Submit Course for Review.
4. System kiểm tra các điều kiện cần thiết để Submit.
5. Nếu hợp lệ, System chuyển Course sang trạng thái Pending.
6. Admin truy cập Course cần Review.
7. Admin kiểm tra Course.
8. Admin quyết định Approve hoặc Reject.
9. Nếu Approve, Course chuyển sang Published và có thể được public.
10. Nếu Reject, Course chuyển sang Rejected và Rejection Reason được ghi nhận.
11. Teacher có thể chỉnh sửa Course bị Reject và tiếp tục xử lý theo workflow của hệ thống.

## Alternative / Exception Flow

### Invalid Submission

Nếu Course không đáp ứng điều kiện Submit:

- System từ chối request.
- Course không chuyển sang Pending.
- Course giữ trạng thái phù hợp trước khi Submit.

### Unauthorized Modification

Nếu Teacher cố gắng thay đổi resource không thuộc quyền sở hữu:

- System từ chối thao tác dựa trên authorization/ownership rule.

### Unauthorized Review

Nếu User không có Admin Role cố thực hiện Approve/Reject:

- System từ chối thao tác.

---

# P02 — Student Enrollment

## Objective

Cho phép Student đăng ký Course và nhận quyền truy cập theo Enrollment workflow.

## Main Flow

1. Student khám phá Course được public.
2. Student chọn Course.
3. Student bắt đầu Enrollment/payment flow.
4. System kiểm tra trạng thái Enrollment hiện tại.
5. Student hoàn thành simulated payment flow.
6. System tạo hoặc xác nhận Enrollment.
7. Student có thể truy cập Course theo quyền được cấp.

## Alternative / Exception Flow

Nếu Student đã Enrollment vào cùng Course:

- System ngăn duplicate Enrollment.

Payment trong workflow này là simulated payment và không thực hiện real financial transaction.

---

# P03 — Learning Progress

## Objective

Cho phép Student học Lesson và theo dõi tiến độ trong Course đã đăng ký.

## Main Flow

1. Student truy cập Course đã Enrollment.
2. Student mở Learning Content/Lesson.
3. Student hoàn thành Lesson.
4. Student/System cập nhật trạng thái Lesson Progress theo implemented behavior.
5. System lưu Progress.
6. Learning Progress của Course được cập nhật.
7. Student có thể xem Progress hiện tại.

## Business Constraint

Learning Progress được quản lý trong phạm vi từ 0% đến 100%.

---

# P04 — Quiz Execution

## Objective

Cho phép Student thực hiện Quiz và nhận kết quả.

## Main Flow

1. Student truy cập Quiz phù hợp.
2. System bắt đầu Quiz.
3. Student trả lời Question.
4. Student Submit Quiz.
5. System xử lý kết quả.
6. Quiz Result được lưu.
7. Student có thể xem kết quả.

---

# P05 — AI Assistance

## Objective

Cung cấp AI-assisted English learning support cho Authenticated User.

## Main Flow

1. User nhập Prompt.
2. Frontend gửi request đến LearnUp Backend.
3. Backend xử lý request và giao tiếp với Gemini API.
4. Gemini API trả response.
5. Backend chuyển response về Client.
6. User nhận AI response.

## Alternative / Exception Flow

Nếu external AI service gặp lỗi hoặc timeout:

- System xử lý failure theo implemented behavior.
- UI không được giữ ở trạng thái chờ vô thời hạn.

## Boundary

AI Tutor hỗ trợ quá trình học nhưng không tự động quyết định hoặc thay đổi official Quiz Result của hệ thống.
