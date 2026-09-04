# Hướng dẫn dữ liệu mẫu LearnUp bằng SQL

## Cơ chế hiện tại

- Cấu trúc bảng vẫn được Hibernate cập nhật bằng `spring.jpa.hibernate.ddl-auto=update`.
- Profile mặc định khi phát triển là `dev`.
- Sau khi cấu trúc bảng sẵn sàng, Spring chạy `backend/src/main/resources/data.sql`.
- Mỗi câu lệnh SQL kiểm tra bản ghi đã tồn tại nên khởi động lại không tạo dữ liệu trùng.
- `DataInitializer.java` được giữ lại để tham khảo nhưng chỉ chạy khi chủ động bật profile `legacy-seed`.

Không bật `legacy-seed` trên database đang sử dụng vì initializer cũ có API reset và thao tác xóa dữ liệu mẫu.

## Dữ liệu được tạo

- 1 quản trị viên, 3 giáo viên và 5 học viên.
- 5 danh mục và 6 khóa học.
- Chương, bài học, bài quiz, câu hỏi và đáp án.
- 14 đơn hàng thành công và các lượt ghi danh tương ứng.
- Tiến độ bài học và kết quả quiz mẫu.

Tất cả tài khoản mẫu dùng mật khẩu: `123456`.

| Vai trò | Email |
|---|---|
| Admin | `admin@gmail.com` |
| Teacher | `teacher@gmail.com` |
| Teacher | `teacher2@gmail.com` |
| Teacher | `teacher3@gmail.com` |
| Student | `student@gmail.com` |
| Student | `student2@gmail.com` đến `student5@gmail.com` |

## Chạy ứng dụng

```powershell
cd C:\DoAn\backend
.\mvnw.cmd spring-boot:run
```

SQL tự chạy trong profile `dev`. Không cần mở SQL Server Management Studio để chạy thủ công.

## Tắt việc nạp dữ liệu mẫu

Chạy bằng profile khác `dev`, ví dụ:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=prod"
```

Khi không có profile `dev`, SQL Server là database ngoài nên Spring không tự chạy `data.sql`.

## Tạo database mới

1. Tạo database rỗng tên `learnup_db` trong SQL Server.
2. Kiểm tra `DB_URL`, `DB_USERNAME` và `DB_PASSWORD`.
3. Khởi động backend bằng profile `dev`.
4. Hibernate tạo bảng, sau đó `data.sql` nạp dữ liệu.
5. Đăng nhập bằng một tài khoản mẫu để kiểm tra.

File SQL không có lệnh `DELETE`, `DROP` hoặc `TRUNCATE`, vì vậy không tự xóa dữ liệu đang có.
