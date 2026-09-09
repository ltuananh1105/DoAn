# LearnUp — Impact Analysis

## 1. Mục đích

Tài liệu này phân tích impact của Sample Change Request:

**CR-EX-01 — Real Payment Gateway Integration**

Change được đề xuất:

```text
Current:
Simulated Payment

Proposed:
Real Payment Gateway
```

Mục tiêu của Impact Analysis là xác định những Business Process, Requirement, System Component, Data, Security và Validation Artifact có khả năng bị ảnh hưởng trước khi đưa ra Change Decision.

CR-EX-01 là portfolio scenario, không phải Change Request thực tế từ client.

---

## 2. Impact Analysis Overview

Change không chỉ ảnh hưởng chức năng Payment.

Traceability tổng quát:

```text
CR-EX-01
Real Payment Gateway
        ↓
P02 — Student Enrollment
        ↓
FR-02 — Student Enrollment
        ↓
UC-05 — Enroll in Course
        ↓
US-05 — Enroll in Course
        ↓
Business Rules
        ↓
Acceptance Criteria
        ↓
Frontend / Backend / Data
        ↓
External Payment Gateway
        ↓
Security
        ↓
Testing / UAT
```

---

## 3. Business Process Impact

### Affected Process

**P02 — Student Enrollment**

Current flow:

```text
Student
   ↓
Select Course
   ↓
Enrollment Flow
   ↓
Order
   ↓
Simulated Payment
   ↓
Enrollment
   ↓
Course Access
```

Proposed high-level flow:

```text
Student
   ↓
Select Course
   ↓
Create Order
   ↓
Initiate Payment
   ↓
External Payment Gateway
   ↓
Payment Result
   ↓
Verify Payment
   ↓
Payment Successful?
   ├── Yes
   │     ↓
   │  Confirm Enrollment
   │     ↓
   │  Course Access
   │
   └── No
         ↓
      Do not complete Enrollment
         ↓
      Display Payment Result
```

### Process Impact

P02 cần được review vì Enrollment hiện phụ thuộc vào simulated payment, trong khi proposed flow phụ thuộc vào kết quả từ External Payment Gateway.

Các decision point mới có thể xuất hiện:

- Payment successful.
- Payment failed.
- Payment cancelled.
- Payment result chưa xác định.
- Duplicate payment request.

Các trạng thái trên là candidate behavior và cần được Requirement Clarification trước khi trở thành approved Requirement.

---

## 4. Business Objective Impact

### Related Objective

**OBJ-02 — Course Discovery & Learning**

Objective không nhất thiết phải thay đổi vì Student vẫn cần discover, enroll và access Course.

Tuy nhiên, cách System hỗ trợ Enrollment thay đổi đáng kể.

```text
Business Objective
        ↓
không nhất thiết thay đổi

Functional Solution
        ↓
thay đổi
```

Đây là ví dụ cho thấy một Change Request có thể thay đổi Functional Requirement/System Behavior mà không cần thay đổi Business Objective.

---

## 5. Business Requirement Impact

### Related Business Requirement

**BRQ-02 — Course Discovery & Enrollment**

Business Need cơ bản vẫn là:

> Student có thể đăng ký Course phù hợp để tham gia Learning Process.

Tuy nhiên, BRQ-02 cần được review nếu business muốn bổ sung yêu cầu rõ ràng rằng paid Course chỉ được Enrollment sau successful payment.

Không tự động sửa Business Requirement nếu stakeholder chưa xác nhận business rule mới.

---

## 6. Functional Requirement Impact

### Directly Affected Requirement

**FR-02 — Student Enrollment**

Current behavior:

```text
Student
   ↓
Enrollment
   ↓
Simulated Payment Flow
   ↓
Enrollment Recorded
```

Proposed behavior có thể trở thành:

```text
Student
   ↓
Create Order
   ↓
Real Payment
   ↓
Verify Successful Payment
   ↓
Create / Confirm Enrollment
```

FR-02 cần được review về:

- Payment initiation.
- Payment verification.
- Enrollment timing.
- Payment failure handling.
- Payment cancellation handling.
- Duplicate Enrollment.
- Duplicate transaction handling.
- Course Access timing.

---

## 7. Business Rule Impact

### Existing Rule

**BR-02 — Unique Enrollment**

```text
Student + Course
      ↓
Maximum one valid Enrollment
```

BR-02 vẫn cần được giữ.

Tuy nhiên, real payment tạo thêm các business question.

Ví dụ:

```text
Student
   ↓
Payment Successful
   ↓
Enrollment Creation Failed
```

hoặc:

```text
Student
   ↓
Payment Successful
   ↓
Payment Callback gửi nhiều lần
```

BA cần xác định liệu có cần formalize thêm Business Rule liên quan đến:

- Payment confirmation.
- Duplicate transaction processing.
- Enrollment creation after payment.
- Revenue recognition.
- Payment retry.

Các rule này chưa phải approved Requirement.

---

## 8. Use Case Impact

### Affected Use Case

**UC-05 — Enroll in Course**

Current Main Flow cần được review.

Proposed Main Flow:

```text
1. Student chọn Published Course.
2. Student chọn Enroll.
3. System kiểm tra Enrollment eligibility.
4. System tạo Order.
5. System khởi tạo Payment.
6. Student thực hiện Payment qua External Payment Gateway.
7. System nhận Payment Result.
8. System xác minh Payment Result.
9. Nếu Payment hợp lệ và successful, System xác nhận Enrollment.
10. Student nhận Course Access.
```

### Alternative / Exception Flow cần bổ sung

- Student đã Enrollment.
- Course không còn đủ điều kiện Enrollment.
- Payment failed.
- Payment cancelled.
- Payment result không hợp lệ.
- Payment Gateway unavailable.
- Payment successful nhưng Enrollment chưa được tạo thành công.

---

## 9. User Story Impact

### Affected User Story

**US-05 — Enroll in Course**

Current User Story có thể vẫn giữ User Goal:

> As a Student, I want to enroll in an available Course so that I can access its Learning Content.

Tuy nhiên, Acceptance Criteria của User Story phải được review vì cách đạt User Goal đã thay đổi.

Điều này cho thấy:

```text
User Goal
có thể không đổi

nhưng

Acceptance Criteria
có thể thay đổi
```

---

## 10. Acceptance Criteria Impact

Các Acceptance Criteria hiện liên quan:

- **AC-07 — Successful Enrollment**
- **AC-08 — Duplicate Enrollment**
- **AC-09 — Course Not Available**

### AC-07

Cần review để bổ sung payment condition.

Candidate behavior:

```text
Given
Student hợp lệ
AND Course đủ điều kiện
AND Student chưa Enrollment

When
Student hoàn tất valid successful payment

Then
Enrollment được xác nhận
AND Student nhận Course Access
```

### AC-08

Vẫn cần bảo đảm duplicate Enrollment không được tạo.

Ngoài ra cần xem xét duplicate payment processing.

### AC-09

Course không đủ điều kiện vẫn phải ngăn Enrollment trước khi Student đi sâu vào payment flow nếu business rule yêu cầu như vậy.

### Candidate New Acceptance Criteria

Có thể cần thêm AC cho:

- Payment Failed.
- Payment Cancelled.
- Invalid Payment Result.
- Payment Gateway Failure.
- Repeated Payment Callback.

Các AC trên chỉ là proposed coverage, chưa phải approved Requirement.

---

## 11. Frontend Impact

Potential affected areas:

### Enrollment UI

Current simulated payment interaction cần được thay đổi để hỗ trợ real payment flow.

### Payment Initiation

Frontend có thể cần:

- Bắt đầu Payment.
- Điều hướng User theo integration flow.
- Hiển thị trạng thái Payment.

### Payment Result

UI cần xử lý các outcome như:

```text
Successful
Failed
Cancelled
Pending / Unknown
```

Exact status phụ thuộc Payment Gateway và approved Requirement.

### Error Handling

Frontend cần tránh trường hợp:

```text
User thanh toán
      ↓
không biết kết quả
      ↓
không biết đã Enrollment hay chưa
```

---

## 12. Backend Impact

Backend có khả năng chịu impact lớn hơn Frontend.

Potential affected responsibilities:

### Order Management

- Tạo Order.
- Liên kết Order với Student và Course.
- Theo dõi trạng thái liên quan.

### Payment Integration

- Khởi tạo Payment request.
- Giao tiếp với External Payment Gateway.
- Nhận Payment Result/callback.
- Verify Payment Result.

### Enrollment

Enrollment logic cần xác định rõ:

```text
Valid Successful Payment
        ↓
Enrollment
```

thay vì dựa trên simulated payment.

### Duplicate Processing

Backend cần xem xét repeated request/callback để tránh xử lý cùng transaction nhiều lần.

---

## 13. API Impact

Current LearnUp có các API liên quan đến Order/Enrollment:

```text
/api/orders/check
/api/orders
/api/orders/{orderId}/demo-pay
/api/courses/{courseId}/enroll
```

CR-EX-01 có thể ảnh hưởng trực tiếp đến:

```text
/api/orders/{orderId}/demo-pay
```

vì đây là simulated payment behavior.

Các API còn lại cần được review để xác định:

- Có tiếp tục sử dụng hay không.
- Request/response có thay đổi không.
- Enrollment API được gọi tại thời điểm nào.
- Payment result được xử lý ở đâu.

### Potential New API Responsibilities

Có thể cần endpoint cho:

- Payment initiation.
- Payment result/callback.
- Payment verification.
- Payment status retrieval.

Không xác định endpoint cụ thể trước khi solution design được thống nhất.

---

## 14. Data Impact

Current related entities:

```text
users
courses
orders
enrollments
```

Real payment có thể yêu cầu bổ sung payment-related data.

Candidate information:

- Transaction Reference.
- Payment Status.
- Payment Method.
- Payment Amount.
- Payment Timestamp.
- Gateway Reference.

Các field trên là candidate data requirement, không phải current LearnUp schema.

### Potential Relationship

```text
Student
   ↓
Order
   ↓
Payment Transaction
   ↓
Enrollment
   ↓
Course
```

Có thể cần entity riêng cho Payment Transaction hoặc mở rộng Order, tùy solution design.

BA cần xác định business information cần lưu trước khi Dev quyết định physical database design.

---

## 15. External System Impact

New dependency:

**Real Payment Gateway**

LearnUp từ:

```text
Standalone simulated payment
```

chuyển thành:

```text
LearnUp
   ↕
External Payment Gateway
```

Điều này tạo ra dependency mới liên quan đến:

- Gateway availability.
- API contract.
- Authentication mechanism.
- Callback/result mechanism.
- Transaction status.
- Error handling.

---

## 16. Security Impact

Real payment làm tăng Security impact.

Cần review:

- Secure communication với Payment Gateway.
- Authentication/Authorization cho payment-related operation.
- Verification của payment result.
- Protection của transaction-related data.
- Không tin trực tiếp dữ liệu payment do Client gửi lên.
- Logging không làm lộ sensitive payment information.

LearnUp không nên tự lưu sensitive card information nếu không có requirement, architecture và security compliance phù hợp.

---

## 17. Revenue Impact

Current simulated payment không đại diện cho real transaction.

Nếu real payment được triển khai, Revenue logic cần được review.

Business question:

> Revenue được ghi nhận tại thời điểm nào?

Candidate rule:

```text
Successful Verified Payment
        ↓
Recognized Revenue
```

Tuy nhiên rule này phải được stakeholder xác nhận.

Các trường hợp cần làm rõ:

- Failed Payment.
- Cancelled Payment.
- Refund.
- Payment successful nhưng Enrollment failed.

---

## 18. Testing Impact

Existing validation liên quan FR-02:

```text
TC-02
Duplicate Enrollment Prevention

UAT-07
First Enrollment

UAT-08
Duplicate Enrollment
```

Các Test/UAT này cần được review sau Change.

### Potential New Test Scenarios

| Scenario                             | Expected Focus                                                |
| ------------------------------------ | ------------------------------------------------------------- |
| Successful Real Payment              | Enrollment chỉ hoàn tất theo approved successful-payment rule |
| Failed Payment                       | Không cấp Course Access ngoài approved behavior               |
| Cancelled Payment                    | Enrollment/Order được xử lý đúng Requirement                  |
| Duplicate Payment Request            | Không tạo transaction/enrollment sai                          |
| Repeated Callback                    | Không xử lý cùng payment nhiều lần                            |
| Invalid Payment Result               | Payment không được xác nhận                                   |
| Gateway Failure                      | System xử lý external failure phù hợp                         |
| Payment Success + Enrollment Failure | System có recovery/handling phù hợp                           |

Các scenario trên chưa có execution evidence và không được ghi `PASS`.

---

## 19. RTM Impact

Current trace:

```text
OBJ-02
  ↓
BRQ-02
  ↓
FR-02
  ↓
UC-05
  ↓
US-05
  ↓
BR-02
  ↓
AC-07 / AC-08 / AC-09
  ↓
TC-02 / UAT-07 / UAT-08
```

Sau khi CR được approved, BA cần update RTM để phản ánh Requirement và Validation mới.

Ví dụ:

```text
CR-EX-01
   ↓
FR-02 Updated
   ↓
UC-05 Updated
   ↓
US-05 Reviewed
   ↓
Business Rules Updated
   ↓
Acceptance Criteria Updated
   ↓
New / Updated Test Cases
   ↓
UAT
```

---

## 20. Impact Summary

| Area                   | Impact Level | Reason                                          |
| ---------------------- | ------------ | ----------------------------------------------- |
| Business Objective     | Low          | User Goal cơ bản không thay đổi                 |
| Business Requirement   | Medium       | Enrollment business behavior cần review         |
| Functional Requirement | High         | FR-02 thay đổi trực tiếp                        |
| Business Process       | High         | P02 có thêm external payment flow               |
| Use Case               | High         | UC-05 Main/Alternative Flow thay đổi            |
| User Story             | Medium       | User Goal tương tự nhưng AC thay đổi            |
| Business Rule          | High         | Cần làm rõ payment/enrollment rules             |
| Frontend               | High         | Payment interaction/result handling             |
| Backend                | High         | Payment integration và Enrollment logic         |
| API                    | High         | Demo payment behavior phải thay đổi             |
| Data                   | High         | Có thể cần payment transaction information      |
| External System        | High         | Xuất hiện Payment Gateway dependency            |
| Security               | High         | Real transaction làm tăng security requirements |
| Testing / UAT          | High         | Existing validation cần update và mở rộng       |

Impact Level trong bảng là assessment phục vụ portfolio scenario, không phải estimate chính thức từ Development Team.

---

## 21. Key Risks

### RISK-01 — Payment / Enrollment Inconsistency

```text
Payment Successful
        ↓
Enrollment Failed
```

Có thể dẫn đến Student đã trả tiền nhưng chưa có Course Access.

### RISK-02 — Duplicate Processing

Repeated request hoặc callback có thể gây duplicate processing.

### RISK-03 — External Dependency

Payment Gateway failure có thể làm gián đoạn Enrollment flow.

### RISK-04 — Security

Payment integration làm tăng yêu cầu về security và protection of transaction information.

### RISK-05 — Incorrect Revenue

Nếu Revenue được ghi nhận trước khi Payment được xác minh, reporting có thể không phản ánh đúng transaction outcome.

---

## 22. Recommendation

Không nên đưa CR-EX-01 trực tiếp sang implementation trước khi hoàn thành Requirement Clarification.

Recommended next steps:

1. Xác nhận Business Scope của real payment.
2. Chọn/định nghĩa Payment Gateway constraint nếu stakeholder đã quyết định.
3. Làm rõ Payment Status và Enrollment timing.
4. Làm rõ failure/cancel/retry behavior.
5. Làm rõ Revenue rule.
6. Xác định Refund có thuộc Scope hay không.
7. Update FR-02, UC-05 và Acceptance Criteria sau approval.
8. Review Data/API impact với Development Team.
9. Update Test Scenario, UAT và RTM.
10. Chỉ triển khai sau khi Change Decision được xác nhận.

---

## 23. Evidence Boundary

Impact Analysis này là **portfolio scenario** được xây dựng dựa trên current LearnUp simulated payment workflow.

Tài liệu không khẳng định:

- Real Payment Gateway đã được tích hợp.
- Client đã yêu cầu Change.
- Stakeholder đã approved Change.
- Development Team đã estimate Change.
- Candidate Business Rule đã được approved.
- Candidate Payment Status đã tồn tại trong current database.
- Payment-related Test Scenario đã được executed.
- LearnUp xử lý real production transaction.

Mục đích của tài liệu là chứng minh khả năng trace Change Request qua Requirement, Process, System, Data, Security và Validation.
