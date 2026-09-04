/*
  KHỞI TẠO DATABASE VÀ DỮ LIỆU MẪU LEARNUP - MICROSOFT SQL SERVER

  Cách chạy: mở toàn bộ file này trong SQL Server Management Studio và bấm Execute.
  Có thể chạy lại an toàn: các lệnh INSERT đều kiểm tra dữ liệu đã tồn tại.
  Mật khẩu chung của các tài khoản demo: 123456
*/

USE master;
GO

IF DB_ID(N'learnup_db') IS NULL
BEGIN
    CREATE DATABASE learnup_db;
END;
GO

USE learnup_db;
GO

-- SCHEMA: chỉ tạo những bảng chưa tồn tại, không xóa hoặc thay đổi bảng đang có.
IF OBJECT_ID(N'dbo.users', N'U') IS NULL CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255), email VARCHAR(255) UNIQUE,
    password VARCHAR(255), role NVARCHAR(255), status NVARCHAR(255), date_of_birth VARCHAR(255),
    phone VARCHAR(255), occupation NVARCHAR(255), country NVARCHAR(255), province NVARCHAR(255)
);
IF OBJECT_ID(N'dbo.categories', N'U') IS NULL CREATE TABLE categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL UNIQUE
);
IF OBJECT_ID(N'dbo.courses', N'U') IS NULL CREATE TABLE courses (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, title NVARCHAR(255) NOT NULL,
    description NVARCHAR(2000), price FLOAT NOT NULL, status NVARCHAR(255),
    review_note NVARCHAR(1000), submitted_at DATETIME2, reviewed_at DATETIME2,
    teacher_id BIGINT NOT NULL, category_id BIGINT NOT NULL,
    CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id) REFERENCES users(id),
    CONSTRAINT fk_course_category FOREIGN KEY (category_id) REFERENCES categories(id)
);
IF OBJECT_ID(N'dbo.chapters', N'U') IS NULL CREATE TABLE chapters (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, title NVARCHAR(255) NOT NULL, order_index INT,
    course_id BIGINT NOT NULL, CONSTRAINT fk_chapter_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
IF OBJECT_ID(N'dbo.lessons', N'U') IS NULL CREATE TABLE lessons (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, title NVARCHAR(255) NOT NULL, video_url VARCHAR(255),
    order_index INT, chapter_id BIGINT NOT NULL,
    CONSTRAINT fk_lesson_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
IF OBJECT_ID(N'dbo.enrollments', N'U') IS NULL CREATE TABLE enrollments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, student_id BIGINT NOT NULL, course_id BIGINT NOT NULL,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT uk_enrollment_student_course UNIQUE (student_id, course_id)
);
IF OBJECT_ID(N'dbo.orders', N'U') IS NULL CREATE TABLE orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, order_code VARCHAR(255) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL, course_id BIGINT NOT NULL, amount FLOAT NOT NULL,
    payment_method VARCHAR(255), status VARCHAR(255), transaction_no VARCHAR(255),
    created_at DATETIME2, completed_at DATETIME2,
    CONSTRAINT fk_order_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_order_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
IF OBJECT_ID(N'dbo.quizzes', N'U') IS NULL CREATE TABLE quizzes (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, title NVARCHAR(255), pass_score INT,
    time_limit_minutes INT, course_id BIGINT,
    CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
IF OBJECT_ID(N'dbo.questions', N'U') IS NULL CREATE TABLE questions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, quiz_id BIGINT, content NVARCHAR(2000),
    explanation NVARCHAR(2000), order_index INT,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
IF OBJECT_ID(N'dbo.question_options', N'U') IS NULL CREATE TABLE question_options (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, question_id BIGINT, content NVARCHAR(1000), is_correct BIT,
    CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES questions(id)
);
IF OBJECT_ID(N'dbo.lesson_progress', N'U') IS NULL CREATE TABLE lesson_progress (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, student_id BIGINT NOT NULL, lesson_id BIGINT NOT NULL,
    is_completed BIT, CONSTRAINT fk_progress_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    CONSTRAINT uk_progress_student_lesson UNIQUE (student_id, lesson_id)
);
IF OBJECT_ID(N'dbo.quiz_results', N'U') IS NULL CREATE TABLE quiz_results (
    id BIGINT IDENTITY(1,1) PRIMARY KEY, student_id BIGINT, quiz_id BIGINT, score FLOAT,
    correct_count INT, total_questions INT, passed BIT, started_at DATETIME2, submitted_at DATETIME2,
    CONSTRAINT fk_result_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_result_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- DATA: các câu lệnh dưới đây chỉ thêm bản ghi còn thiếu.

-- USERS
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Quản Trị Viên','admin@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'admin',N'active','0901234567',N'Quản trị hệ thống',N'Việt Nam',N'TP. Hồ Chí Minh');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'teacher@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'ThS. Nguyễn Văn Hùng','teacher@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'teacher',N'active','0912345678',N'Giảng viên Tiếng Anh',N'Việt Nam',N'Hà Nội');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'teacher2@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Cô Lê Thị Mai (IELTS 8.5)','teacher2@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'teacher',N'active','0923456789',N'Chuyên gia Luyện thi IELTS',N'Việt Nam',N'Đà Nẵng');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'teacher3@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Thầy Trần Quốc Bảo','teacher3@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'teacher',N'active','0924567890',N'Giảng viên TOEIC và Giao tiếp',N'Việt Nam',N'TP. Hồ Chí Minh');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'student@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Lê Tuấn Anh','student@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'student',N'active','0934567890',N'Sinh viên',N'Việt Nam',N'TP. Hồ Chí Minh');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'student2@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Trần Minh Quang','student2@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'student',N'active','0945678901',N'Kỹ sư phần mềm',N'Việt Nam',N'Hà Nội');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'student3@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Hoàng Thị Thảo','student3@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'student',N'active','0956789012',N'Nhân viên Marketing',N'Việt Nam',N'Hải Phòng');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'student4@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Nguyễn Phương Linh','student4@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'student',N'active','0967890123',N'Sinh viên Đại học',N'Việt Nam',N'Đà Nẵng');
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'student5@gmail.com') INSERT INTO users (name,email,password,role,status,phone,occupation,country,province) VALUES (N'Phạm Đức Duy','student5@gmail.com','$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2',N'student',N'active','0978901234',N'Nhân viên Ngân hàng',N'Việt Nam',N'Cần Thơ');

-- CATEGORIES
IF NOT EXISTS (SELECT 1 FROM categories WHERE name=N'Tiếng Anh Giao Tiếp') INSERT INTO categories(name) VALUES(N'Tiếng Anh Giao Tiếp');
IF NOT EXISTS (SELECT 1 FROM categories WHERE name=N'Luyện thi IELTS') INSERT INTO categories(name) VALUES(N'Luyện thi IELTS');
IF NOT EXISTS (SELECT 1 FROM categories WHERE name=N'Luyện thi TOEIC') INSERT INTO categories(name) VALUES(N'Luyện thi TOEIC');
IF NOT EXISTS (SELECT 1 FROM categories WHERE name=N'Tiếng Anh Thương Mại & CNTT') INSERT INTO categories(name) VALUES(N'Tiếng Anh Thương Mại & CNTT');
IF NOT EXISTS (SELECT 1 FROM categories WHERE name=N'Ngữ Pháp & Từ Vựng Căn Bản') INSERT INTO categories(name) VALUES(N'Ngữ Pháp & Từ Vựng Căn Bản');

-- COURSES
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm') INSERT INTO courses(title,description,price,status,teacher_id,category_id) SELECT N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm',N'Chuẩn hóa phát âm, phản xạ giao tiếp trong môi trường công sở, viết email và đàm phán chuyên nghiệp.',499000,N'published',u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher@gmail.com' AND c.name=N'Tiếng Anh Giao Tiếp';
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng') INSERT INTO courses(title,description,price,status,teacher_id,category_id) SELECT N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng',N'Lộ trình từ 5.5 lên 7.0+, tập trung Listening, Reading, Writing và Speaking.',890000,N'published',u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher2@gmail.com' AND c.name=N'Luyện thi IELTS';
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày') INSERT INTO courses(title,description,price,status,teacher_id,category_id) SELECT N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày',N'Tổng hợp ngữ pháp, từ vựng và chiến thuật làm bài TOEIC theo định dạng mới.',350000,N'published',u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher@gmail.com' AND c.name=N'Luyện thi TOEIC';
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Tiếng Anh Chuyên Ngành CNTT (IT English)') INSERT INTO courses(title,description,price,status,teacher_id,category_id) SELECT N'Tiếng Anh Chuyên Ngành CNTT (IT English)',N'Thuật ngữ IT, giao tiếp trong Daily Standup, Sprint Planning và đọc tài liệu kỹ thuật.',550000,N'published',u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher3@gmail.com' AND c.name=N'Tiếng Anh Thương Mại & CNTT';
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Từ Vựng Siêu Tốc 3000 Từ Tiếng Anh Căn Bản') INSERT INTO courses(title,description,price,status,submitted_at,teacher_id,category_id) SELECT N'Từ Vựng Siêu Tốc 3000 Từ Tiếng Anh Căn Bản',N'Học từ vựng theo chủ đề, phục vụ giao tiếp hằng ngày.',199000,N'pending',DATEADD(day,-1,SYSDATETIME()),u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher2@gmail.com' AND c.name=N'Ngữ Pháp & Từ Vựng Căn Bản';
IF NOT EXISTS (SELECT 1 FROM courses WHERE title=N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z') INSERT INTO courses(title,description,price,status,teacher_id,category_id) SELECT N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z',N'Hệ thống hóa ngữ pháp tiếng Anh từ cơ bản đến nâng cao.',299000,N'published',u.id,c.id FROM users u CROSS JOIN categories c WHERE u.email='teacher3@gmail.com' AND c.name=N'Ngữ Pháp & Từ Vựng Căn Bản';

-- CHAPTERS
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND ch.title=N'Chương 1: Phản xạ giao tiếp công sở căn bản') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Phản xạ giao tiếp công sở căn bản',1,id FROM courses WHERE title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND ch.title=N'Chương 2: Họp nhóm & Thuyết trình') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 2: Họp nhóm & Thuyết trình',2,id FROM courses WHERE title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng' AND ch.title=N'Chương 1: Chiến thuật Listening & Reading') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Chiến thuật Listening & Reading',1,id FROM courses WHERE title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng' AND ch.title=N'Chương 2: Writing & Speaking') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 2: Writing & Speaking',2,id FROM courses WHERE title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Trọng tâm Ngữ pháp TOEIC',1,id FROM courses WHERE title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Tiếng Anh Chuyên Ngành CNTT (IT English)') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Giao tiếp Scrum/Agile',1,id FROM courses WHERE title=N'Tiếng Anh Chuyên Ngành CNTT (IT English)';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Từ Vựng Siêu Tốc 3000 Từ Tiếng Anh Căn Bản') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Từ vựng đời sống',1,id FROM courses WHERE title=N'Từ Vựng Siêu Tốc 3000 Từ Tiếng Anh Căn Bản';
IF NOT EXISTS (SELECT 1 FROM chapters ch JOIN courses c ON c.id=ch.course_id WHERE c.title=N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z') INSERT INTO chapters(title,order_index,course_id) SELECT N'Chương 1: Các thì cơ bản',1,id FROM courses WHERE title=N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z';

-- LESSONS (title is used as the stable demo key)
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Tự tin giới thiệu bản thân & công việc') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Tự tin giới thiệu bản thân & công việc','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Phản xạ giao tiếp công sở căn bản';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 1: Phản xạ giao tiếp công sở căn bản';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 3: Đặt lịch họp và xác nhận qua điện thoại') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 3: Đặt lịch họp và xác nhận qua điện thoại','https://www.youtube.com/watch?v=juKd26qkNAw',3,id FROM chapters WHERE title=N'Chương 1: Phản xạ giao tiếp công sở căn bản';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 4: Mẫu câu đưa ra ý kiến trong cuộc họp') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 4: Mẫu câu đưa ra ý kiến trong cuộc họp','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 2: Họp nhóm & Thuyết trình';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 5: Kỹ năng thuyết trình dự án bằng tiếng Anh') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 5: Kỹ năng thuyết trình dự án bằng tiếng Anh','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 2: Họp nhóm & Thuyết trình';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Phương pháp xử lý Multiple Choice trong Listening') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Phương pháp xử lý Multiple Choice trong Listening','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Chiến thuật Listening & Reading';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 2: Chiến lược Skimming & Scanning trong Reading') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 2: Chiến lược Skimming & Scanning trong Reading','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 1: Chiến thuật Listening & Reading';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 3: Cấu trúc bài luận Writing Task 2') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 3: Cấu trúc bài luận Writing Task 2','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 2: Writing & Speaking';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 4: Bứt phá Speaking Part 2 và 3') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 4: Bứt phá Speaking Part 2 và 3','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 2: Writing & Speaking';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Dạng câu hỏi về Từ loại') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Dạng câu hỏi về Từ loại','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Trọng tâm Ngữ pháp TOEIC';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 2: Bẫy Mệnh đề quan hệ') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 2: Bẫy Mệnh đề quan hệ','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 1: Trọng tâm Ngữ pháp TOEIC';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Báo cáo tiến độ Daily Standup Meeting') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Báo cáo tiến độ Daily Standup Meeting','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Giao tiếp Scrum/Agile';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 2: Đọc hiểu API Specs & Git Workflow') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 2: Đọc hiểu API Specs & Git Workflow','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 1: Giao tiếp Scrum/Agile';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Từ vựng gia đình') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Từ vựng gia đình','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Từ vựng đời sống';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 1: Hiện tại đơn & Tiếp diễn') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 1: Hiện tại đơn & Tiếp diễn','https://www.youtube.com/watch?v=juKd26qkNAw',1,id FROM chapters WHERE title=N'Chương 1: Các thì cơ bản';
IF NOT EXISTS (SELECT 1 FROM lessons WHERE title=N'Bài 2: Quá khứ đơn & Hoàn thành') INSERT INTO lessons(title,video_url,order_index,chapter_id) SELECT N'Bài 2: Quá khứ đơn & Hoàn thành','https://www.youtube.com/watch?v=juKd26qkNAw',2,id FROM chapters WHERE title=N'Chương 1: Các thì cơ bản';

-- QUIZZES
IF NOT EXISTS (SELECT 1 FROM quizzes WHERE title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)') INSERT INTO quizzes(title,pass_score,time_limit_minutes,course_id) SELECT N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)',80,15,id FROM courses WHERE title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm';
IF NOT EXISTS (SELECT 1 FROM quizzes WHERE title=N'IELTS Diagnostic Assessment (Band 7.0 Test)') INSERT INTO quizzes(title,pass_score,time_limit_minutes,course_id) SELECT N'IELTS Diagnostic Assessment (Band 7.0 Test)',75,20,id FROM courses WHERE title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng';
IF NOT EXISTS (SELECT 1 FROM quizzes WHERE title=N'TOEIC Mini Mock Test (Part 5 Focus)') INSERT INTO quizzes(title,pass_score,time_limit_minutes,course_id) SELECT N'TOEIC Mini Mock Test (Part 5 Focus)',70,10,id FROM courses WHERE title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày';

-- QUESTIONS
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'Mẫu câu nào sau đây phù hợp nhất để mở đầu một email trang trọng gửi đối tác?') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'Mẫu câu nào sau đây phù hợp nhất để mở đầu một email trang trọng gửi đối tác?',N'“Dear Mr. Smith, I hope this email finds you well.” là cách mở đầu trang trọng và phù hợp.',1 FROM quizzes WHERE title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'Khi muốn xin phép ngắt lời ai đó một cách lịch sự trong cuộc họp, bạn nên nói gì?') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'Khi muốn xin phép ngắt lời ai đó một cách lịch sự trong cuộc họp, bạn nên nói gì?',N'“May I interrupt for a moment?” là cách ngắt lời lịch thiệp.',2 FROM quizzes WHERE title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'Từ nào đồng nghĩa với "Postpone a meeting"?') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'Từ nào đồng nghĩa với "Postpone a meeting"?',N'“Postpone” và “Put off” đều có nghĩa là hoãn lại.',3 FROM quizzes WHERE title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'Trong IELTS Reading, kỹ thuật "Scanning" dùng để làm gì?') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'Trong IELTS Reading, kỹ thuật "Scanning" dùng để làm gì?',N'Scanning dùng để tìm nhanh thông tin cụ thể như tên riêng, số liệu và từ khóa.',1 FROM quizzes WHERE title=N'IELTS Diagnostic Assessment (Band 7.0 Test)';
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'Một bài Writing Task 2 tiêu chuẩn nên có tối thiểu bao nhiêu từ?') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'Một bài Writing Task 2 tiêu chuẩn nên có tối thiểu bao nhiêu từ?',N'IELTS Writing Task 2 yêu cầu tối thiểu 250 từ.',2 FROM quizzes WHERE title=N'IELTS Diagnostic Assessment (Band 7.0 Test)';
IF NOT EXISTS (SELECT 1 FROM questions WHERE content=N'The manager asked all staff members to submit ______ reports by Friday.') INSERT INTO questions(quiz_id,content,explanation,order_index) SELECT id,N'The manager asked all staff members to submit ______ reports by Friday.',N'Cần tính từ sở hữu “their” đứng trước danh từ “reports”.',1 FROM quizzes WHERE title=N'TOEIC Mini Mock Test (Part 5 Focus)';

-- QUESTION OPTIONS
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'Mẫu câu nào sau đây phù hợp nhất để mở đầu một email trang trọng gửi đối tác?') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'Hey Mr. Smith, what''s up?',0),(N'Dear Mr. Smith, I hope this email finds you well.',1),(N'Yo, check this out.',0),(N'Hi friend, write me back asap.',0)) v(content,correct) WHERE q.content=N'Mẫu câu nào sau đây phù hợp nhất để mở đầu một email trang trọng gửi đối tác?';
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'Khi muốn xin phép ngắt lời ai đó một cách lịch sự trong cuộc họp, bạn nên nói gì?') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'Stop talking now!',0),(N'Listen to me first.',0),(N'May I interrupt for a moment?',1),(N'Shut up please.',0)) v(content,correct) WHERE q.content=N'Khi muốn xin phép ngắt lời ai đó một cách lịch sự trong cuộc họp, bạn nên nói gì?';
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'Từ nào đồng nghĩa với "Postpone a meeting"?') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'Put off',1),(N'Call off',0),(N'Carry on',0),(N'Bring about',0)) v(content,correct) WHERE q.content=N'Từ nào đồng nghĩa với "Postpone a meeting"?';
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'Trong IELTS Reading, kỹ thuật "Scanning" dùng để làm gì?') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'Đọc hiểu ý chính toàn bài',0),(N'Tìm thông tin chi tiết cụ thể',1),(N'Dịch từng từ sang tiếng Việt',0),(N'Đoán nghĩa của tiêu đề',0)) v(content,correct) WHERE q.content=N'Trong IELTS Reading, kỹ thuật "Scanning" dùng để làm gì?';
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'Một bài Writing Task 2 tiêu chuẩn nên có tối thiểu bao nhiêu từ?') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'150 từ',0),(N'200 từ',0),(N'250 từ',1),(N'350 từ',0)) v(content,correct) WHERE q.content=N'Một bài Writing Task 2 tiêu chuẩn nên có tối thiểu bao nhiêu từ?';
IF NOT EXISTS (SELECT 1 FROM question_options o JOIN questions q ON q.id=o.question_id WHERE q.content=N'The manager asked all staff members to submit ______ reports by Friday.') INSERT INTO question_options(question_id,content,is_correct) SELECT q.id,v.content,v.correct FROM questions q CROSS APPLY (VALUES (N'they',0),(N'them',0),(N'their',1),(N'theirs',0)) v(content,correct) WHERE q.content=N'The manager asked all staff members to submit ______ reports by Friday.';

-- COMPLETED ORDERS
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-001') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-001',u.id,c.id,499000,'DEMO_PAY','COMPLETED','DEMO-TXN-001',DATEADD(day,-12,SYSDATETIME()),DATEADD(day,-12,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student@gmail.com' AND c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-002') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-002',u.id,c.id,890000,'DEMO_PAY','COMPLETED','DEMO-TXN-002',DATEADD(day,-10,SYSDATETIME()),DATEADD(day,-10,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student@gmail.com' AND c.title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-003') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-003',u.id,c.id,499000,'DEMO_PAY','COMPLETED','DEMO-TXN-003',DATEADD(day,-8,SYSDATETIME()),DATEADD(day,-8,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student2@gmail.com' AND c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-004') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-004',u.id,c.id,890000,'DEMO_PAY','COMPLETED','DEMO-TXN-004',DATEADD(day,-6,SYSDATETIME()),DATEADD(day,-6,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student2@gmail.com' AND c.title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-005') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-005',u.id,c.id,350000,'DEMO_PAY','COMPLETED','DEMO-TXN-005',DATEADD(day,-5,SYSDATETIME()),DATEADD(day,-5,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student2@gmail.com' AND c.title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-006') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-006',u.id,c.id,499000,'DEMO_PAY','COMPLETED','DEMO-TXN-006',DATEADD(day,-7,SYSDATETIME()),DATEADD(day,-7,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student3@gmail.com' AND c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-007') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-007',u.id,c.id,350000,'DEMO_PAY','COMPLETED','DEMO-TXN-007',DATEADD(day,-4,SYSDATETIME()),DATEADD(day,-4,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student3@gmail.com' AND c.title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-008') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-008',u.id,c.id,550000,'DEMO_PAY','COMPLETED','DEMO-TXN-008',DATEADD(day,-2,SYSDATETIME()),DATEADD(day,-2,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student3@gmail.com' AND c.title=N'Tiếng Anh Chuyên Ngành CNTT (IT English)' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-009') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-009',u.id,c.id,890000,'DEMO_PAY','COMPLETED','DEMO-TXN-009',DATEADD(day,-9,SYSDATETIME()),DATEADD(day,-9,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student4@gmail.com' AND c.title=N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-010') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-010',u.id,c.id,550000,'DEMO_PAY','COMPLETED','DEMO-TXN-010',DATEADD(day,-3,SYSDATETIME()),DATEADD(day,-3,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student4@gmail.com' AND c.title=N'Tiếng Anh Chuyên Ngành CNTT (IT English)' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-011') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-011',u.id,c.id,299000,'DEMO_PAY','COMPLETED','DEMO-TXN-011',DATEADD(day,-1,SYSDATETIME()),DATEADD(day,-1,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student4@gmail.com' AND c.title=N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-012') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-012',u.id,c.id,499000,'DEMO_PAY','COMPLETED','DEMO-TXN-012',DATEADD(day,-11,SYSDATETIME()),DATEADD(day,-11,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student5@gmail.com' AND c.title=N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-013') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-013',u.id,c.id,350000,'DEMO_PAY','COMPLETED','DEMO-TXN-013',DATEADD(day,-6,SYSDATETIME()),DATEADD(day,-6,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student5@gmail.com' AND c.title=N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code='DEMO-014') INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at) SELECT 'DEMO-014',u.id,c.id,299000,'DEMO_PAY','COMPLETED','DEMO-TXN-014',DATEADD(day,-2,SYSDATETIME()),DATEADD(day,-2,SYSDATETIME()) FROM users u CROSS JOIN courses c WHERE u.email='student5@gmail.com' AND c.title=N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.student_id=u.id AND o.course_id=c.id AND o.status='COMPLETED');

-- ENROLLMENTS are derived from successful demo orders
INSERT INTO enrollments(student_id,course_id) SELECT DISTINCT o.student_id,o.course_id FROM orders o WHERE o.status='COMPLETED' AND NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id=o.student_id AND e.course_id=o.course_id);

-- LESSON PROGRESS
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student@gmail.com' AND l.title IN (N'Bài 1: Tự tin giới thiệu bản thân & công việc',N'Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp',N'Bài 3: Đặt lịch họp và xác nhận qua điện thoại',N'Bài 4: Mẫu câu đưa ra ý kiến trong cuộc họp',N'Bài 5: Kỹ năng thuyết trình dự án bằng tiếng Anh') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,CASE WHEN l.title=N'Bài 3: Cấu trúc bài luận Writing Task 2' THEN 0 ELSE 1 END FROM users u CROSS JOIN lessons l WHERE u.email='student@gmail.com' AND l.title IN (N'Bài 1: Phương pháp xử lý Multiple Choice trong Listening',N'Bài 2: Chiến lược Skimming & Scanning trong Reading',N'Bài 3: Cấu trúc bài luận Writing Task 2') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student2@gmail.com' AND l.title IN (N'Bài 1: Tự tin giới thiệu bản thân & công việc',N'Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp',N'Bài 3: Đặt lịch họp và xác nhận qua điện thoại') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student2@gmail.com' AND l.title IN (N'Bài 1: Dạng câu hỏi về Từ loại',N'Bài 2: Bẫy Mệnh đề quan hệ') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student3@gmail.com' AND l.title IN (N'Bài 1: Tự tin giới thiệu bản thân & công việc',N'Bài 2: Viết Email và tin nhắn công việc chuyên nghiệp') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student3@gmail.com' AND l.title IN (N'Bài 1: Báo cáo tiến độ Daily Standup Meeting',N'Bài 2: Đọc hiểu API Specs & Git Workflow') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student4@gmail.com' AND l.title IN (N'Bài 1: Phương pháp xử lý Multiple Choice trong Listening',N'Bài 2: Chiến lược Skimming & Scanning trong Reading',N'Bài 3: Cấu trúc bài luận Writing Task 2',N'Bài 4: Bứt phá Speaking Part 2 và 3') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student4@gmail.com' AND l.title=N'Bài 1: Hiện tại đơn & Tiếp diễn' AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student5@gmail.com' AND l.title=N'Bài 1: Tự tin giới thiệu bản thân & công việc' AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);
INSERT INTO lesson_progress(student_id,lesson_id,is_completed) SELECT u.id,l.id,1 FROM users u CROSS JOIN lessons l WHERE u.email='student5@gmail.com' AND l.title IN (N'Bài 1: Hiện tại đơn & Tiếp diễn',N'Bài 2: Quá khứ đơn & Hoàn thành') AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);

-- QUIZ RESULTS
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,100,3,3,1,DATEADD(minute,-12,DATEADD(day,-10,SYSDATETIME())),DATEADD(day,-10,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student@gmail.com' AND q.title=N'IELTS Diagnostic Assessment (Band 7.0 Test)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,85,2,2,1,DATEADD(minute,-18,DATEADD(day,-8,SYSDATETIME())),DATEADD(day,-8,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student@gmail.com' AND q.title=N'IELTS Diagnostic Assessment (Band 7.0 Test)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student2@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,66.7,2,3,0,DATEADD(minute,-14,DATEADD(day,-5,SYSDATETIME())),DATEADD(day,-5,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student2@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student2@gmail.com' AND q.title=N'TOEIC Mini Mock Test (Part 5 Focus)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,100,1,1,1,DATEADD(minute,-8,DATEADD(day,-4,SYSDATETIME())),DATEADD(day,-4,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student2@gmail.com' AND q.title=N'TOEIC Mini Mock Test (Part 5 Focus)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student3@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,100,3,3,1,DATEADD(minute,-11,DATEADD(day,-3,SYSDATETIME())),DATEADD(day,-3,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student3@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student4@gmail.com' AND q.title=N'IELTS Diagnostic Assessment (Band 7.0 Test)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,90,2,2,1,DATEADD(minute,-17,DATEADD(day,-2,SYSDATETIME())),DATEADD(day,-2,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student4@gmail.com' AND q.title=N'IELTS Diagnostic Assessment (Band 7.0 Test)';
IF NOT EXISTS (SELECT 1 FROM quiz_results r JOIN users u ON u.id=r.student_id JOIN quizzes q ON q.id=r.quiz_id WHERE u.email='student5@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)') INSERT INTO quiz_results(student_id,quiz_id,score,correct_count,total_questions,passed,started_at,submitted_at) SELECT u.id,q.id,100,3,3,1,DATEADD(minute,-10,DATEADD(day,-1,SYSDATETIME())),DATEADD(day,-1,SYSDATETIME()) FROM users u CROSS JOIN quizzes q WHERE u.email='student5@gmail.com' AND q.title=N'Kiểm tra Đánh giá Giao tiếp Công sở (Quiz 1)';

-- ================================================================
-- EXTENDED DEMO DATA: dữ liệu đủ lớn cho danh sách và dashboard
-- Khối này vẫn có thể chạy lại an toàn và không xóa dữ liệu hiện có.
-- ================================================================

-- ADDITIONAL TEACHERS
INSERT INTO users(name,email,password,role,status,date_of_birth,phone,occupation,country,province)
SELECT v.name,v.email,'$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2','teacher',v.status,v.dob,v.phone,v.occupation,N'Việt Nam',v.province
FROM (VALUES
    (N'Nguyễn Khánh Vy','teacher4@gmail.com','active','1990-04-18','0904100001',N'Giảng viên tiếng Anh thương mại',N'Hà Nội'),
    (N'Phạm Hoàng Nam','teacher5@gmail.com','active','1987-09-12','0904100002',N'Giảng viên luyện thi TOEIC',N'TP. Hồ Chí Minh'),
    (N'Đặng Minh Châu','teacher6@gmail.com','active','1992-01-25','0904100003',N'Chuyên gia phát âm và giao tiếp',N'Đà Nẵng'),
    (N'Vũ Thanh Hà','teacher7@gmail.com','inactive','1989-07-06','0904100004',N'Giảng viên IELTS',N'Hải Phòng')
) v(name,email,status,dob,phone,occupation,province)
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email=v.email);

-- ADDITIONAL STUDENTS
INSERT INTO users(name,email,password,role,status,date_of_birth,phone,occupation,country,province)
SELECT v.name,v.email,'$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2','student',v.status,v.dob,v.phone,v.occupation,N'Việt Nam',v.province
FROM (VALUES
    (N'Đỗ Gia Hân','student6@gmail.com','active','2003-02-14','0904200001',N'Sinh viên',N'Hà Nội'),
    (N'Nguyễn Hải Đăng','student7@gmail.com','active','1998-06-21','0904200002',N'Nhân viên kinh doanh',N'TP. Hồ Chí Minh'),
    (N'Lâm Ngọc Anh','student8@gmail.com','active','2001-11-09','0904200003',N'Nhân viên nhân sự',N'Bình Dương'),
    (N'Bùi Quốc Khánh','student9@gmail.com','active','1996-03-30','0904200004',N'Lập trình viên',N'Đà Nẵng'),
    (N'Trương Thảo My','student10@gmail.com','active','2002-08-17','0904200005',N'Sinh viên',N'Cần Thơ'),
    (N'Phan Minh Nhật','student11@gmail.com','active','1995-12-03','0904200006',N'Chuyên viên tài chính',N'Hà Nội'),
    (N'Hoàng Bảo Trâm','student12@gmail.com','active','1999-05-28','0904200007',N'Nhân viên marketing',N'TP. Hồ Chí Minh'),
    (N'Võ Đức Anh','student13@gmail.com','active','2000-10-11','0904200008',N'Kỹ sư xây dựng',N'Đồng Nai'),
    (N'Đinh Phương Uyên','student14@gmail.com','active','2004-01-19','0904200009',N'Sinh viên',N'Huế'),
    (N'Mai Tuấn Kiệt','student15@gmail.com','active','1997-07-22','0904200010',N'Nhân viên xuất nhập khẩu',N'Hải Phòng'),
    (N'Lý Quỳnh Như','student16@gmail.com','active','2001-04-05','0904200011',N'Thiết kế đồ họa',N'TP. Hồ Chí Minh'),
    (N'Trần Hoàng Phúc','student17@gmail.com','active','1994-09-16','0904200012',N'Quản lý nhà hàng',N'Khánh Hòa'),
    (N'Ngô Thanh Tâm','student18@gmail.com','locked','2002-12-24','0904200013',N'Sinh viên',N'Hà Nội'),
    (N'Phạm Mỹ Duyên','student19@gmail.com','inactive','1998-02-07','0904200014',N'Nhân viên văn phòng',N'Đà Nẵng'),
    (N'Đặng Quốc Việt','student20@gmail.com','active','1993-06-13','0904200015',N'Kỹ sư cơ khí',N'Bắc Ninh')
) v(name,email,status,dob,phone,occupation,province)
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email=v.email);

-- ADDITIONAL COURSES WITH REAL WORKFLOW STATES
INSERT INTO courses(title,description,price,status,submitted_at,reviewed_at,review_note,teacher_id,category_id)
SELECT v.title,v.description,v.price,v.status,
       CASE WHEN v.status IN ('pending','published','rejected') THEN DATEADD(day,v.submitted_days,SYSDATETIME()) END,
       CASE WHEN v.status IN ('published','rejected') THEN DATEADD(day,v.reviewed_days,SYSDATETIME()) END,
       v.review_note,u.id,c.id
FROM (VALUES
    (N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản',N'Làm chủ 44 âm IPA, khẩu hình và trọng âm để giao tiếp rõ ràng, tự nhiên.',429000.0,N'published',-80,-78,CAST(NULL AS NVARCHAR(1000)),'teacher6@gmail.com',N'Tiếng Anh Giao Tiếp'),
    (N'English for Business Communication',N'Giao tiếp trong họp, email, thuyết trình và đàm phán với đối tác quốc tế.',649000.0,N'published',-68,-66,CAST(NULL AS NVARCHAR(1000)),'teacher4@gmail.com',N'Tiếng Anh Thương Mại & CNTT'),
    (N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu',N'Lộ trình ngữ pháp và từ vựng cốt lõi dành cho người mất gốc.',379000.0,N'published',-52,-50,CAST(NULL AS NVARCHAR(1000)),'teacher5@gmail.com',N'Luyện thi TOEIC'),
    (N'IELTS Writing Task 2 Chuyên Sâu',N'Phân tích đề, xây dựng luận điểm và sửa các lỗi thường gặp trong bài viết học thuật.',759000.0,N'pending',-3,0,CAST(NULL AS NVARCHAR(1000)),'teacher2@gmail.com',N'Luyện thi IELTS'),
    (N'Giao Tiếp Tiếng Anh Khi Du Lịch',N'Mẫu câu thực tế tại sân bay, khách sạn, nhà hàng và các tình huống khẩn cấp.',289000.0,N'draft',0,0,CAST(NULL AS NVARCHAR(1000)),'teacher6@gmail.com',N'Tiếng Anh Giao Tiếp'),
    (N'Tiếng Anh Cho Phỏng Vấn Xin Việc',N'Chuẩn bị hồ sơ, giới thiệu kinh nghiệm và trả lời câu hỏi phỏng vấn bằng tiếng Anh.',459000.0,N'rejected',-14,-12,N'Cần bổ sung bài thực hành và mô tả đầu ra cho từng chương.','teacher4@gmail.com',N'Tiếng Anh Thương Mại & CNTT'),
    (N'Ngữ Pháp Ứng Dụng Trong Giao Tiếp',N'Biến kiến thức ngữ pháp thành phản xạ qua các tình huống giao tiếp thường ngày.',329000.0,N'archived',-120,-118,CAST(NULL AS NVARCHAR(1000)),'teacher3@gmail.com',N'Ngữ Pháp & Từ Vựng Căn Bản')
) v(title,description,price,status,submitted_days,reviewed_days,review_note,teacher_email,category_name)
JOIN users u ON u.email=v.teacher_email
JOIN categories c ON c.name=v.category_name
WHERE NOT EXISTS (SELECT 1 FROM courses x WHERE x.title=v.title);

-- CONTENT FOR THE NEW PUBLISHED COURSES
INSERT INTO chapters(title,order_index,course_id)
SELECT v.chapter_title,v.order_index,c.id
FROM (VALUES
    (N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản',N'Chương 1: Nền tảng bảng phiên âm IPA',1),
    (N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản',N'Chương 2: Trọng âm và ngữ điệu',2),
    (N'English for Business Communication',N'Chương 1: Email và trao đổi công việc',1),
    (N'English for Business Communication',N'Chương 2: Họp và thuyết trình',2),
    (N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu',N'Chương 1: Ngữ pháp TOEIC cốt lõi',1),
    (N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu',N'Chương 2: Làm quen Listening và Reading',2)
) v(course_title,chapter_title,order_index)
JOIN courses c ON c.title=v.course_title
WHERE NOT EXISTS (SELECT 1 FROM chapters ch WHERE ch.course_id=c.id AND ch.title=v.chapter_title);

INSERT INTO lessons(title,video_url,order_index,chapter_id)
SELECT v.lesson_title,'https://www.youtube.com/watch?v=juKd26qkNAw',v.order_index,ch.id
FROM (VALUES
    (N'Chương 1: Nền tảng bảng phiên âm IPA',N'IPA 1: Nguyên âm đơn và khẩu hình',1),
    (N'Chương 1: Nền tảng bảng phiên âm IPA',N'IPA 2: Nguyên âm đôi thường gặp',2),
    (N'Chương 2: Trọng âm và ngữ điệu',N'IPA 3: Trọng âm trong từ và câu',1),
    (N'Chương 2: Trọng âm và ngữ điệu',N'IPA 4: Nối âm trong giao tiếp',2),
    (N'Chương 1: Email và trao đổi công việc',N'Business 1: Cấu trúc email chuyên nghiệp',1),
    (N'Chương 1: Email và trao đổi công việc',N'Business 2: Phản hồi và theo dõi công việc',2),
    (N'Chương 2: Họp và thuyết trình',N'Business 3: Điều hành cuộc họp',1),
    (N'Chương 2: Họp và thuyết trình',N'Business 4: Trình bày số liệu',2),
    (N'Chương 1: Ngữ pháp TOEIC cốt lõi',N'TOEIC 500 - Bài 1: Các loại từ',1),
    (N'Chương 1: Ngữ pháp TOEIC cốt lõi',N'TOEIC 500 - Bài 2: Thì và hòa hợp chủ vị',2),
    (N'Chương 2: Làm quen Listening và Reading',N'TOEIC 500 - Bài 3: Nghe tranh và hỏi đáp',1),
    (N'Chương 2: Làm quen Listening và Reading',N'TOEIC 500 - Bài 4: Đọc hiểu đoạn ngắn',2)
) v(chapter_title,lesson_title,order_index)
JOIN chapters ch ON ch.title=v.chapter_title
WHERE NOT EXISTS (SELECT 1 FROM lessons l WHERE l.chapter_id=ch.id AND l.title=v.lesson_title);

-- ADDITIONAL ORDERS: completed, failed and pending across 90 days
INSERT INTO orders(order_code,student_id,course_id,amount,payment_method,status,transaction_no,created_at,completed_at)
SELECT v.order_code,u.id,c.id,c.price,v.payment_method,v.status,
       CASE WHEN v.status='COMPLETED' THEN CONCAT('DEMO-TXN-',v.order_code) END,
       DATEADD(day,v.days_ago,SYSDATETIME()),
       CASE WHEN v.status='COMPLETED' THEN DATEADD(minute,5,DATEADD(day,v.days_ago,SYSDATETIME())) END
FROM (VALUES
    ('DEMO-015','student6@gmail.com',N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản','DEMO_PAY','COMPLETED',-88),
    ('DEMO-016','student6@gmail.com',N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm','DEMO_PAY','COMPLETED',-72),
    ('DEMO-017','student7@gmail.com',N'English for Business Communication','DEMO_PAY','COMPLETED',-67),
    ('DEMO-018','student7@gmail.com',N'Tiếng Anh Chuyên Ngành CNTT (IT English)','DEMO_PAY','COMPLETED',-44),
    ('DEMO-019','student8@gmail.com',N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản','DEMO_PAY','COMPLETED',-61),
    ('DEMO-020','student8@gmail.com',N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z','DEMO_PAY','COMPLETED',-39),
    ('DEMO-021','student9@gmail.com',N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu','DEMO_PAY','COMPLETED',-49),
    ('DEMO-022','student9@gmail.com',N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày','DEMO_PAY','COMPLETED',-27),
    ('DEMO-023','student10@gmail.com',N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng','DEMO_PAY','COMPLETED',-45),
    ('DEMO-024','student10@gmail.com',N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản','DEMO_PAY','COMPLETED',-31),
    ('DEMO-025','student11@gmail.com',N'English for Business Communication','DEMO_PAY','COMPLETED',-36),
    ('DEMO-026','student11@gmail.com',N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm','DEMO_PAY','COMPLETED',-22),
    ('DEMO-027','student12@gmail.com',N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm','DEMO_PAY','COMPLETED',-29),
    ('DEMO-028','student12@gmail.com',N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng','DEMO_PAY','COMPLETED',-18),
    ('DEMO-029','student13@gmail.com',N'Tiếng Anh Chuyên Ngành CNTT (IT English)','DEMO_PAY','COMPLETED',-25),
    ('DEMO-030','student13@gmail.com',N'English for Business Communication','DEMO_PAY','COMPLETED',-16),
    ('DEMO-031','student14@gmail.com',N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu','DEMO_PAY','COMPLETED',-21),
    ('DEMO-032','student14@gmail.com',N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z','DEMO_PAY','COMPLETED',-12),
    ('DEMO-033','student15@gmail.com',N'English for Business Communication','DEMO_PAY','COMPLETED',-19),
    ('DEMO-034','student15@gmail.com',N'Phát Âm Tiếng Anh Chuẩn IPA Từ Cơ Bản','DEMO_PAY','COMPLETED',-9),
    ('DEMO-035','student16@gmail.com',N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng','DEMO_PAY','COMPLETED',-15),
    ('DEMO-036','student16@gmail.com',N'Tiếng Anh Giao Tiếp Thực Chiến Cho Người Đi Làm','DEMO_PAY','COMPLETED',-8),
    ('DEMO-037','student17@gmail.com',N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu','DEMO_PAY','COMPLETED',-13),
    ('DEMO-038','student17@gmail.com',N'Bứt Phá TOEIC 750+ Cấp Tốc Trong 30 Ngày','DEMO_PAY','COMPLETED',-6),
    ('DEMO-039','student20@gmail.com',N'Tiếng Anh Chuyên Ngành CNTT (IT English)','DEMO_PAY','COMPLETED',-11),
    ('DEMO-040','student20@gmail.com',N'English for Business Communication','DEMO_PAY','COMPLETED',-4),
    ('DEMO-041','student6@gmail.com',N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z','DEMO_PAY','FAILED',-24),
    ('DEMO-042','student8@gmail.com',N'Chinh Phục IELTS 7.0+ Toàn Diện 4 Kỹ Năng','DEMO_PAY','FAILED',-17),
    ('DEMO-043','student11@gmail.com',N'TOEIC 500 Nền Tảng Cho Người Mới Bắt Đầu','DEMO_PAY','FAILED',-7),
    ('DEMO-044','student14@gmail.com',N'English for Business Communication','DEMO_PAY','FAILED',-5),
    ('DEMO-045','student20@gmail.com',N'Ngữ Pháp Tiếng Anh Nền Tảng A-Z','DEMO_PAY','FAILED',-3),
    ('DEMO-046','student10@gmail.com',N'English for Business Communication','DEMO_PAY','PENDING',0)
) v(order_code,student_email,course_title,payment_method,status,days_ago)
JOIN users u ON u.email=v.student_email
JOIN courses c ON c.title=v.course_title
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.order_code=v.order_code);

-- Derive enrollments once more after adding the extended successful orders.
INSERT INTO enrollments(student_id,course_id)
SELECT DISTINCT o.student_id,o.course_id
FROM orders o
WHERE o.status='COMPLETED'
  AND NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id=o.student_id AND e.course_id=o.course_id);

-- REALISTIC PROGRESS FOR THE NEW STUDENTS
INSERT INTO lesson_progress(student_id,lesson_id,is_completed)
SELECT u.id,l.id,
       CASE WHEN (ABS(CHECKSUM(u.email,l.title)) % 5)=0 THEN 0 ELSE 1 END
FROM users u
JOIN enrollments e ON e.student_id=u.id
JOIN chapters ch ON ch.course_id=e.course_id
JOIN lessons l ON l.chapter_id=ch.id
WHERE u.email IN ('student6@gmail.com','student7@gmail.com','student8@gmail.com','student9@gmail.com','student10@gmail.com','student11@gmail.com','student12@gmail.com','student13@gmail.com','student14@gmail.com','student15@gmail.com','student16@gmail.com','student17@gmail.com','student20@gmail.com')
  AND (ABS(CHECKSUM(u.email,l.title)) % 3)<>0
  AND NOT EXISTS (SELECT 1 FROM lesson_progress p WHERE p.student_id=u.id AND p.lesson_id=l.id);

-- Summary returned by SSMS after execution.
SELECT N'Người dùng' AS [Loại dữ liệu], COUNT(*) AS [Tổng số] FROM users
UNION ALL SELECT N'Khóa học',COUNT(*) FROM courses
UNION ALL SELECT N'Bài học',COUNT(*) FROM lessons
UNION ALL SELECT N'Đơn hàng',COUNT(*) FROM orders
UNION ALL SELECT N'Ghi danh',COUNT(*) FROM enrollments
UNION ALL SELECT N'Kết quả quiz',COUNT(*) FROM quiz_results;
