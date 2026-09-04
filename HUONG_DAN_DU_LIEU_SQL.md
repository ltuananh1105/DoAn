# Hướng dẫn khởi tạo LearnUp bằng một file SQL

Toàn bộ database, cấu trúc bảng và dữ liệu demo nằm trong `C:\DoAn\SQLQuery1.sql`.

## Cách chạy

1. Mở SQL Server Management Studio và kết nối SQL Server trên máy.
2. Mở file `SQLQuery1.sql`.
3. Bấm **Execute** và đợi chạy xong.
4. Khởi động backend:

```powershell
cd C:\DoAn\backend
.\mvnw.cmd spring-boot:run
```

File SQL thực hiện theo thứ tự:

1. Tạo `learnup_db` nếu database chưa tồn tại.
2. Tạo 12 bảng và các khóa ngoại nếu chưa tồn tại.
3. Tạo tài khoản, danh mục, khóa học và nội dung học.
4. Tạo giao dịch, ghi danh, tiến độ và kết quả quiz mẫu.
5. Bổ sung dữ liệu mở rộng để kiểm thử danh sách, quy trình duyệt và dashboard thống kê.

File có thể chạy lại. Script kiểm tra dữ liệu trước khi thêm và không chứa `DELETE`, `DROP` hoặc `TRUNCATE`.

## Tài khoản demo

Mật khẩu chung: `123456`.

| Vai trò | Email |
|---|---|
| Admin | `admin@gmail.com` |
| Teacher | `teacher@gmail.com` |
| Teacher | `teacher2@gmail.com` |
| Teacher | `teacher3@gmail.com` |
| Teacher | `teacher4@gmail.com` đến `teacher7@gmail.com` |
| Student | `student@gmail.com` |
| Student | `student2@gmail.com` đến `student20@gmail.com` |

Sau khi chạy xong, SSMS sẽ trả về bảng tổng hợp số lượng người dùng, khóa học, bài học, đơn hàng, ghi danh và kết quả quiz. Dữ liệu có nhiều trạng thái khác nhau để kiểm thử bộ lọc và nghiệp vụ quản trị; các tài khoản `locked` hoặc `inactive` được tạo có chủ đích và không dùng để đăng nhập thông thường.

`DataInitializer.java` chỉ còn là mã dự phòng dưới profile `legacy-seed` và không tự chạy khi khởi động bình thường.
