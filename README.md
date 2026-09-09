# LearnUp — Hướng dẫn cài đặt và chạy đồ án

LearnUp là ứng dụng học trực tuyến với ba vai trò: học viên, giảng viên và quản trị viên. Dự án sử dụng React + Vite ở frontend, Java Spring Boot ở backend và Microsoft SQL Server để lưu dữ liệu.

## 1. Yêu cầu môi trường

| Thành phần | Yêu cầu |
| --- | --- |
| Java | JDK 21, cấu hình `JAVA_HOME` trỏ đến thư mục JDK |
| Node.js | Phiên bản 22.12 trở lên, kèm npm |
| Cơ sở dữ liệu | Microsoft SQL Server và SQL Server Management Studio (SSMS) |
| Terminal | PowerShell trên Windows cho các lệnh trong hướng dẫn |
| Internet | Cần khi tải thư viện lần đầu, sử dụng Gemini AI và xem video trực tuyến |

Dự án có Maven Wrapper nên không cần cài Maven riêng. Kiểm tra môi trường:

```powershell
java -version
node -v
npm -v
```

Các ví dụ bên dưới giả sử giải nén dự án vào `C:\DoAn`. Nếu đặt ở vị trí khác, thay đường dẫn tương ứng.

## 2. Cấu trúc dự án

```text
DoAn/
├── backend/          # API Spring Boot, Maven Wrapper
├── frontend/         # Giao diện React, package-lock.json
├── SQLQuery1.sql     # Tạo database, bảng và dữ liệu demo
└── README.md         # Hướng dẫn cài đặt và chạy
```

## 3. Khởi tạo SQL Server và dữ liệu mẫu

1. Bảo đảm dịch vụ SQL Server đang chạy.
2. Mở SSMS và kết nối đến SQL Server bằng tài khoản có quyền tạo database, bảng và thêm dữ liệu.
3. Mở file [SQLQuery1.sql](SQLQuery1.sql).
4. Chạy **toàn bộ file** bằng **Execute / F5**, không chỉ chạy phần văn bản đang bôi chọn.
5. Kiểm tra cửa sổ Messages không báo lỗi và database `learnup_db` đã xuất hiện trong Databases (Refresh nếu cần). Cuối script có bảng tổng số bản ghi để kiểm tra dữ liệu.

Script tạo các bảng và tài khoản, khóa học, bài học, đơn hàng cùng dữ liệu demo. Các lệnh thêm dữ liệu kiểm tra bản ghi đã tồn tại; chạy lại không đặt lại mật khẩu của tài khoản có sẵn. Backend mặc định không tự nạp dữ liệu demo, vì vậy cần thực hiện bước SQL này.

Backend sử dụng tài khoản SQL Server (SQL Server Authentication). Cần bật chế độ xác thực hỗn hợp nếu máy chỉ cho phép Windows Authentication. Bật TCP/IP cho instance SQL Server trong SQL Server Configuration Manager và khởi động lại dịch vụ sau khi thay đổi.

## 4. Cấu hình và chạy backend

Cấu hình nằm tại [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties). Server mặc định `TUANANH` là cấu hình máy phát triển; người nhận bài cần đặt thông tin kết nối phù hợp với máy của mình.

Mở terminal PowerShell thứ nhất:

```powershell
cd C:\DoAn\backend
$env:DB_URL="jdbc:sqlserver://localhost:1433;databaseName=learnup_db;encrypt=true;trustServerCertificate=true"
$env:DB_USERNAME="sa"
$env:DB_PASSWORD="MAT_KHAU_SQL_CUA_BAN"
.\mvnw.cmd spring-boot:run
```

Thay `MAT_KHAU_SQL_CUA_BAN` bằng mật khẩu SQL thực tế; thay `sa` nếu dùng tài khoản khác có quyền truy cập database. Địa chỉ `localhost:1433` chỉ phù hợp khi SQL Server trên máy đang lắng nghe cổng 1433. Nếu instance dùng cổng khác, thay bằng cổng thực tế. Với named instance, có thể dùng URL dạng:

```text
jdbc:sqlserver://localhost;instanceName=SQLEXPRESS;databaseName=learnup_db;encrypt=true;trustServerCertificate=true
```

Kết nối theo tên instance có thể cần dịch vụ SQL Server Browser; dùng địa chỉ và cổng TCP thực tế nếu không phân giải được instance.

Lần chạy đầu Maven sẽ tải thư viện. Chờ log báo ứng dụng đã khởi động thành công, Tomcat chạy cổng **8080**. Giữ terminal này mở.

Các biến `$env:...` chỉ có hiệu lực trong terminal hiện tại và các tiến trình khởi chạy từ đó. Khi mở terminal mới, cần đặt lại biến trước khi chạy backend. Nếu chạy bằng nút Run của IDE, cần cấu hình biến môi trường cho tiến trình chạy của IDE.

## 5. Cài đặt và chạy frontend

Mở terminal PowerShell thứ hai:

```powershell
cd C:\DoAn\frontend
npm ci
npm run dev -- --port 5173 --strictPort
```

`npm ci` cài thư viện theo `package-lock.json`; chỉ cần chạy khi cài lần đầu hoặc khi thư viện thay đổi.

Mở trình duyệt tại **http://localhost:5173**. Frontend chuyển các yêu cầu `/api` đến backend tại `http://localhost:8080` thông qua cấu hình Vite. Khi demo, giữ cả hai terminal chạy.

Để dừng ứng dụng, nhấn **Ctrl+C** trong từng terminal.

## 6. Tài khoản demo

Sau khi nạp SQL vào database mới, dùng các tài khoản sau. Mật khẩu chung: **`123456`**.

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị viên | `admin@gmail.com` | `123456` |
| Giảng viên | `teacher@gmail.com` | `123456` |
| Học viên | `student@gmail.com` | `123456` |

Nếu tài khoản đã được đổi mật khẩu trước đó, dùng mật khẩu đã đổi.

## 7. Cấu hình Gemini AI (tùy chọn)

Các chức năng khác có thể chạy khi chưa cấu hình Gemini. Để demo trợ lý AI, cần API key Gemini hợp lệ và model mà tài khoản được phép sử dụng.

Dừng backend, sau đó đặt khóa trong chính terminal backend rồi chạy lại:

```powershell
$env:GEMINI_API_KEY="API_KEY_CUA_BAN"
.\mvnw.cmd spring-boot:run
```

Lệnh trên thực hiện tại `C:\DoAn\backend`, sau khi đã đặt các biến kết nối SQL ở bước 4. Nếu cần chọn model khác với mặc định trong `application.properties`, đặt biến sau trước khi chạy backend:

```powershell
$env:GEMINI_MODEL="TEN_MODEL_DUOC_CAP_QUYEN"
```

Giữ dòng `gemini.api.key=${GEMINI_API_KEY:}` trong file cấu hình. Không ghi API key thật vào mã nguồn hoặc gói bài nộp. Sau khi backend khởi động lại, mở trợ lý AI và gửi câu hỏi. Khả năng sử dụng phụ thuộc API key, quyền truy cập model, hạn mức và kết nối Internet.

## 8. Kịch bản kiểm tra demo

1. Mở trang chủ và danh sách khóa học để kiểm tra frontend kết nối được backend và database.
2. Đăng nhập học viên, mở khóa học đã ghi danh, xem bài học, làm quiz và xem tiến độ.
3. Thử đăng ký một khóa học chưa sở hữu và sử dụng thanh toán demo. Chức năng này mô phỏng giao dịch, không chuyển tiền thật.
4. Đăng xuất, đăng nhập giảng viên để quản lý khóa học, chương, bài học và gửi khóa học duyệt.
5. Đăng xuất, đăng nhập quản trị viên để kiểm tra duyệt khóa học, quản lý người dùng và đơn hàng.
6. Nếu đã cấu hình Gemini, mở trợ lý AI để kiểm tra hỏi đáp.

## 9. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
| --- | --- |
| `java` không được nhận diện hoặc Java không đúng phiên bản | Cài JDK 21, kiểm tra `JAVA_HOME` và `PATH`, mở lại terminal. |
| PowerShell chặn `npm.ps1` | Dùng `npm.cmd ci` và `npm.cmd run dev -- --port 5173 --strictPort`. |
| `Login failed for user` | Kiểm tra tài khoản, mật khẩu SQL, chế độ SQL Server Authentication và quyền truy cập database. |
| Không kết nối được SQL Server | Kiểm tra dịch vụ, TCP/IP, server/instance, cổng và `DB_URL`. |
| Không tìm thấy `learnup_db` hoặc không có dữ liệu demo | Chạy toàn bộ `SQLQuery1.sql` trên đúng server mà backend kết nối. |
| Cổng 8080 hoặc 5173 đang được sử dụng | Dừng phiên backend/frontend cũ rồi chạy lại. |
| Giao diện có nhưng API lỗi, không tải được khóa học | Kiểm tra backend đã khởi động thành công ở cổng 8080 và kết nối được database. |
| `Chưa cấu hình GEMINI_API_KEY cho backend` | Đặt biến trong terminal khởi chạy backend rồi khởi động lại backend. |
| AI báo lỗi model hoặc hạn mức | Kiểm tra quyền truy cập, tên model, API key và hạn mức của tài khoản Gemini. |

## 10. Chuẩn bị gói bài nộp

Giữ đầy đủ mã nguồn `backend`, `frontend`, file `SQLQuery1.sql` và README này. Trong backend, cần giữ cả thư mục **`.mvn`**, các file **`mvnw`**, **`mvnw.cmd`** và **`pom.xml`**; trong frontend cần giữ **`package.json`** và **`package-lock.json`** để người nhận cài được thư viện.

Có thể bỏ các thư mục sinh tự động `frontend/node_modules`, `frontend/dist`, `backend/target` và thư mục lịch sử Git `.git` để giảm dung lượng. Không đưa khóa API thật hay file chứa thông tin bí mật cá nhân vào gói nộp.

Quy trình chạy lại sau khi cài xong: **SQL Server đang chạy → đặt biến môi trường và chạy backend → chạy frontend → mở http://localhost:5173**. Không cần nạp lại SQL ở mỗi lần chạy.
