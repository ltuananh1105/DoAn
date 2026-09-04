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

File có thể chạy lại. Script kiểm tra dữ liệu trước khi thêm và không chứa `DELETE`, `DROP` hoặc `TRUNCATE`.

## Tài khoản demo

Mật khẩu chung: `123456`.

| Vai trò | Email |
|---|---|
| Admin | `admin@gmail.com` |
| Teacher | `teacher@gmail.com` |
| Teacher | `teacher2@gmail.com` |
| Teacher | `teacher3@gmail.com` |
| Student | `student@gmail.com` |
| Student | `student2@gmail.com` đến `student5@gmail.com` |

`DataInitializer.java` chỉ còn là mã dự phòng dưới profile `legacy-seed` và không tự chạy khi khởi động bình thường.
