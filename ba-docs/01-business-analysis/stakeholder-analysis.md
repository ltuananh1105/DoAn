# Stakeholder Analysis

## 1. Mục đích

Stakeholder Analysis được thực hiện nhằm xác định các nhóm người dùng chính có liên quan trực tiếp đến các Business Process và Requirement cốt lõi của LearnUp, đồng thời phân tích Need, Interest, Influence, Impact và Power của từng nhóm.

Do LearnUp là một academic project và không có Stakeholder Interview thực tế, các mức Power, Influence, Interest và Impact trong tài liệu này được phân tích dựa trên vai trò, quyền hạn và mức độ tham gia của từng Stakeholder trong workflow đã được triển khai trên hệ thống.

Trong phạm vi phân tích chính, ba Key Stakeholder được lựa chọn gồm:

- Student
- Teacher
- Admin

Guest vẫn được xem là một Actor của hệ thống nhưng không được đưa vào Key Stakeholder Matrix do chủ yếu tương tác với các chức năng public trước Authentication.

Gemini API được xem là External System/Dependency và không được phân tích như một human stakeholder.

---

## 2. Student

### 2.1 Role

Student là Primary User tham gia vào Learning Process của LearnUp, từ khám phá Course đến đăng ký, học tập, thực hiện Quiz và theo dõi Learning Progress.

### 2.2 Need

Student cần hệ thống hỗ trợ:

- Khám phá và đăng ký các Course trên nền tảng.
- Truy cập Learning Content của các Course đã đăng ký.
- Thực hiện Quiz trong quá trình học.
- Theo dõi Learning Progress và Quiz Result.
- Nhận hỗ trợ học tập thông qua AI Tutor.

### 2.3 Interest

Student quan tâm đến:

- Khả năng truy cập ổn định vào các Course đã đăng ký.
- Learning Progress được ghi nhận và hiển thị chính xác.
- Quiz Result được lưu và hiển thị chính xác.
- Các chức năng hỗ trợ học tập hoạt động nhất quán trong quá trình sử dụng Course.

### 2.4 Influence & Impact

**Influence: Medium**

Student không có quyền quản trị hoặc kiểm soát Course lifecycle, nhưng là Primary User của Learning Process. Nhu cầu và cách Student tương tác với hệ thống có liên quan trực tiếp đến các Requirement về Course Discovery, Enrollment, Learning, Quiz, Progress và AI Tutor.

**Impact: High**

Các thay đổi liên quan đến Enrollment, Course Access, Learning Content, Quiz hoặc Learning Progress có thể ảnh hưởng trực tiếp đến workflow học tập của Student.

---

## 3. Teacher

### 3.1 Role

Teacher là Primary User chịu trách nhiệm tạo và quản lý Learning Content thuộc các Course của mình và tham gia vào Course Review workflow thông qua việc Submit Course cho Admin xét duyệt.

### 3.2 Need

Teacher cần hệ thống hỗ trợ:

- Tạo và quản lý Course.
- Quản lý Chapter, Lesson và Quiz thuộc Course.
- Chỉnh sửa nội dung Course trong phạm vi quyền sở hữu.
- Submit Course để Admin review trước khi public.
- Theo dõi và quản lý các thông tin liên quan đến Course và Student trong phạm vi được hệ thống cho phép.

### 3.3 Interest

Teacher quan tâm đến:

- Course Content được lưu trữ và hiển thị chính xác.
- Course Status phản ánh đúng trạng thái hiện tại của Course.
- Kết quả Course Review được ghi nhận rõ ràng.
- Nội dung sau khi được public phản ánh đúng nội dung Course đã được quản lý và xét duyệt.
- Thông tin liên quan đến Student trong các Course thuộc phạm vi quản lý được ghi nhận chính xác.

### 3.4 Influence & Impact

**Influence: Medium**

Teacher kiểm soát việc tạo và quản lý nội dung của các Course thuộc quyền sở hữu nhưng không có quyền quyết định cuối cùng đối với việc Approve/Reject Course hoặc quản trị toàn bộ nền tảng.

**Impact: High**

Các thay đổi liên quan đến Course Management, Content Management, Submission/Review workflow hoặc Teacher Permission ảnh hưởng trực tiếp đến cách Teacher quản lý và vận hành Course.

---

## 4. Admin

### 4.1 Role

Admin chịu trách nhiệm thực hiện các hoạt động quản trị ở cấp độ nền tảng và đóng vai trò quyết định trong Course Review workflow.

### 4.2 Need

Admin cần hệ thống hỗ trợ:

- Quản lý User trên nền tảng.
- Quản lý Course Category.
- Review các Course được Teacher submit.
- Approve hoặc Reject Course trước khi Course được public.
- Theo dõi thông tin Revenue ở cấp độ nền tảng.

### 4.3 Interest

Admin quan tâm đến:

- Course chỉ được public sau khi hoàn thành đúng Review/Approval workflow.
- Course Status phản ánh chính xác kết quả Review.
- Dữ liệu User và Category được quản lý chính xác.
- Thông tin Revenue ở cấp độ nền tảng được ghi nhận và hiển thị chính xác.
- Các quyền truy cập và chức năng quản trị hoạt động đúng theo Role.

### 4.4 Influence & Impact

**Influence: High**

Admin có quyền quản trị ở cấp độ nền tảng và có quyền quyết định trong Course Review workflow, bao gồm Approve hoặc Reject Course trước khi Course được public.

**Impact: High**

Các thay đổi liên quan đến User Management, Category Management, Course Review/Approval, Authorization hoặc platform-level reporting ảnh hưởng trực tiếp đến workflow quản trị của Admin.

---

## 5. Stakeholder Matrix

| Stakeholder | Key Need | Key Interest | Influence | Impact |
|---|---|---|---|---|
| Student | Course Discovery, Enrollment, Learning, Quiz, Progress, AI Tutor | Course Access, Learning Progress và Quiz Result chính xác | Medium | High |
| Teacher | Course/Content Management, Course Submission | Content, Course Status và Review Result chính xác | Medium | High |
| Admin | User/Category Management, Course Review, Revenue Information | Review workflow, Course Status và dữ liệu quản trị chính xác | High | High |

---

## 6. Power – Interest Analysis

Power và Interest dưới đây được đánh giá dựa trên quyền hạn và mức độ tham gia của từng Stakeholder trong implemented workflow của LearnUp. Đây không phải là kết quả của Stakeholder Interview hoặc phân tích cơ cấu quyền lực của một tổ chức thực tế.

| Stakeholder | Power | Interest | Classification |
|---|---|---|---|
| Student | Low | High | Keep Informed |
| Teacher | Medium | High | Manage Closely |
| Admin | High | High | Manage Closely |

### Student — Low Power / High Interest

Student chịu ảnh hưởng trực tiếp bởi Learning Process nhưng không có quyền quản trị hoặc đưa ra các quyết định liên quan đến Course Approval và Platform Administration.

### Teacher — Medium Power / High Interest

Teacher có quyền kiểm soát Course Content thuộc phạm vi sở hữu nhưng Course vẫn phải trải qua Admin Review trước khi được public.

### Admin — High Power / High Interest

Admin có quyền quản trị cấp nền tảng và quyền quyết định trong Course Approval workflow, đồng thời trực tiếp sử dụng các chức năng quản trị của LearnUp.

---

## 7. Analysis Boundary

Stakeholder Analysis này tập trung vào ba Key Stakeholder có liên quan trực tiếp đến các Business Process cốt lõi của LearnUp.

Guest được ghi nhận trong Actor Analysis và Use Case Analysis đối với các public function như Course Browsing, Registration và Login nhưng không được đưa vào Key Stakeholder Matrix.

Gemini API được ghi nhận là External System/Dependency trong System Analysis và không được phân tích như một human stakeholder.