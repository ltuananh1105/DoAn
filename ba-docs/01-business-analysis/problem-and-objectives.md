# Problem and Objectives

## 1. Project Context

LearnUp là một nền tảng học tiếng Anh trực tuyến được phát triển trong phạm vi đồ án học thuật, nhằm xây dựng và triển khai các quy trình tương tác giữa ba nhóm người dùng chính: Student, Teacher và Admin.

Do LearnUp không được phát triển cho một doanh nghiệp hoặc khách hàng thương mại cụ thể, BA Case Study này không giả định rằng đã có một Business Problem thực tế được xác thực thông qua Stakeholder Interview, Survey hoặc phân tích quy trình vận hành của một tổ chức.

Thay vào đó, quá trình Business Analysis tập trung vào các System Need, Business Process, Requirement và Business Rule được thể hiện và có thể kiểm chứng từ hệ thống LearnUp đã triển khai.

## 2. System Need

LearnUp xác định nhu cầu xây dựng một nền tảng học trực tuyến tập trung, hỗ trợ toàn bộ vòng đời của Course và các hoạt động học tập giữa Student, Teacher và Admin.

Teacher cần một môi trường để tạo và quản lý nội dung Course, sau đó gửi Course cho Admin xét duyệt trước khi công khai. Admin cần quản lý người dùng, Course và các hoạt động quản trị của nền tảng. Student cần có khả năng khám phá, đăng ký, truy cập Course, tham gia học tập, thực hiện Quiz và theo dõi Learning Progress.

Thông qua một hệ thống thống nhất, các hoạt động từ tạo Course, xét duyệt, công bố, đăng ký, học tập, đánh giá đến theo dõi tiến độ có thể được tổ chức và quản lý theo một workflow xuyên suốt.

## 3. Project Objectives

### OBJ-01 — Course Management & Approval

Cho phép Teacher tạo và quản lý nội dung Course, đồng thời thiết lập quy trình xét duyệt trong đó Course được gửi cho Admin review trước khi có thể được công khai cho Student.

### OBJ-02 — Course Discovery & Learning

Cho phép Student khám phá và đăng ký các Course hiện có, truy cập Learning Content, thực hiện Quiz và nhận hỗ trợ học tập thông qua AI Tutor trong quá trình sử dụng nền tảng.

### OBJ-03 — Learning Progress & Results

Cho phép Student theo dõi Learning Progress và xem lại Quiz Result trong quá trình tham gia các Course đã đăng ký.

### OBJ-04 — Platform Administration

Cho phép Admin quản lý User, Course Category và truy cập các thông tin vận hành ở cấp độ nền tảng cần thiết cho việc quản trị LearnUp.

## 4. Objective Mapping

| Objective | Primary Stakeholder/Actor | Business Capability |
| --------- | ------------------------- | ------------------- |
| OBJ-01 | Teacher, Admin | Course Creation, Course Management, Review và Publication |
| OBJ-02 | Student | Course Discovery, Enrollment, Learning, Quiz và AI Assistance |
| OBJ-03 | Student | Learning Progress và Quiz Result Tracking |
| OBJ-04 | Admin | User Management, Category Management và Platform Administration |
