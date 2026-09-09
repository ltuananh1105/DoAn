# Use Case Specifications

## UC-01 — Authenticate User

**Primary Actor:** Guest / Registered User

**Goal:**  
Cho phép User tạo Account hoặc Authentication vào LearnUp.

**Trigger:**  
User chọn Register hoặc Login.

**Preconditions:**

- Đối với Register: User chưa có Account với Email tương ứng.
- Đối với Login: User đã có Account hợp lệ.

**Main Flow — Login:**

1. User mở Login function.
2. System hiển thị Login form.
3. User nhập credential.
4. System xác thực credential.
5. System xác định Role và trạng thái Account.
6. System tạo Authentication session/token theo implemented behavior.
7. User được truy cập các function phù hợp với Role.

**Alternative / Exception Flow:**

- Credential không hợp lệ → System từ chối Login.
- JWT hết hạn hoặc không hợp lệ → protected request bị từ chối.
- Account không ở trạng thái cho phép truy cập → Login/access bị từ chối theo implemented behavior.

**Postconditions:**

- User được Authentication thành công hoặc request bị từ chối mà không cấp unauthorized access.

**Related Area:** Authentication / Security

---

# UC-02 — Create & Manage Course

**Primary Actor:** Teacher

**Goal:**  
Teacher tạo và quản lý Course Content thuộc quyền sở hữu.

**Trigger:**  
Teacher chọn chức năng tạo hoặc quản lý Course.

**Preconditions:**

- Teacher đã Authentication.
- User có Teacher Role.

**Main Flow:**

1. Teacher tạo Course.
2. System ghi nhận Course thuộc Teacher.
3. Teacher cập nhật Course information.
4. Teacher quản lý Chapter.
5. Teacher quản lý Lesson.
6. Teacher quản lý Quiz và nội dung liên quan.
7. System lưu các thay đổi hợp lệ.

**Exception Flow:**

- Teacher cố chỉnh sửa resource không thuộc ownership → System từ chối operation.
- Dữ liệu không hợp lệ → System từ chối request theo validation hiện có.

**Postconditions:**

- Course Content hợp lệ được lưu.
- Ownership của resource được duy trì.

**Related Requirement:** FR-04  
**Related Business Rule:** BR-04

---

# UC-03 — Submit Course for Review

**Primary Actor:** Teacher

**Goal:**  
Teacher gửi một Course đủ điều kiện cho Admin review.

**Trigger:**  
Teacher chọn Submit Course.

**Preconditions:**

- Teacher đã Authentication.
- Course thuộc ownership của Teacher.
- Course đang ở trạng thái cho phép Submission.

**Main Flow:**

1. Teacher chọn Submit.
2. System kiểm tra Teacher authorization và ownership.
3. System kiểm tra Course submission condition.
4. Submission hợp lệ.
5. System chuyển Course sang Pending.
6. System xác nhận Submission thành công.

**Exception Flow — Invalid Submission:**

1. Course không đáp ứng Submission condition.
2. System từ chối request.
3. Course không chuyển sang Pending.

**Exception Flow — Unauthorized Ownership:**

1. Teacher cố Submit Course không thuộc ownership.
2. System từ chối operation.

**Postconditions:**

- Thành công: Course ở trạng thái Pending.
- Thất bại: Course giữ trạng thái phù hợp trước Submission.

**Related Requirement:** FR-05  
**Related Business Rule:** BR-04

---

# UC-04 — Review Course

**Primary Actor:** Admin

**Goal:**  
Admin review Course được Teacher Submit và quyết định Approve hoặc Reject.

**Trigger:**  
Admin chọn một Pending Course để Review.

**Preconditions:**

- Admin đã Authentication.
- User có Admin Role.
- Course đang ở trạng thái Pending.

**Main Flow — Approve:**

1. Admin mở Pending Course.
2. System hiển thị Course information.
3. Admin review Course.
4. Admin chọn Approve.
5. System kiểm tra authorization và Course state.
6. System cập nhật Course sang Published.
7. System xác nhận Review Result.

**Alternative Flow — Reject:**

1. Admin chọn Reject.
2. System yêu cầu/ghi nhận Rejection Reason theo implemented behavior.
3. Admin cung cấp Rejection Reason.
4. System cập nhật Course sang Rejected.
5. System lưu Review Result.

**Exception Flow — Unauthorized User:**

1. Non-Admin User cố thực hiện Approve hoặc Reject.
2. System kiểm tra authorization.
3. System từ chối operation.
4. Course Status không thay đổi.

**Postconditions:**

- Approve → Course = Published.
- Reject → Course = Rejected và Rejection Reason được ghi nhận.
- Unauthorized operation → Course Status không thay đổi.

**Related Requirement:** FR-06  
**Related Business Rules:** BR-03, BR-05

---

# UC-05 — Enroll in Course

**Primary Actor:** Student

**Goal:**  
Student đăng ký thành công một Published Course và nhận quyền truy cập Course theo Enrollment workflow.

**Trigger:**  
Student chọn chức năng Enroll/Register trên một Published Course.

**Preconditions:**

- Student đã Authentication với Student Role.
- Course tồn tại và đang ở trạng thái Published.
- Student chưa có Enrollment cho Course đó.

**Main Flow:**

1. Student truy cập thông tin Published Course.
2. System hiển thị Course information.
3. Student quyết định đăng ký Course.
4. Student chọn Enroll/Register.
5. System kiểm tra User, Course và Enrollment hiện tại.
6. System hiển thị simulated payment flow.
7. Student hoàn thành simulated payment.
8. System ghi nhận Enrollment giữa Student và Course.
9. System cấp Course access theo implemented workflow.
10. System xác nhận Enrollment thành công.

**Alternative Flow — Existing Enrollment:**

1. System phát hiện Student đã Enrollment vào Course.
2. System không tạo duplicate Enrollment.
3. Student được thông báo về trạng thái hiện tại.

**Exception Flow — Course Not Available:**

1. Course không ở trạng thái cho phép Enrollment.
2. System từ chối Enrollment.
3. Enrollment không được tạo.

**Postconditions:**

- Enrollment được ghi nhận.
- Student có Course access phù hợp.
- Không có duplicate Enrollment cho cùng Student và Course.

**Related Requirement:** FR-02  
**Related Business Rule:** BR-02

---

# UC-06 — Learn & Track Progress

**Primary Actor:** Student

**Goal:**  
Student truy cập Learning Content và theo dõi Learning Progress.

**Trigger:**  
Student mở Course/Lesson đã có quyền truy cập.

**Preconditions:**

- Student đã Authentication.
- Student có Enrollment phù hợp.
- Course/Lesson tồn tại và Student được quyền truy cập.

**Main Flow:**

1. Student mở Course.
2. Student chọn Lesson.
3. System hiển thị Learning Content.
4. Student thực hiện Learning Activity.
5. Progress được cập nhật theo implemented behavior.
6. System lưu Progress.
7. Student xem Learning Progress hiện tại.

**Exception Flow:**

- Student không có Enrollment/access phù hợp → System từ chối restricted content access.

**Postconditions:**

- Learning Progress được lưu theo trạng thái hiện tại.
- Progress nằm trong phạm vi hợp lệ.

**Related Requirement:** FR-03  
**Related Business Rule:** BR-06

---

# UC-07 — Complete Quiz

**Primary Actor:** Student

**Goal:**  
Student thực hiện Quiz và nhận Quiz Result.

**Trigger:**  
Student chọn một Quiz có quyền truy cập.

**Preconditions:**

- Student đã Authentication.
- Student có quyền truy cập Course/Quiz tương ứng.
- Quiz tồn tại và có thể được thực hiện theo implemented behavior.

**Main Flow:**

1. Student mở Quiz.
2. System khởi tạo Quiz.
3. System hiển thị Question.
4. Student chọn Answer.
5. Student Submit Quiz.
6. System xử lý Answer.
7. System lưu Quiz Result.
8. System hiển thị Result cho Student.

**Postconditions:**

- Quiz Result được ghi nhận.
- Student có thể truy cập kết quả theo implemented behavior.

**Related Requirement:** FR-03

---

# UC-08 — Use AI Tutor

**Primary Actor:** Authenticated User

**Supporting Actor:** Gemini API

**Goal:**  
User nhận AI-assisted English learning support.

**Trigger:**  
User nhập Prompt và gửi yêu cầu tới AI Tutor.

**Preconditions:**

- User đã Authentication.
- AI Tutor được cấu hình để sử dụng Gemini service.

**Main Flow:**

1. User nhập Prompt.
2. Frontend gửi request tới LearnUp Backend.
3. Backend xử lý request.
4. Backend gửi yêu cầu phù hợp tới Gemini API.
5. Gemini trả response.
6. Backend chuyển response về Client.
7. User nhận AI response.

**Exception Flow — AI Failure/Timeout:**

1. External AI service không phản hồi thành công.
2. Backend/UI xử lý error theo implemented behavior.
3. UI không duy trì trạng thái chờ vô thời hạn.

**Postconditions:**

- User nhận response hoặc error state phù hợp.
- AI Tutor không tự động thay đổi official Quiz Result.

**Related Requirement:** FR-08  
**Related Business Rule:** BR-07

---

# UC-09 — Manage Platform Data

**Primary Actor:** Admin

**Goal:**  
Admin quản lý các dữ liệu quản trị chính của LearnUp.

**Trigger:**  
Admin truy cập chức năng Platform Administration.

**Preconditions:**

- Admin đã Authentication.
- User có Admin Role.

**Main Flow:**

1. Admin chọn khu vực quản trị.
2. System hiển thị dữ liệu phù hợp.
3. Admin thực hiện operation được hệ thống hỗ trợ đối với User hoặc Course Category.
4. System kiểm tra authorization và validation.
5. System cập nhật dữ liệu hợp lệ.
6. System xác nhận operation.

**Exception Flow:**

- User không có Admin Role → System từ chối protected administration operation.
- Input không hợp lệ → System không cập nhật dữ liệu.

**Postconditions:**

- Dữ liệu hợp lệ được cập nhật.
- Unauthorized change không được thực hiện.

**Related Requirement:** FR-07
