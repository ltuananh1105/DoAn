# Acceptance Criteria

## Documentation Note

Acceptance Criteria được formalize retrospectively từ LearnUp requirements, business rules, implemented workflows và validation evidence.

Given / When / Then được sử dụng để làm rõ các điều kiện có thể kiểm thử.

---

# US-02 — Submit Course

## AC-01 — Successful Submission

Given Teacher đã Authentication  
And Teacher sở hữu Course  
And Course đáp ứng Submission Conditions  
When Teacher submits the Course  
Then System accepts the submission  
And Course Status becomes Pending.

## AC-02 — Invalid Submission

Given Teacher đã Authentication  
And Teacher sở hữu Course  
And Course không đáp ứng Submission Conditions  
When Teacher submits the Course  
Then System rejects the submission  
And Course Status does not become Pending.

## AC-03 — Ownership Violation

Given Teacher đã Authentication  
And Course không thuộc ownership của Teacher  
When Teacher attempts to submit the Course  
Then System rejects the operation  
And Course Status remains unchanged.

---

# US-03 — Review Course

## AC-04 — Approve Course

Given Admin đã Authentication  
And Course đang ở trạng thái Pending  
When Admin approves the Course  
Then Course Status becomes Published.

## AC-05 — Reject Course

Given Admin đã Authentication  
And Course đang ở trạng thái Pending  
When Admin rejects the Course  
And provides a Rejection Reason  
Then Course Status becomes Rejected  
And Rejection Reason is recorded.

## AC-06 — Unauthorized Review

Given User đã Authentication  
And User không có Admin Role  
And Course đang ở trạng thái Pending  
When User attempts to Approve or Reject the Course  
Then System rejects the operation  
And Course Status remains unchanged.

---

# US-05 — Enroll in Course

## AC-07 — Successful Enrollment

Given Student đã Authentication  
And Course đang ở trạng thái Published  
And Student chưa có Enrollment cho Course  
When Student completes the supported Enrollment flow  
Then Enrollment is created  
And Student receives Course access according to implemented behavior.

## AC-08 — Duplicate Enrollment

Given Student đã có Enrollment cho Course  
When Student attempts to enroll in the same Course again  
Then System does not create a duplicate Enrollment.

## AC-09 — Course Not Available

Given Course không ở trạng thái cho phép Enrollment  
When Student attempts to enroll  
Then System rejects the Enrollment  
And no new Enrollment is created.

---

# US-06 / US-07 — Learning & Progress

## AC-10 — Authorized Learning Access

Given Student đã Authentication  
And Student có Enrollment phù hợp  
When Student accesses available Learning Content  
Then System allows access according to implemented behavior.

## AC-11 — Unauthorized Learning Access

Given Student không có required Course access  
When Student attempts to access restricted Learning Content  
Then System rejects unauthorized access.

## AC-12 — Progress Range

Given Student có Learning Progress  
When Progress được lưu hoặc truy xuất  
Then Progress remains within the valid range from 0% to 100%.

---

# US-08 — Complete Quiz

## AC-13 — Quiz Completion

Given Student có quyền truy cập Quiz  
When Student completes and submits the Quiz  
Then System processes the submitted answers  
And Quiz Result is recorded according to implemented behavior.

---

# US-09 — Manage Platform Data

## AC-14 — Authorized Administration

Given Admin đã Authentication  
When Admin performs a supported User or Category management operation with valid data  
Then System processes the authorized operation.

## AC-15 — Unauthorized Administration

Given User không có Admin Role  
When User attempts a protected administration operation  
Then System rejects the operation.

---

# US-10 — Use AI Tutor

## AC-16 — Successful AI Request

Given User đã Authentication  
And AI service is available  
When User sends a valid Prompt  
Then LearnUp processes the request through the configured AI integration  
And User receives an AI response.

## AC-17 — AI Service Failure

Given User đã Authentication  
When the external AI service fails or times out  
Then System handles the failure according to implemented behavior  
And UI does not remain indefinitely in a waiting state.

## AC-18 — Official Result Protection

Given User interacts with AI Tutor  
When AI generates a response  
Then AI does not automatically create, modify, or decide the official Quiz Result.
