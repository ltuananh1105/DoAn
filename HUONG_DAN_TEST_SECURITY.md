# Hướng dẫn kiểm thử Security - LearnUp

Tài liệu này dùng để kiểm thử thủ công chức năng xác thực và phân quyền của ứng dụng LearnUp sau khi chạy các bài test tự động.

## 1. Chuẩn bị môi trường

### Chạy backend

Mở PowerShell:

```powershell
cd C:\DoAn\backend

$env:JWT_SECRET="learnup-secret-key-demo-2026-rat-dai-va-kho-doan"
$env:APP_CORS_ALLOWED_ORIGIN="http://localhost:5173"
$env:DEMO_PAYMENT_ENABLED="true"

.\mvnw.cmd spring-boot:run
```

Lưu ý: biến môi trường chỉ tồn tại trong cửa sổ PowerShell hiện tại. Nếu mở terminal mới, cần khai báo lại.

### Chạy frontend

Mở một cửa sổ PowerShell khác:

```powershell
cd C:\DoAn\frontend
npm install
npm run dev
```

Truy cập:

```text
http://localhost:5173
```

## 2. Chạy kiểm thử tự động

### Backend

```powershell
cd C:\DoAn\backend
.\mvnw.cmd test
```

Kết quả mong đợi: tất cả test thành công, không có `Failures` hoặc `Errors`.

### Frontend

```powershell
cd C:\DoAn\frontend
npm run lint
npm run build
```

Kết quả mong đợi: lint không báo lỗi và Vite build thành công.

## 3. Kiểm thử đăng nhập và đăng xuất

1. Đăng nhập bằng tài khoản Student hợp lệ.
2. Kiểm tra người dùng được chuyển đến đúng trang Student.
3. Mở DevTools bằng `F12`.
4. Vào `Application` → `Local Storage` → `http://localhost:5173`.
5. Kiểm tra có khóa `learnup_token`.
6. Reload trang và xác nhận phiên đăng nhập vẫn còn.
7. Đăng xuất và kiểm tra `learnup_token` đã bị xóa.
8. Thử đăng nhập bằng mật khẩu sai.

Kết quả mong đợi: đăng nhập đúng thành công; đăng nhập sai bị từ chối; sau khi đăng xuất không thể vào trang cần xác thực.

## 4. Kiểm thử API không có token

API riêng tư:

```powershell
Invoke-WebRequest http://localhost:8080/api/users
```

Kết quả mong đợi: HTTP `401 Unauthorized`.

Các API công khai:

```powershell
Invoke-WebRequest http://localhost:8080/api/hello
Invoke-WebRequest http://localhost:8080/api/courses/public
Invoke-WebRequest http://localhost:8080/api/categories
```

Kết quả mong đợi: HTTP `200 OK`.

## 5. Lấy token để test bằng PowerShell

Thay email và mật khẩu bằng tài khoản có trong database:

```powershell
$body = @{
    email    = "student@gmail.com"
    password = "123456"
} | ConvertTo-Json

$login = Invoke-RestMethod `
    -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $login.token
$headers = @{
    Authorization = "Bearer $token"
}

$token.Length
```

Kết quả mong đợi: `$token.Length` lớn hơn `0`.

## 6. Kiểm thử phân quyền Student

### Student gọi API Admin

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:8080/api/revenue/admin" `
    -Headers $headers
```

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:8080/api/users" `
    -Headers $headers
```

Kết quả mong đợi: HTTP `403 Forbidden`.

### Student truy cập dữ liệu người khác

Đăng nhập Student A nhưng thay ID trên URL thành ID của Student B:

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:8080/api/enrollments/student/999" `
    -Headers $headers
```

Thực hiện tương tự với:

- Tiến độ bài học.
- Lịch sử làm quiz.
- Lịch sử đơn hàng.
- Thông tin tài khoản.
- Endpoint đổi mật khẩu.

Kết quả mong đợi: HTTP `403 Forbidden`; Student A không xem hoặc sửa được dữ liệu của Student B.

## 7. Kiểm thử token không hợp lệ

Sửa ký tự cuối của token:

```powershell
$tamperedToken = $token.Substring(0, $token.Length - 1) + "x"

$tamperedHeaders = @{
    Authorization = "Bearer $tamperedToken"
}

Invoke-WebRequest `
    -Uri "http://localhost:8080/api/users" `
    -Headers $tamperedHeaders
```

Kết quả mong đợi: HTTP `401 Unauthorized`.

### Kiểm tra token hết hạn

1. Đặt thời gian sống JWT rất ngắn trong cấu hình môi trường hoặc `application.properties`.
2. Restart backend.
3. Đăng nhập để nhận token mới.
4. Chờ token hết hạn.
5. Gọi một API riêng tư.

Kết quả mong đợi: API trả `401`; frontend xóa phiên đăng nhập và chuyển về trang đăng nhập.

## 8. Kiểm thử Teacher

Đăng nhập bằng Teacher A và thực hiện:

1. Tạo khóa học mới.
2. Thêm chapter, lesson và quiz vào khóa học của Teacher A.
3. Sửa và xóa nội dung thuộc khóa học của Teacher A.
4. Dùng ID khóa học của Teacher B để sửa hoặc xóa.
5. Gọi API doanh thu Admin.
6. Thử duyệt hoặc từ chối khóa học.

Kết quả mong đợi:

- Các thao tác trên khóa học thuộc Teacher A thành công.
- Thao tác trên khóa học của Teacher B trả `403`.
- API Admin và thao tác duyệt khóa học trả `403`.

## 9. Kiểm thử Admin

Đăng nhập bằng Admin và thực hiện:

1. Xem danh sách người dùng.
2. Thêm, sửa và xóa category.
3. Duyệt hoặc từ chối khóa học.
4. Xem doanh thu.
5. Thử cập nhật role thành giá trị không hợp lệ như `superadmin`.
6. Thử xóa Teacher đang có khóa học.
7. Thử xóa Student đã có dữ liệu học tập hoặc thanh toán.

Kết quả mong đợi:

- Các chức năng quản trị hợp lệ hoạt động bình thường.
- Role không hợp lệ bị từ chối.
- Không xóa được tài khoản đang có dữ liệu liên quan.

## 10. Kiểm thử cập nhật tài khoản và mật khẩu

Thực hiện lần lượt:

1. Cập nhật tên thành chuỗi rỗng.
2. Cập nhật email sai định dạng.
3. Cập nhật email đã thuộc một tài khoản khác.
4. Gửi trường `password` trong API cập nhật hồ sơ.
5. Đổi mật khẩu với mật khẩu hiện tại sai.
6. Đổi sang mật khẩu mới dưới 6 ký tự.
7. Đổi mật khẩu hợp lệ.
8. Đăng xuất và đăng nhập bằng mật khẩu mới.
9. Thử đăng nhập lại bằng mật khẩu cũ.

Kết quả mong đợi:

- Tên rỗng, email sai và email trùng bị từ chối.
- Trường `password` gửi qua API hồ sơ không làm thay đổi mật khẩu.
- Chỉ đổi được mật khẩu khi mật khẩu hiện tại chính xác.
- Mật khẩu mới phải có ít nhất 6 ký tự.
- Mật khẩu mới đăng nhập được; mật khẩu cũ không đăng nhập được.

## 11. Kiểm thử CORS

Gửi request từ origin không được phép:

```powershell
Invoke-WebRequest `
    -Uri "http://localhost:8080/api/hello" `
    -Headers @{ Origin = "https://website-la.example" }
```

Kết quả mong đợi: response không có header:

```text
Access-Control-Allow-Origin: https://website-la.example
```

Origin `http://localhost:5173` phải được chấp nhận.

## 12. Kiểm thử thanh toán

### Chế độ demo

```powershell
$env:DEMO_PAYMENT_ENABLED="true"
```

Sau khi restart backend:

1. Student tạo đơn hàng cho chính mình.
2. Student thay `studentId` thành ID của người khác.
3. Student thử xem đơn hàng của người khác.
4. Sửa một tham số callback VNPay nhưng giữ nguyên chữ ký cũ.

Kết quả mong đợi:

- Tạo đơn hàng cho chính mình thành công.
- Giả mạo Student khác trả `403`.
- Không xem được đơn hàng của người khác.
- Callback có chữ ký không hợp lệ bị từ chối.

### Tắt thanh toán demo

```powershell
$env:DEMO_PAYMENT_ENABLED="false"
```

Restart backend rồi thử xác nhận thanh toán demo.

Kết quả mong đợi: endpoint thanh toán demo không cho phép hoàn tất đơn hàng.

## 13. Bảng tổng hợp kết quả

| Mã | Chức năng | Vai trò | Kết quả mong đợi | Thực tế | Đạt/Không đạt |
|---|---|---|---|---|---|
| SEC-01 | Đăng nhập đúng | Tất cả | Thành công và nhận token | | |
| SEC-02 | Đăng nhập sai | Tất cả | Bị từ chối | | |
| SEC-03 | API riêng tư không token | Khách | HTTP 401 | | |
| SEC-04 | Student gọi API Admin | Student | HTTP 403 | | |
| SEC-05 | Truy cập dữ liệu Student khác | Student | HTTP 403 | | |
| SEC-06 | Sửa nội dung Teacher khác | Teacher | HTTP 403 | | |
| SEC-07 | Token bị chỉnh sửa | Tất cả | HTTP 401 | | |
| SEC-08 | Token hết hạn | Tất cả | HTTP 401 và đăng xuất | | |
| SEC-09 | Email trùng hoặc sai | Tất cả | Bị từ chối | | |
| SEC-10 | Đổi mật khẩu sai mật khẩu hiện tại | Tất cả | Bị từ chối | | |
| SEC-11 | Origin lạ gọi API | Khách | Không được CORS cho phép | | |
| SEC-12 | Callback VNPay sai chữ ký | Student | Bị từ chối | | |

## 14. Kiểm thử quy trình quản trị thực tế

### Kiểm thử vòng đời khóa học

1. Teacher tạo khóa học mới; trạng thái phải là `draft`.
2. Thử gửi duyệt khi chưa có chương; hệ thống phải từ chối.
3. Tạo một chương nhưng chưa có bài học rồi gửi duyệt; hệ thống phải từ chối.
4. Thêm ít nhất một bài học cho mỗi chương rồi gửi duyệt; trạng thái chuyển thành `pending`.
5. Khi đang `pending`, Teacher không được sửa thông tin, chương, bài học hoặc quiz.
6. Admin mở trang xem chi tiết, kiểm tra chương, bài học và quiz.
7. Admin từ chối mà không nhập lý do đủ 10 ký tự; hệ thống phải từ chối thao tác.
8. Admin nhập lý do hợp lệ; khóa học chuyển thành `rejected` và Teacher nhìn thấy phản hồi.
9. Teacher sửa lại khóa học; trạng thái trở về `draft`, sau đó gửi duyệt lại.
10. Admin duyệt; trạng thái chuyển thành `published` và khóa học xuất hiện ở danh sách công khai.
11. Admin đình chỉ và nhập lý do; khóa học chuyển thành `suspended` và biến mất khỏi danh sách công khai.
12. Admin khôi phục; khóa học trở lại `published`.
13. Teacher lưu trữ khóa đang xuất bản; trạng thái chuyển thành `archived`.
14. Chỉ Admin được khôi phục khóa học đã lưu trữ.
15. Teacher chỉ được xóa bản nháp chưa có chương, bài học, quiz, học viên hoặc giao dịch.

### Kiểm thử quản trị tài khoản

1. Admin tạo tài khoản Student và Teacher với email mới.
2. Thử tạo email trùng, email sai định dạng hoặc mật khẩu dưới 6 ký tự; hệ thống phải từ chối.
3. Admin khóa một tài khoản; token hiện tại của tài khoản đó phải lập tức nhận HTTP `401`.
4. Tài khoản bị khóa không đăng nhập lại được.
5. Admin mở khóa; tài khoản đăng nhập lại bình thường.
6. Admin đặt lại mật khẩu tạm; mật khẩu cũ không đăng nhập được và mật khẩu tạm đăng nhập được.
7. Admin thử tự khóa hoặc tự hạ quyền tài khoản đang đăng nhập; hệ thống phải từ chối.
8. Student hoặc Teacher gọi API tạo, khóa hoặc reset tài khoản; kết quả phải là HTTP `403`.

## 15. Tiêu chí hoàn thành

### Kiểm thử thống kê và xuất báo cáo

1. Chọn khoảng 30 ngày ở báo cáo Admin và đối chiếu số đơn với các đơn `COMPLETED` có ngày hoàn tất trong khoảng đó.
2. Xác nhận doanh thu gộp bằng tổng `amount`; phí nền tảng bằng 20% và thanh toán giảng viên bằng 80%.
3. Đổi sang khoảng ngày không có giao dịch; mọi KPI phải bằng 0 và nút xuất không tạo báo cáo rỗng.
4. Kiểm tra giá trị đơn trung bình bằng doanh thu gộp chia số đơn hoàn tất.
5. Một học viên mua nhiều khóa trong kỳ chỉ được tính một lần ở KPI người mua duy nhất.
6. Biểu đồ ngày phải có đủ từng ngày trong kỳ, kể cả ngày doanh thu bằng 0.
7. Báo cáo Teacher chỉ chứa giao dịch thuộc khóa học của Teacher đang đăng nhập.
8. Số ghi danh và số đơn trả phí phải được hiển thị riêng, không gọi ghi danh miễn phí là doanh thu.
9. Tìm kiếm danh sách rồi xuất; file phải chỉ chứa các dòng đang phù hợp với bộ lọc.
10. Xuất CSV và mở bằng Excel: tiếng Việt hiển thị đúng, số tiền vẫn là dữ liệu số và nội dung bắt đầu bằng `=`, `+`, `-`, `@` không được chạy như công thức.
11. Xuất PDF: tiêu đề, kỳ báo cáo, thời gian xuất, số bản ghi và bảng chi tiết phải khớp giao diện.
12. Thử tên file chứa ký tự `<>:"/\\|?*`; file vẫn tải được với tên đã được làm sạch.


Phần security đạt yêu cầu kiểm thử cơ bản khi:

- Backend test, frontend lint và frontend build đều thành công.
- Không truy cập được API riêng tư khi thiếu hoặc sai token.
- Student và Teacher không thể nâng quyền bằng cách sửa request.
- Người dùng không truy cập được dữ liệu thuộc tài khoản khác.
- Teacher không sửa được nội dung của Teacher khác.
- Mật khẩu không xuất hiện trong response và được lưu dưới dạng BCrypt.
- CORS không chấp nhận origin ngoài cấu hình.
- Callback thanh toán bị sửa tham số không vượt qua kiểm tra chữ ký.
