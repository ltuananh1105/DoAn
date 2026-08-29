CREATE DATABASE learnup_db;

USE learnup_db;

-- Insert Users (Admin, Teachers, Students)
INSERT INTO users (name, email, password, role, date_of_birth, phone, occupation, country, province) VALUES
-- Admin
('Admin LearnUp', 'admin@learnup.com', 'admin123', 'admin', '1990-01-15', '0912345678', 'Administrator', 'Vietnam', 'Ho Chi Minh'),
-- Teachers
('Nguyễn Văn A - Giảng viên', 'teacher1@learnup.com', 'teacher123', 'teacher', '1985-05-20', '0901234567', 'Teacher', 'Vietnam', 'Ho Chi Minh'),
('Trần Thị B - Giảng viên', 'teacher2@learnup.com', 'teacher123', 'teacher', '1988-03-10', '0901234568', 'Teacher', 'Vietnam', 'Hanoi'),
('Phạm Minh C - Giảng viên', 'teacher3@learnup.com', 'teacher123', 'teacher', '1986-07-25', '0901234569', 'Teacher', 'Vietnam', 'Da Nang'),
-- Students
('Lê Hoàng Đức', 'student1@learnup.com', 'student123', 'student', '2005-02-14', '0912345679', 'Student', 'Vietnam', 'Ho Chi Minh'),
('Vũ Thị Minh Hoa', 'student2@learnup.com', 'student123', 'student', '2004-08-18', '0912345680', 'Student', 'Vietnam', 'Hanoi'),
('Đặng Văn Sơn', 'student3@learnup.com', 'student123', 'student', '2005-12-03', '0912345681', 'Student', 'Vietnam', 'Da Nang'),
('Ngô Thị Thanh Hương', 'student4@learnup.com', 'student123', 'student', '2004-06-22', '0912345682', 'Student', 'Vietnam', 'Can Tho'),
('Bùi Minh Khôi', 'student5@learnup.com', 'student123', 'student', '2005-11-09', '0912345683', 'Student', 'Vietnam', 'Ho Chi Minh');

-- Insert Categories
INSERT INTO categories (name) VALUES
('Lập trình Web'),
('Lập trình Mobile'),
('Data Science'),
('UI/UX Design'),
('Quản lý dự án');

-- Insert Courses
INSERT INTO courses (title, description, price, status, teacher_id, category_id) VALUES
('Lập trình Java từ cơ bản đến nâng cao', 'Khóa học toàn diện về lập trình Java bao gồm OOP, Collections, Streams và các design patterns', 299000, 'approved', 2, 1),
('Phát triển ứng dụng React hiện đại', 'Học React từ component cơ bản đến hooks, Redux, và các thư viện phổ biến', 349000, 'approved', 2, 1),
('Python cho Data Analysis', 'Khóa học Python chuyên sâu với Pandas, NumPy, Matplotlib cho phân tích dữ liệu', 279000, 'approved', 3, 3),
('Thiết kế UX/UI chuyên nghiệp', 'Học thiết kế giao diện người dùng với Figma, UX principles và best practices', 199000, 'approved', 4, 4),
('Quản lý dự án Agile', 'Phương pháp Agile, Scrum framework và công cụ quản lý dự án hiệu quả', 249000, 'approved', 2, 5),
('Lập trình Android với Kotlin', 'Phát triển ứng dụng Android native sử dụng Kotlin và Jetpack libraries', 329000, 'approved', 3, 2),
('MySQL và Database Design', 'Thiết kế cơ sở dữ liệu, SQL nâng cao, indexing, optimization và best practices', 259000, 'approved', 4, 1),
('JavaScript ES6+ Mastery', 'Làm chủ JavaScript modern với async/await, Promise, Destructuring và nhiều tính năng mới', 219000, 'approved', 2, 1);

-- Insert Chapters for Course 1 (Java)
INSERT INTO chapters (title, course_id) VALUES
('Giới thiệu Java và cài đặt môi trường', 1),
('Biến, kiểu dữ liệu và toán tử', 1),
('Cấu trúc điều khiển: if-else, switch, loops', 1),
('Mảng và Collections', 1),
('Lập trình hướng đối tượng (OOP)', 1),
('Exception Handling và File I/O', 1);

-- Insert Chapters for Course 2 (React)
INSERT INTO chapters (title, course_id) VALUES
('Nhập môn React và JSX', 2),
('Components, Props và State', 2),
('Hooks: useState, useEffect, useContext', 2),
('Quản lý state với Redux', 2),
('React Router và Navigation', 2),
('Tối ưu hóa hiệu suất React', 2);

-- Insert Chapters for Course 3 (Python Data)
INSERT INTO chapters (title, course_id) VALUES
('Cài đặt Python và Jupyter Notebook', 3),
('NumPy cơ bản: Arrays và Operations', 3),
('Pandas: DataFrames và Data Manipulation', 3),
('Visualize dữ liệu với Matplotlib', 3),
('Phân tích thống kê và EDA', 3);

-- Insert Chapters for Course 4 (UI/UX)
INSERT INTO chapters (title, course_id) VALUES
('Nguyên tắc thiết kế giao diện', 4),
('Figma: Basics và Prototyping', 4),
('UX Research và User Testing', 4),
('Design System và Component Library', 4);

-- Insert Chapters for Course 5 (Agile)
INSERT INTO chapters (title, course_id) VALUES
('Giới thiệu Agile và Scrum', 5),
('Sprint Planning và Estimation', 5),
('Backlog Management', 5),
('Retrospectives và Continuous Improvement', 5);

-- Insert Lessons for Java Course
INSERT INTO lessons (title, video_url, chapter_id) VALUES
('Lịch sử Java và các phiên bản', 'https://youtube.com/watch?v=java-intro', 1),
('Cài đặt JDK và IDE', 'https://youtube.com/watch?v=java-setup', 1),
('Hello World - Chương trình đầu tiên', 'https://youtube.com/watch?v=hello-world', 1),
('Khai báo biến và kiểu dữ liệu', 'https://youtube.com/watch?v=variables', 2),
('Toán tử số học và logic', 'https://youtube.com/watch?v=operators', 2),
('If-else và Switch statements', 'https://youtube.com/watch?v=conditionals', 3),
('For, while, do-while loops', 'https://youtube.com/watch?v=loops', 3),
('Mảng một chiều và hai chiều', 'https://youtube.com/watch?v=arrays', 4),
('ArrayList và HashMap', 'https://youtube.com/watch?v=collections', 4),
('Class và Object', 'https://youtube.com/watch?v=classes', 5),
('Inheritance và Polymorphism', 'https://youtube.com/watch?v=inheritance', 5),
('Exception Handling: try-catch', 'https://youtube.com/watch?v=exceptions', 6),
('Đọc ghi file trong Java', 'https://youtube.com/watch?v=fileio', 6);

-- Insert Lessons for React Course
INSERT INTO lessons (title, video_url, chapter_id) VALUES
('React là gì?', 'https://youtube.com/watch?v=react-intro', 7),
('JSX Syntax', 'https://youtube.com/watch?v=jsx', 7),
('Functional Components', 'https://youtube.com/watch?v=functional-components', 8),
('Props và Props Drilling', 'https://youtube.com/watch?v=props', 8),
('State với useState Hook', 'https://youtube.com/watch?v=usestate', 9),
('useEffect Hook', 'https://youtube.com/watch?v=useeffect', 9),
('Redux Setup', 'https://youtube.com/watch?v=redux-setup', 10),
('Redux Actions và Reducers', 'https://youtube.com/watch?v=redux-actions', 10),
('React Router Setup', 'https://youtube.com/watch?v=react-router', 11),
('Navigation và Link Component', 'https://youtube.com/watch?v=navigation', 11);

-- Insert Lessons for Python Course
INSERT INTO lessons (title, video_url, chapter_id) VALUES
('Cài đặt Python 3', 'https://youtube.com/watch?v=python-install', 13),
('Jupyter Notebook Setup', 'https://youtube.com/watch?v=jupyter', 13),
('NumPy Arrays', 'https://youtube.com/watch?v=numpy-arrays', 14),
('NumPy Operations', 'https://youtube.com/watch?v=numpy-ops', 14),
('Pandas Series và DataFrame', 'https://youtube.com/watch?v=pandas-intro', 15),
('Data Cleaning với Pandas', 'https://youtube.com/watch?v=data-cleaning', 15),
('Matplotlib Basics', 'https://youtube.com/watch?v=matplotlib', 16),
('Advanced Plotting', 'https://youtube.com/watch?v=advanced-plot', 16);

-- Insert Lessons for UI/UX Course
INSERT INTO lessons (title, video_url, chapter_id) VALUES
('Design Principles', 'https://youtube.com/watch?v=design-principles', 19),
('Color Theory', 'https://youtube.com/watch?v=color-theory', 19),
('Figma Workspace', 'https://youtube.com/watch?v=figma-intro', 20),
('Prototyping in Figma', 'https://youtube.com/watch?v=figma-prototype', 20),
('User Research', 'https://youtube.com/watch?v=user-research', 21),
('Usability Testing', 'https://youtube.com/watch?v=usability-test', 21);

-- Insert Lessons for Agile Course
INSERT INTO lessons (title, video_url, chapter_id) VALUES
('Agile Manifesto', 'https://youtube.com/watch?v=agile-intro', 25),
('Scrum Framework', 'https://youtube.com/watch?v=scrum', 25),
('Sprint Planning', 'https://youtube.com/watch?v=sprint-planning', 26),
('Estimation Techniques', 'https://youtube.com/watch?v=estimation', 26);

-- Insert Enrollments (Students enrolling in courses)
INSERT INTO enrollments (student_id, course_id) VALUES
-- Student 1 enrolls in 3 courses
(5, 1), (5, 2), (5, 5),
-- Student 2 enrolls in 2 courses
(6, 3), (6, 4),
-- Student 3 enrolls in 2 courses
(7, 1), (7, 6),
-- Student 4 enrolls in 4 courses
(8, 2), (8, 3), (8, 4), (8, 7),
-- Student 5 enrolls in 3 courses
(9, 1), (9, 2), (9, 8);
