# LearnUp — Test Scenarios

## 1. Mục đích

Tài liệu này mô tả các Test Scenario chính nhằm kiểm tra các Functional Requirement, Business Rule và core workflow của LearnUp.

Các Test Scenario được formalize từ Requirement, implemented workflow và test evidence hiện có của LearnUp trong academic/local project environment.

Mục tiêu:

- Kiểm tra Functional Requirement có được System đáp ứng đúng hay không.
- Kiểm tra Business Rule có được enforce hay không.
- Kiểm tra Authentication, Authorization và Ownership.
- Kiểm tra các state transition quan trọng.
- Kiểm tra cách System xử lý các trường hợp lỗi và ngoại lệ.

---

## 2. Testing Approach

Các Test Scenario được xây dựng theo traceability:

```text
Functional Requirement
        ↓
Business Rule
        ↓
Acceptance Criteria
        ↓
Test Scenario
        ↓
Expected Result
        ↓
Actual Result
        ↓
PASS / FAIL
```

Test Scenario tập trung vào business/system behavior thay vì internal implementation detail.

---

## 3. TC-01 — Public Course Filtering

### Related Requirement

**FR-01 — Public Course Discovery**

### Related Business Rule

**BR-03 — Public Course Eligibility**

### Test Scenario

Xác minh System chỉ hiển thị các Course đủ điều kiện xuất hiện public.

### Preconditions

- LearnUp có các Course với nhiều trạng thái khác nhau.
- Có ít nhất một Course đủ điều kiện public.

### Test Steps

1. Guest hoặc Student truy cập danh sách Course.
2. System lấy danh sách Course có thể hiển thị public.
3. Kiểm tra các Course được trả về.

### Expected Result

- Các Course đủ điều kiện public được hiển thị.
- Các Course không đủ điều kiện không xuất hiện trong public Course list.

### Status

**PASS**

---

## 4. TC-02 — Duplicate Enrollment Prevention

### Related Requirement

**FR-02 — Student Enrollment**

### Related Business Rule

**BR-02 — Unique Enrollment**

### Test Scenario

Xác minh Student không thể tạo duplicate Enrollment cho cùng một Course.

### Preconditions

- Student đã đăng nhập thành công.
- Student đã Enrollment vào Course cần kiểm tra.

### Test Steps

1. Student truy cập Course đã Enrollment.
2. Student cố thực hiện Enrollment lại.
3. System xử lý Enrollment request.

### Expected Result

- System không tạo duplicate Enrollment.
- Enrollment hiện tại của Student với Course vẫn được giữ nguyên.
- Không xuất hiện Enrollment thứ hai cho cùng Student và Course.

### Status

**PASS**

---

## 5. TC-03 — Learning Progress Validation

### Related Requirement

**FR-03 — Learning, Quiz & Progress**

### Related Business Rule

**BR-06 — Progress Range**

### Test Scenario

Xác minh Learning Progress của Student được xử lý đúng theo implemented behavior.

### Preconditions

- Student đã đăng nhập thành công.
- Student có quyền truy cập Course và Learning Content.

### Test Steps

1. Student truy cập Learning Content.
2. Student thực hiện learning/progress action theo chức năng hiện có.
3. System xử lý Progress update.
4. Kiểm tra Learning Progress sau khi cập nhật.

### Expected Result

- Learning Progress được cập nhật theo implemented behavior.
- Progress nằm trong phạm vi hợp lệ từ 0% đến 100%.

### Status

**PASS**

---

## 6. TC-04 — Teacher Ownership Protection

### Related Requirement

**FR-04 — Course Content Management**

### Related Business Rule

**BR-04 — Teacher Ownership**

### Test Scenario

Xác minh Teacher không thể chỉnh sửa Course thuộc ownership của Teacher khác.

### Preconditions

- Teacher A đã đăng nhập thành công.
- Course cần kiểm tra thuộc Teacher B.
- Teacher A không sở hữu Course này.

### Test Steps

1. Teacher A cố thực hiện operation chỉnh sửa Course của Teacher B.
2. System kiểm tra Authorization và Ownership.
3. Kiểm tra kết quả operation.

### Expected Result

- System từ chối unauthorized operation.
- Course của Teacher B không bị thay đổi.
- Teacher A không thể vượt qua Ownership Rule.

### Test Evidence

Test evidence của LearnUp ghi nhận trường hợp Teacher thao tác trên resource không thuộc ownership bị từ chối.

### Status

**PASS**

---

## 7. TC-05 — Invalid Course Submission

### Related Requirement

**FR-05 — Course Submission**

### Related Business Rule

**BR-04 — Teacher Ownership**

### Test Scenario

Xác minh Course không đáp ứng Submission Conditions không thể chuyển sang Pending.

### Preconditions

- Teacher đã đăng nhập thành công.
- Teacher sở hữu Course.
- Course chưa đáp ứng Submission Conditions.

### Test Steps

1. Teacher chọn Course.
2. Teacher thực hiện Submit for Review.
3. System thực hiện validation.
4. Kiểm tra Course Status.

### Expected Result

- System từ chối invalid Submission.
- Course không chuyển sang Pending.
- Course vẫn có thể được Teacher chỉnh sửa theo implemented workflow.

### Test Evidence

Test evidence của LearnUp ghi nhận trường hợp thiếu dữ liệu cần thiết khi Submit bị từ chối và Course không chuyển sang Pending.

### Status

**PASS**

---

## 8. TC-06 — Unauthorized Course Review

### Related Requirement

**FR-06 — Course Review**

### Related Business Rule

**BR-05 — Only Admin can Approve/Reject Course**

### Test Scenario

Xác minh Student không có quyền Admin không thể Approve hoặc Reject Course đang ở trạng thái Pending.

### Preconditions

- Student đã đăng nhập thành công.
- Có Course đang ở trạng thái Pending.
- Student không có Admin Role.

### Test Steps

1. Student cố thực hiện Approve hoặc Reject trên Pending Course.
2. System kiểm tra Authorization.
3. Kiểm tra operation result và Course Status.

### Expected Result

- System từ chối Course Review operation.
- Course Status không thay đổi.
- Không xảy ra unauthorized state transition.

### Test Evidence

Test evidence của LearnUp ghi nhận non-Admin Course Review operation bị từ chối.

### Status

**PASS**

---

## 9. TC-07 — AI Failure / Timeout Handling

### Related Requirement

**FR-08 — AI Tutor**

### Related Business Rule

**BR-07 — AI Result Protection**

### Test Scenario

Xác minh LearnUp xử lý phù hợp khi external AI service gặp lỗi hoặc timeout.

### Preconditions

- User đã đăng nhập thành công.
- AI Tutor đã được cấu hình trong project environment.

### Test Steps

1. User gửi AI learning request.
2. External AI service xảy ra failure hoặc timeout trong tested flow.
3. Kiểm tra cách Frontend/Backend xử lý tình huống.

### Expected Result

- System xử lý failure thay vì để User chờ vô thời hạn.
- User nhận được error/failure handling theo implemented behavior.
- Official Quiz Result không bị thay đổi bởi AI interaction.

### Status

**PASS**

---

## 10. Additional Requirement-Derived Test Scenarios

Ngoài các Test Case có test evidence ở trên, Acceptance Criteria của LearnUp còn có thể được sử dụng để xây dựng thêm các Test Scenario sau:

| Test Scenario                         | Related Requirement | Expected Result                                                 |
| ------------------------------------- | ------------------- | --------------------------------------------------------------- |
| Successful Course Submission          | FR-05               | Valid owned Course chuyển sang Pending                          |
| Course Submission Ownership Violation | FR-05               | Operation bị từ chối và Course Status không thay đổi            |
| Admin Approves Pending Course         | FR-06               | Course chuyển từ Pending sang Published                         |
| Admin Rejects Pending Course          | FR-06               | Course chuyển sang Rejected và Rejection Reason được ghi nhận   |
| Successful Student Enrollment         | FR-02               | Enrollment được ghi nhận theo implemented workflow              |
| Course Not Available for Enrollment   | FR-02               | Enrollment bị từ chối                                           |
| Authorized Learning Access            | FR-03               | Student có quyền có thể truy cập Learning Content               |
| Unauthorized Learning Access          | FR-03               | Access bị từ chối                                               |
| Quiz Completion                       | FR-03               | Quiz được Submit và Result được xử lý theo implemented behavior |
| Authorized Platform Administration    | FR-07               | Admin operation được thực hiện                                  |
| Unauthorized Platform Administration  | FR-07               | Protected operation bị từ chối                                  |
| Successful AI Response                | FR-08               | User nhận được AI-assisted response                             |
| AI Result Protection                  | FR-08               | AI không tự động thay đổi official Quiz Result                  |

Các scenario trong bảng này là **requirement-derived validation coverage**.

Không ghi `PASS` cho các scenario này nếu chưa có execution evidence tương ứng.

---

## 11. Authentication vs Authorization vs Ownership Testing

Ba khái niệm này cần được phân biệt khi thiết kế Test Scenario.

### Authentication

Trả lời câu hỏi:

> User là ai và đã đăng nhập hợp lệ hay chưa?

Ví dụ:

```text
Unauthenticated User
        ↓
Protected Operation
        ↓
Access Denied
```

### Authorization

Trả lời câu hỏi:

> User đã Authentication nhưng Role của User có quyền thực hiện operation hay không?

Ví dụ:

```text
Student đã Login
        ↓
Attempt Approve Course
        ↓
Không có Admin Role
        ↓
Operation Denied
```

### Ownership

Trả lời câu hỏi:

> User có Role phù hợp nhưng resource này có thuộc quyền quản lý của User hay không?

Ví dụ:

```text
Teacher A đã Login
        ↓
Teacher Role hợp lệ
        ↓
Modify Teacher B Course
        ↓
Ownership không hợp lệ
        ↓
Operation Denied
```

Do đó:

```text
Authentication ≠ Authorization ≠ Ownership
```

---

## 12. Test Scenario vs Test Case

### Test Scenario

Trả lời:

> Cần kiểm tra tình huống nào?

Ví dụ:

```text
Xác minh duplicate Enrollment được ngăn chặn.
```

### Test Case

Mô tả cụ thể cách thực hiện validation:

```text
Preconditions
      ↓
Test Steps
      ↓
Expected Result
      ↓
Actual Result
      ↓
PASS / FAIL
```

Một Test Scenario có thể được triển khai thành nhiều Test Case nếu cần kiểm tra nhiều condition khác nhau.

---

## 13. Acceptance Criteria vs Test

Acceptance Criteria xác định điều kiện mà User Story hoặc Requirement phải đáp ứng để được chấp nhận.

Test xác minh System implementation có thực sự đáp ứng điều kiện đó hay không.

Ví dụ:

```text
Acceptance Criteria

Given Student đã Enrollment
When Student cố Enrollment lại
Then duplicate Enrollment không được tạo

                ↓

Test Scenario

Xác minh duplicate Enrollment prevention

                ↓

Test Execution

Expected Result
vs
Actual Result

                ↓

PASS / FAIL
```

---

## 14. Evidence Boundary

Các Test Scenario và Test Evidence trong tài liệu này thuộc LearnUp academic/local project environment.

Tài liệu không khẳng định LearnUp đã thực hiện:

- Production Testing.
- Client-led Testing.
- Real Customer Validation.
- Production Load Testing.
- Production Penetration Testing.
- Real Payment Gateway Testing.
- Production SLA Validation.

`PASS` chỉ được sử dụng cho các Test Scenario có test evidence tương ứng trong LearnUp project.

Các Test Scenario được bổ sung từ Requirement hoặc Acceptance Criteria không tự động được xem là đã executed.
