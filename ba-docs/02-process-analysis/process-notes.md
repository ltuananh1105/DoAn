# Process Analysis Notes

## 1. Process Modeling Approach

LearnUp process analysis tập trung vào:

- Actor responsibility.
- Process step.
- System response.
- Decision point.
- Business Rule.
- Alternative Flow.
- Exception Flow.
- Process outcome.

Technical implementation như Controller, Repository, SQL Query và API endpoint không được đưa trực tiếp vào Business Process Diagram.

Các technical component sẽ được phân tích riêng trong System Analysis và Requirement-System Mapping.

---

## 2. Core Process Relationships

Các process chính của LearnUp có thể liên kết theo high-level flow:

Teacher creates Course
→ Course Review
→ Course Published
→ Student Enrollment
→ Learning
→ Quiz
→ Progress Tracking

AI Assistance là supporting process có thể được sử dụng trong quá trình học.

---

## 3. Course State Transition

Course lifecycle chính:

Draft
→ Pending
→ Published

hoặc:

Draft
→ Pending
→ Rejected
→ Teacher Revision
→ Resubmission

System implementation cũng có các operation liên quan đến Course lifecycle như Suspend, Restore và Archive. Các trạng thái/transition này cần được thể hiện dựa trên actual implementation khi xây dựng detailed state model.

---

## 4. Key Decision Points

### DP-01 — Course Valid for Submission?

Nếu Course đáp ứng điều kiện Submit:

→ chuyển sang Pending.

Nếu không:

→ từ chối Submission và không chuyển sang Pending.

### DP-02 — Course Approved?

Approve:

→ Course có thể chuyển sang Published.

Reject:

→ Course chuyển sang Rejected và ghi nhận Rejection Reason.

### DP-03 — Existing Enrollment?

Enrollment chưa tồn tại:

→ tiếp tục Enrollment flow.

Enrollment đã tồn tại:

→ ngăn duplicate Enrollment.

---

## 5. Process vs Requirement

Process mô tả workflow:

Teacher
→ Submit Course
→ Admin Review
→ Approve/Reject.

Requirement mô tả system behavior cần hỗ trợ process đó.

Ví dụ:

**Process Step**

Teacher submits Course for review.

**Functional Requirement**

System shall allow an authorized Teacher to submit an eligible owned Course for Admin review.

---

## 6. Process vs System Flow

Business Process tập trung vào:

- Ai thực hiện activity?
- Activity nào xảy ra?
- Decision nào được đưa ra?
- Outcome là gì?

System Flow có thể đi sâu hơn vào:

Frontend
→ REST API
→ Authorization
→ Business Logic
→ Database.

Hai mức phân tích này được giữ riêng để tránh đưa quá nhiều technical implementation vào Business Process Model.

---

## 7. BPMN Candidate

Process được ưu tiên xây dựng BPMN Diagram cho portfolio:

**P01 — Course Creation & Review**

Lý do:

- Có nhiều Actor.
- Có handoff giữa Teacher và Admin.
- Có System activity.
- Có Decision/Gateway.
- Có Business Rule.
- Có Alternative Flow.
- Có Exception Flow.
- Có status transition.
- Có thể trace đến Requirement, API, Database và Test Case.

Các process còn lại có thể được biểu diễn bằng Activity Diagram hoặc simplified process flow tùy mức độ cần thiết của portfolio.

---

## 8. Evidence Boundary

Các process trong tài liệu được formalize từ implemented LearnUp system và project documentation.

Không khẳng định rằng:

- Đây là workflow của một doanh nghiệp thực tế.
- AS-IS Process đã được khảo sát.
- Stakeholder đã xác nhận process thông qua Interview/Workshop.
- TO-BE Process đã được triển khai trong commercial production environment.
