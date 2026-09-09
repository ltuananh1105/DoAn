# LearnUp — Sample Change Request

## 1. Mục đích

Tài liệu này mô tả một Sample Change Request được xây dựng cho LearnUp nhằm minh họa cách BA tiếp nhận, làm rõ và quản lý một yêu cầu thay đổi.

Change Request này là **portfolio scenario**, không phải Change Request thực tế từ client hoặc stakeholder trong quá trình phát triển LearnUp.

---

## 2. Change Request Information

| Field               | Detail                           |
| ------------------- | -------------------------------- |
| Change Request ID   | CR-EX-01                         |
| Change Title        | Real Payment Gateway Integration |
| Change Type         | Functional / Integration Change  |
| Priority            | Chưa xác định                    |
| Requested By        | Portfolio Scenario               |
| Current Status      | Proposed / Under Analysis        |
| Related Requirement | FR-02 — Student Enrollment       |
| Related Use Case    | UC-05 — Enroll in Course         |
| Related User Story  | US-05 — Enroll in Course         |

Không gán Priority hoặc Business Approval giả định vì Change Request này chưa được đánh giá bởi real stakeholder.

---

## 3. Current State

LearnUp hiện sử dụng simulated payment trong Enrollment flow.

Current flow ở mức high-level:

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

LearnUp hiện không tích hợp real payment gateway.

---

## 4. Proposed Change

Thay đổi Enrollment payment flow từ simulated payment sang real payment gateway integration.

Proposed flow ở mức high-level:

```text
Student
   ↓
Select Course
   ↓
Create Order
   ↓
Real Payment Gateway
   ↓
Payment Result
   ↓
Payment Successful?
   ├── Yes → Confirm Enrollment → Course Access
   │
   └── No  → Không hoàn tất Enrollment
```

Flow chính xác cần tiếp tục được Requirement Clarification trước khi implementation.

---

## 5. Business Reason

Change được đề xuất nhằm:

- Cho phép Student thực hiện real payment khi đăng ký Course.
- Ghi nhận Payment Status và transaction reference cần thiết.
- Hỗ trợ Revenue dựa trên successful payment thay vì simulated payment.
- Tạo nền tảng cho payment-related business workflow thực tế hơn.

Các business benefit cụ thể chưa được đo lường bằng production KPI vì LearnUp hiện là academic project.

---

## 6. Business Need

Current simulated payment phù hợp với phạm vi academic project nhưng không xử lý real transaction.

Nếu LearnUp cần hỗ trợ real commercial enrollment, System cần có khả năng:

```text
Order
   ↓
Payment
   ↓
Payment Verification
   ↓
Enrollment Decision
```

Enrollment không nên được xác nhận dựa trên simulated payment nếu scope đã chuyển sang real payment processing.

---

## 7. Affected Requirement

Requirement bị ảnh hưởng trực tiếp:

**FR-02 — Student Enrollment**

Current Requirement hỗ trợ Enrollment thông qua simulated payment flow.

Sau Change Request, FR-02 cần được review để xác định:

- Khi nào Enrollment được tạo hoặc xác nhận.
- Payment Status nào được xem là successful.
- System xử lý failed/cancelled payment như thế nào.
- Duplicate Enrollment được xử lý như thế nào khi có payment transaction.
- Course Access được cấp tại thời điểm nào.

Không update FR-02 chính thức trước khi Change Request được phân tích và approved.

---

## 8. Related BA Artifacts

CR-EX-01 có khả năng ảnh hưởng đến:

| Artifact               | Related Item                              |
| ---------------------- | ----------------------------------------- |
| Business Objective     | OBJ-02 — Course Discovery & Learning      |
| Business Requirement   | BRQ-02 — Course Discovery & Enrollment    |
| Functional Requirement | FR-02 — Student Enrollment                |
| Use Case               | UC-05 — Enroll in Course                  |
| User Story             | US-05 — Enroll in Course                  |
| Business Rule          | BR-02 — Unique Enrollment                 |
| Acceptance Criteria    | AC-07, AC-08, AC-09                       |
| Process                | P02 — Student Enrollment                  |
| Testing                | Enrollment Test Scenario / UAT            |
| Data Model             | Order, Enrollment và payment-related data |
| System Integration     | External Payment Gateway                  |

Các artifact trên là candidate impacts và cần được xác nhận trong Impact Analysis.

---

## 9. Requirement Clarification Questions

Trước khi Change được approved hoặc chuyển sang implementation, BA cần làm rõ các câu hỏi sau.

### Payment Gateway

- Payment Gateway nào sẽ được sử dụng?
- System có hỗ trợ một hay nhiều Payment Method?
- Payment Gateway cung cấp API/callback mechanism nào?

### Enrollment

- Enrollment được tạo trước hay sau successful payment?
- Student được Course Access tại thời điểm nào?
- Failed payment có tạo Enrollment hay không?
- Cancelled payment được xử lý như thế nào?

### Payment Status

Cần xác định các Payment Status cần hỗ trợ, ví dụ:

```text
Pending
Successful
Failed
Cancelled
```

Danh sách trên chỉ là candidate status và chưa phải approved Requirement.

### Duplicate Handling

- Student đã Enrollment có được tạo Order mới không?
- Nếu Student gửi payment request nhiều lần thì xử lý thế nào?
- Làm thế nào tránh duplicate Enrollment?
- Có cần ngăn duplicate successful payment hay không?

### Revenue

- Revenue được ghi nhận khi Order được tạo hay khi Payment successful?
- Failed/Cancelled transaction có được tính Revenue không?
- Revenue reporting hiện tại cần thay đổi như thế nào?

### Refund

- Refund có nằm trong Scope hay không?
- Nếu có, ai được phép thực hiện Refund?
- Refund ảnh hưởng Enrollment và Course Access như thế nào?

Refund chưa thuộc current LearnUp scope và không được mặc định thêm vào Requirement.

---

## 10. Initial Scope Impact

### Potential In Scope

Nếu CR-EX-01 được approved, Change có thể bao gồm:

- Real Payment Gateway integration.
- Payment initiation.
- Payment result handling.
- Payment verification.
- Payment Status management.
- Transaction reference management.
- Enrollment decision dựa trên valid payment result.
- Payment-related error handling.

### Potential Out of Scope

Các chức năng sau không tự động được đưa vào Scope:

- Refund.
- Subscription payment.
- Recurring payment.
- Installment payment.
- Multi-currency.
- Multiple payment gateways.
- Payment dispute management.

Các chức năng này cần Requirement/Change riêng nếu stakeholder yêu cầu.

---

## 11. Initial System Impact

Change có khả năng ảnh hưởng:

```text
Frontend
   ↓
Payment UI
Payment Redirect/Result
Error Handling

Backend
   ↓
Order Flow
Enrollment Flow
Payment Integration
Payment Verification
Callback/Result Handling

Data
   ↓
Order
Enrollment
Payment-related attributes/entities

External System
   ↓
Payment Gateway

Security
   ↓
Payment-related Security
Authentication / Authorization
Integration Security

Testing
   ↓
Successful Payment
Failed Payment
Cancelled Payment
Duplicate Payment
Duplicate Enrollment
Invalid Payment Result
```

Đây là initial impact identification. Chi tiết được phân tích trong `impact-analysis.md`.

---

## 12. Initial Risks

Các risk cần được xem xét:

### Integration Risk

LearnUp sẽ phụ thuộc vào external Payment Gateway.

### Data Integrity Risk

Payment, Order và Enrollment có thể không đồng bộ nếu transaction flow xử lý không chính xác.

Ví dụ:

```text
Payment Successful
        ↓
Enrollment Creation Failed
```

Đây là trường hợp cần business/system handling rõ ràng.

### Duplicate Transaction Risk

Repeated request hoặc repeated callback có thể dẫn đến duplicate processing nếu không có appropriate control.

### Security Risk

Real payment làm tăng yêu cầu về integration security và protection of payment-related data.

### User Experience Risk

Payment failure, cancellation hoặc delayed result có thể khiến Student không biết trạng thái Enrollment nếu UI không xử lý rõ ràng.

---

## 13. Change Decision

Current Decision:

**Under Analysis / Not Approved**

Lý do:

CR-EX-01 là portfolio scenario và chưa có real stakeholder approval.

Trong real project, sau Impact Analysis, Change có thể có một trong các decision:

```text
Approve
Reject
Defer
Request More Information
```

Chỉ khi Change được approved thì related Requirement và BA artifacts mới được update theo agreed scope.

---

## 14. Change Management Flow

```text
Change Requested
      ↓
Log Change Request
      ↓
Clarify Requirement
      ↓
Impact Analysis
      ↓
Review Scope / Risk / Effort
      ↓
Decision
 ┌────┼───────┬──────────────────────┐
 ↓    ↓       ↓                      ↓
Approve Reject Defer       Request More Information
 ↓
Update Requirements
 ↓
Update BA Artifacts
 ↓
Implementation
 ↓
Testing / UAT
 ↓
Close Change
```

---

## 15. BA Responsibility

Trong Change Request này, BA không chỉ chuyển yêu cầu:

> "Thêm real payment."

sang Development Team.

BA cần:

1. Làm rõ Business Need.
2. Xác định Requirement bị ảnh hưởng.
3. Xác định Scope Impact.
4. Phân tích Process/System/Data impact.
5. Xác định Business Rule và edge cases cần làm rõ.
6. Phối hợp đánh giá Risk và implementation impact.
7. Trace các artifact bị ảnh hưởng.
8. Cập nhật Requirement sau khi Change được approved.
9. Đảm bảo Acceptance Criteria và validation coverage được cập nhật.

---

## 16. Evidence Boundary

CR-EX-01 là **Sample Change Request / Portfolio Scenario** được xây dựng sau khi phân tích LearnUp.

Tài liệu không khẳng định:

- Real client đã yêu cầu Change này.
- Real stakeholder đã approved Change.
- LearnUp đã tích hợp real payment gateway.
- Production payment đã được thực hiện.
- Refund hoặc payment reconciliation đã được implementation.
- Change đã được Development Team estimate hoặc triển khai.

Mục đích của tài liệu là chứng minh khả năng áp dụng Change Management và Requirement Impact Analysis vào một system đã được xây dựng.
