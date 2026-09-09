# Project Scope

## 1. Mục đích

Project Scope xác định phạm vi các Business Process, Function và System Capability được LearnUp hỗ trợ, đồng thời làm rõ những nội dung không nằm trong phạm vi của project và các giới hạn của phiên bản hiện tại.

LearnUp được phát triển trong phạm vi một academic project. Vì vậy, Scope trong tài liệu này được xác định dựa trên hệ thống đã triển khai và tài liệu project hiện có, không giả định thêm các Business Requirement hoặc commercial capability chưa được xác thực.

---

## 2. In Scope

### 2.1 Authentication & Access Control

LearnUp hỗ trợ:

- User Registration và Login.
- Authentication bằng JWT.
- Role-based Access Control cho Student, Teacher và Admin.
- Kiểm soát quyền truy cập vào các chức năng dựa trên Role.
- Kiểm soát quyền sở hữu đối với các resource thuộc Teacher.

### 2.2 Course Discovery

Student và Guest có thể:

- Xem các Course được public.
- Tìm kiếm và khám phá Course.
- Xem thông tin chi tiết của Course.

Course chỉ có thể được hiển thị công khai khi đã đạt trạng thái được phép public theo Course Review workflow.

### 2.3 Course & Content Management

Teacher có thể:

- Tạo và quản lý Course thuộc quyền sở hữu.
- Quản lý Chapter.
- Quản lý Lesson.
- Quản lý Quiz và Question liên quan đến Course.
- Chỉnh sửa Course Content trong phạm vi quyền được hệ thống cho phép.

### 2.4 Course Review & Approval

LearnUp hỗ trợ workflow:

Teacher tạo Course  
→ quản lý Course Content  
→ Submit Course  
→ Admin Review  
→ Approve hoặc Reject  
→ Course được public khi được Approve.

Nếu Course bị Reject, Teacher có thể chỉnh sửa nội dung và tiếp tục xử lý theo workflow của hệ thống.

### 2.5 Enrollment & Simulated Payment

Student có thể:

- Thực hiện Enrollment vào Course.
- Thực hiện simulated payment flow trong phạm vi project.
- Xem các Course đã đăng ký.
- Truy cập Course Content sau khi đáp ứng điều kiện Enrollment của hệ thống.

Hệ thống kiểm soát duplicate Enrollment đối với cùng Student và Course.

### 2.6 Learning & Progress Tracking

Student có thể:

- Truy cập Lesson thuộc Course đã đăng ký.
- Tham gia Learning Process.
- Ghi nhận trạng thái hoàn thành Lesson.
- Theo dõi Learning Progress trong Course.

Learning Progress được quản lý trong phạm vi từ 0% đến 100%.

### 2.7 Quiz & Result

LearnUp hỗ trợ:

- Teacher tạo và quản lý Quiz.
- Student thực hiện Quiz.
- Hệ thống xử lý và lưu Quiz Result.
- Student xem lại kết quả liên quan đến quá trình làm Quiz.

### 2.8 AI Tutor

Authenticated User có thể sử dụng AI Tutor để nhận hỗ trợ liên quan đến việc học tiếng Anh.

AI capability của LearnUp sử dụng Gemini API thông qua backend và hỗ trợ cả response dạng streaming trong phạm vi implementation hiện tại.

### 2.9 Platform Administration

Admin có thể:

- Quản lý User.
- Quản lý Course Category.
- Review và xử lý Course được Teacher submit.
- Truy cập các thông tin Revenue ở cấp độ nền tảng được hệ thống cung cấp.

---

## 3. Out of Scope

Các capability sau không nằm trong phạm vi của phiên bản LearnUp hiện tại:

### 3.1 Real Payment Processing

LearnUp không tích hợp real payment gateway hoặc hệ thống thanh toán ngân hàng thực tế.

Các payment-related function hiện tại chỉ phục vụ simulated payment flow trong phạm vi academic project.

### 3.2 Production Deployment

Project không bao gồm production deployment cho môi trường vận hành thương mại thực tế.

Hệ thống hiện được triển khai và kiểm thử trong local development environment.

### 3.3 Native Mobile Application

Project không bao gồm việc phát triển native mobile application cho Android hoặc iOS.

LearnUp được triển khai dưới dạng responsive web application.

### 3.4 Long-term AI Personalization

AI Tutor không bao gồm long-term personalization dựa trên lịch sử học tập dài hạn của từng Student.

### 3.5 Automated AI Grading of Business Results

AI Tutor không tự động tạo hoặc quyết định các score/result chính thức của hệ thống.

Quiz Result và các dữ liệu đánh giá của hệ thống không được AI tự động thay đổi ngoài các workflow đã được triển khai.

### 3.6 Production-scale Validation

Project không bao gồm:

- Large-scale load testing.
- Independent penetration testing.
- Real payment reconciliation.
- Validation trong production environment với lượng User thực tế ở quy mô thương mại.

---

## 4. Constraints

### CON-01 — Academic Project Environment

LearnUp được phát triển trong phạm vi academic project, do đó phạm vi triển khai và validation tập trung vào việc chứng minh các functional workflow và technical integration chính của hệ thống.

### CON-02 — Local Deployment

Frontend, Backend và SQL Server Database được triển khai và kiểm thử trong local environment thay vì production infrastructure.

### CON-03 — Simulated Payment

Payment capability bị giới hạn ở simulated payment flow và không thực hiện real financial transaction thông qua bank hoặc third-party payment gateway.

### CON-04 — AI Dependency

AI Tutor phụ thuộc vào external Gemini API.

Khả năng phản hồi của AI có thể phụ thuộc vào availability, configuration và response của external service.

### CON-05 — Web-based Platform

Phiên bản hiện tại được triển khai dưới dạng responsive web application và không bao gồm native mobile application.

---

## 5. Assumptions

Do LearnUp là academic project và không có evidence về một formal assumption log hoặc quá trình xác nhận Assumption với commercial stakeholder, tài liệu này không tự tạo thêm Business Assumption chưa được xác thực.

Các điều kiện đã được xác định rõ trong Requirement, Business Rule hoặc implemented system behavior được document tại các phần tương ứng thay vì được phân loại lại thành Assumption.

Nếu một Assumption mới được sử dụng trong quá trình phân tích sau này, Assumption đó cần:

1. Được ghi nhận rõ ràng.
2. Có nguồn hoặc lý do hình thành.
3. Được validate khi có Stakeholder hoặc evidence phù hợp.
4. Được cập nhật thành Requirement, Business Rule, Constraint hoặc loại bỏ nếu kết quả validation yêu cầu.

---

## 6. Scope Summary

| Area | Scope Status | Description |
|---|---|---|
| Authentication & Authorization | In Scope | Registration, Login, JWT, Role và ownership control |
| Course Discovery | In Scope | Browse, search và view public Course |
| Course Management | In Scope | Teacher quản lý Course, Chapter, Lesson và Quiz |
| Course Review | In Scope | Submit, Approve và Reject workflow |
| Enrollment | In Scope | Student Enrollment và duplicate prevention |
| Payment | Partially In Scope | Chỉ simulated payment |
| Learning Progress | In Scope | Lesson completion và Progress tracking |
| Quiz | In Scope | Quiz execution và Result |
| AI Tutor | In Scope | Gemini-based learning assistance |
| User & Category Management | In Scope | Admin administration |
| Revenue Information | In Scope | Platform-level Revenue information |
| Real Payment Gateway | Out of Scope | Không xử lý giao dịch tiền thật |
| Native Mobile App | Out of Scope | Không phát triển Android/iOS native app |
| Production Deployment | Out of Scope | Không triển khai commercial production environment |
| Long-term AI Personalization | Out of Scope | Không có long-term personalized learning model |
| Production-scale Testing | Out of Scope | Không có large-scale/load/security validation độc lập |

---

## 7. Scope Boundary

Scope của LearnUp tập trung vào việc triển khai và kiểm chứng các workflow chính của một online English learning platform gồm:

Course Creation  
→ Course Review  
→ Course Publication  
→ Enrollment  
→ Learning  
→ Quiz  
→ Progress Tracking  
→ Platform Administration

Các capability liên quan đến commercial production operation như real payment processing, production-scale deployment và large-scale validation không thuộc phạm vi của phiên bản hiện tại.