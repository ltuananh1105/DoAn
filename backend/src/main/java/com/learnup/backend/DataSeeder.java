package com.learnup.backend;

import com.learnup.backend.entity.*;
import com.learnup.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DataSeeder(UserRepository userRepository,
                      CategoryRepository categoryRepository,
                      CourseRepository courseRepository,
                      ChapterRepository chapterRepository,
                      LessonRepository lessonRepository,
                      EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        List<User> users = new ArrayList<>();
        User admin = new User();
        admin.setName("Admin LearnUp");
        admin.setEmail("admin@learnup.com");
        admin.setPassword("admin123");
        admin.setRole("admin");
        admin.setDateOfBirth("1990-01-15");
        admin.setPhone("0912345678");
        admin.setOccupation("Administrator");
        admin.setCountry("Vietnam");
        admin.setProvince("Ho Chi Minh");
        users.add(admin);

        User teacher1 = new User();
        teacher1.setName("Nguyễn Văn A - Giảng viên");
        teacher1.setEmail("teacher1@learnup.com");
        teacher1.setPassword("teacher123");
        teacher1.setRole("teacher");
        teacher1.setDateOfBirth("1985-05-20");
        teacher1.setPhone("0901234567");
        teacher1.setOccupation("Teacher");
        teacher1.setCountry("Vietnam");
        teacher1.setProvince("Ho Chi Minh");
        users.add(teacher1);

        User teacher2 = new User();
        teacher2.setName("Trần Thị B - Giảng viên");
        teacher2.setEmail("teacher2@learnup.com");
        teacher2.setPassword("teacher123");
        teacher2.setRole("teacher");
        teacher2.setDateOfBirth("1988-03-10");
        teacher2.setPhone("0901234568");
        teacher2.setOccupation("Teacher");
        teacher2.setCountry("Vietnam");
        teacher2.setProvince("Hanoi");
        users.add(teacher2);

        User teacher3 = new User();
        teacher3.setName("Phạm Minh C - Giảng viên");
        teacher3.setEmail("teacher3@learnup.com");
        teacher3.setPassword("teacher123");
        teacher3.setRole("teacher");
        teacher3.setDateOfBirth("1986-07-25");
        teacher3.setPhone("0901234569");
        teacher3.setOccupation("Teacher");
        teacher3.setCountry("Vietnam");
        teacher3.setProvince("Da Nang");
        users.add(teacher3);

        User student1 = new User();
        student1.setName("Lê Hoàng Đức");
        student1.setEmail("student1@learnup.com");
        student1.setPassword("student123");
        student1.setRole("student");
        student1.setDateOfBirth("2005-02-14");
        student1.setPhone("0912345679");
        student1.setOccupation("Student");
        student1.setCountry("Vietnam");
        student1.setProvince("Ho Chi Minh");
        users.add(student1);

        User student2 = new User();
        student2.setName("Vũ Thị Minh Hoa");
        student2.setEmail("student2@learnup.com");
        student2.setPassword("student123");
        student2.setRole("student");
        student2.setDateOfBirth("2004-08-18");
        student2.setPhone("0912345680");
        student2.setOccupation("Student");
        student2.setCountry("Vietnam");
        student2.setProvince("Hanoi");
        users.add(student2);

        User student3 = new User();
        student3.setName("Đặng Văn Sơn");
        student3.setEmail("student3@learnup.com");
        student3.setPassword("student123");
        student3.setRole("student");
        student3.setDateOfBirth("2005-12-03");
        student3.setPhone("0912345681");
        student3.setOccupation("Student");
        student3.setCountry("Vietnam");
        student3.setProvince("Da Nang");
        users.add(student3);

        User student4 = new User();
        student4.setName("Ngô Thị Thanh Hương");
        student4.setEmail("student4@learnup.com");
        student4.setPassword("student123");
        student4.setRole("student");
        student4.setDateOfBirth("2004-06-22");
        student4.setPhone("0912345682");
        student4.setOccupation("Student");
        student4.setCountry("Vietnam");
        student4.setProvince("Can Tho");
        users.add(student4);

        User student5 = new User();
        student5.setName("Bùi Minh Khôi");
        student5.setEmail("student5@learnup.com");
        student5.setPassword("student123");
        student5.setRole("student");
        student5.setDateOfBirth("2005-11-09");
        student5.setPhone("0912345683");
        student5.setOccupation("Student");
        student5.setCountry("Vietnam");
        student5.setProvince("Ho Chi Minh");
        users.add(student5);

        users = userRepository.saveAll(users);

        List<Category> categories = new ArrayList<>();
        Category web = new Category();
        web.setName("Lập trình Web");
        categories.add(web);

        Category mobile = new Category();
        mobile.setName("Lập trình Mobile");
        categories.add(mobile);

        Category data = new Category();
        data.setName("Data Science");
        categories.add(data);

        Category uiux = new Category();
        uiux.setName("UI/UX Design");
        categories.add(uiux);

        Category pm = new Category();
        pm.setName("Quản lý dự án");
        categories.add(pm);

        categories = categoryRepository.saveAll(categories);

        List<Course> courses = new ArrayList<>();

        Course javaCourse = new Course();
        javaCourse.setTitle("Lập trình Java từ cơ bản đến nâng cao");
        javaCourse.setDescription("Khóa học toàn diện về lập trình Java bao gồm OOP, Collections, Streams và các design patterns");
        javaCourse.setPrice(299000.0);
        javaCourse.setStatus("approved");
        javaCourse.setTeacher(users.get(1));
        javaCourse.setCategory(categories.get(0));
        courses.add(javaCourse);

        Course reactCourse = new Course();
        reactCourse.setTitle("Phát triển ứng dụng React hiện đại");
        reactCourse.setDescription("Học React từ component cơ bản đến hooks, Redux, và các thư viện phổ biến");
        reactCourse.setPrice(349000.0);
        reactCourse.setStatus("approved");
        reactCourse.setTeacher(users.get(1));
        reactCourse.setCategory(categories.get(0));
        courses.add(reactCourse);

        Course pythonCourse = new Course();
        pythonCourse.setTitle("Python cho Data Analysis");
        pythonCourse.setDescription("Khóa học Python chuyên sâu với Pandas, NumPy, Matplotlib cho phân tích dữ liệu");
        pythonCourse.setPrice(279000.0);
        pythonCourse.setStatus("approved");
        pythonCourse.setTeacher(users.get(2));
        pythonCourse.setCategory(categories.get(2));
        courses.add(pythonCourse);

        Course uiuxCourse = new Course();
        uiuxCourse.setTitle("Thiết kế UX/UI chuyên nghiệp");
        uiuxCourse.setDescription("Học thiết kế giao diện người dùng với Figma, UX principles và best practices");
        uiuxCourse.setPrice(199000.0);
        uiuxCourse.setStatus("approved");
        uiuxCourse.setTeacher(users.get(3));
        uiuxCourse.setCategory(categories.get(3));
        courses.add(uiuxCourse);

        Course agileCourse = new Course();
        agileCourse.setTitle("Quản lý dự án Agile");
        agileCourse.setDescription("Phương pháp Agile, Scrum framework và công cụ quản lý dự án hiệu quả");
        agileCourse.setPrice(249000.0);
        agileCourse.setStatus("approved");
        agileCourse.setTeacher(users.get(1));
        agileCourse.setCategory(categories.get(4));
        courses.add(agileCourse);

        Course androidCourse = new Course();
        androidCourse.setTitle("Lập trình Android với Kotlin");
        androidCourse.setDescription("Phát triển ứng dụng Android native sử dụng Kotlin và Jetpack libraries");
        androidCourse.setPrice(329000.0);
        androidCourse.setStatus("approved");
        androidCourse.setTeacher(users.get(2));
        androidCourse.setCategory(categories.get(1));
        courses.add(androidCourse);

        Course mysqlCourse = new Course();
        mysqlCourse.setTitle("MySQL và Database Design");
        mysqlCourse.setDescription("Thiết kế cơ sở dữ liệu, SQL nâng cao, indexing, optimization và best practices");
        mysqlCourse.setPrice(259000.0);
        mysqlCourse.setStatus("approved");
        mysqlCourse.setTeacher(users.get(3));
        mysqlCourse.setCategory(categories.get(0));
        courses.add(mysqlCourse);

        Course jsCourse = new Course();
        jsCourse.setTitle("JavaScript ES6+ Mastery");
        jsCourse.setDescription("Làm chủ JavaScript modern với async/await, Promise, Destructuring và nhiều tính năng mới");
        jsCourse.setPrice(219000.0);
        jsCourse.setStatus("approved");
        jsCourse.setTeacher(users.get(1));
        jsCourse.setCategory(categories.get(0));
        courses.add(jsCourse);

        courses = courseRepository.saveAll(courses);

        List<Chapter> chapters = new ArrayList<>();
        String[][] chapterTitles = new String[][] {
                {"Giới thiệu Java và cài đặt môi trường", "Biến, kiểu dữ liệu và toán tử", "Cấu trúc điều khiển: if-else, switch, loops", "Mảng và Collections", "Lập trình hướng đối tượng (OOP)", "Exception Handling và File I/O"},
                {"Nhập môn React và JSX", "Components, Props và State", "Hooks: useState, useEffect, useContext", "Quản lý state với Redux", "React Router và Navigation", "Tối ưu hóa hiệu suất React"},
                {"Cài đặt Python và Jupyter Notebook", "NumPy cơ bản: Arrays và Operations", "Pandas: DataFrames và Data Manipulation", "Visualize dữ liệu với Matplotlib", "Phân tích thống kê và EDA"},
                {"Nguyên tắc thiết kế giao diện", "Figma: Basics và Prototyping", "UX Research và User Testing", "Design System và Component Library"},
                {"Giới thiệu Agile và Scrum", "Sprint Planning và Estimation", "Backlog Management", "Retrospectives và Continuous Improvement"},
                {"Giới thiệu Android", "Cài đặt môi trường Android", "UI với XML", "Navigation và ViewModel"},
                {"Cơ sở dữ liệu quan hệ", "SQL cơ bản", "Thiết kế schema", "Indexing và tối ưu hóa"},
                {"JavaScript cơ bản", "ES6 nâng cao", "Async/Await", "Debugging và Testing"}
        };

        for (int i = 0; i < courses.size(); i++) {
            for (String chapterTitle : chapterTitles[i]) {
                Chapter chapter = new Chapter();
                chapter.setTitle(chapterTitle);
                chapter.setCourse(courses.get(i));
                chapters.add(chapter);
            }
        }
        chapters = chapterRepository.saveAll(chapters);

        List<Lesson> lessons = new ArrayList<>();
        String[] javaLessons = {"Lịch sử Java và các phiên bản", "Cài đặt JDK và IDE", "Hello World - Chương trình đầu tiên", "Khai báo biến và kiểu dữ liệu", "Toán tử số học và logic", "If-else và Switch statements", "For, while, do-while loops", "Mảng một chiều và hai chiều", "ArrayList và HashMap", "Class và Object", "Inheritance và Polymorphism", "Exception Handling: try-catch", "Đọc ghi file trong Java"};
        String[] reactLessons = {"React là gì?", "JSX Syntax", "Functional Components", "Props và Props Drilling", "State với useState Hook", "useEffect Hook", "Redux Setup", "Redux Actions và Reducers", "React Router Setup", "Navigation và Link Component"};
        String[] pythonLessons = {"Cài đặt Python 3", "Jupyter Notebook Setup", "NumPy Arrays", "NumPy Operations", "Pandas Series và DataFrame", "Data Cleaning với Pandas", "Matplotlib Basics", "Advanced Plotting"};
        String[] uiuxLessons = {"Design Principles", "Color Theory", "Figma Workspace", "Prototyping in Figma", "User Research", "Usability Testing"};
        String[] agileLessons = {"Agile Manifesto", "Scrum Framework", "Sprint Planning", "Estimation Techniques"};

        int chapterIndex = 0;
        for (int courseIndex = 0; courseIndex < courses.size(); courseIndex++) {
            int lessonCount = switch (courseIndex) {
                case 0 -> javaLessons.length;
                case 1 -> reactLessons.length;
                case 2 -> pythonLessons.length;
                case 3 -> uiuxLessons.length;
                case 4 -> agileLessons.length;
                default -> 2;
            };

            for (int i = 0; i < lessonCount; i++) {
                Lesson lesson = new Lesson();
                lesson.setTitle(getLessonTitleForCourse(courseIndex, i));
                lesson.setVideoUrl("https://youtube.com/watch?v=" + (courseIndex + 1) + "-lesson-" + (i + 1));
                lesson.setChapter(chapters.get(chapterIndex + (i % Math.max(1, chapterTitles[courseIndex].length))));
                lessons.add(lesson);
            }

            chapterIndex += chapterTitles[courseIndex].length;
        }

        lessonRepository.saveAll(lessons);

        Enrollment enrollment1 = new Enrollment();
        enrollment1.setStudent(users.get(4));
        enrollment1.setCourse(courses.get(0));

        Enrollment enrollment2 = new Enrollment();
        enrollment2.setStudent(users.get(4));
        enrollment2.setCourse(courses.get(1));

        Enrollment enrollment3 = new Enrollment();
        enrollment3.setStudent(users.get(4));
        enrollment3.setCourse(courses.get(4));

        Enrollment enrollment4 = new Enrollment();
        enrollment4.setStudent(users.get(5));
        enrollment4.setCourse(courses.get(2));

        Enrollment enrollment5 = new Enrollment();
        enrollment5.setStudent(users.get(5));
        enrollment5.setCourse(courses.get(3));

        Enrollment enrollment6 = new Enrollment();
        enrollment6.setStudent(users.get(6));
        enrollment6.setCourse(courses.get(0));

        Enrollment enrollment7 = new Enrollment();
        enrollment7.setStudent(users.get(6));
        enrollment7.setCourse(courses.get(5));

        Enrollment enrollment8 = new Enrollment();
        enrollment8.setStudent(users.get(7));
        enrollment8.setCourse(courses.get(1));

        Enrollment enrollment9 = new Enrollment();
        enrollment9.setStudent(users.get(7));
        enrollment9.setCourse(courses.get(2));

        Enrollment enrollment10 = new Enrollment();
        enrollment10.setStudent(users.get(7));
        enrollment10.setCourse(courses.get(3));

        Enrollment enrollment11 = new Enrollment();
        enrollment11.setStudent(users.get(7));
        enrollment11.setCourse(courses.get(6));

        Enrollment enrollment12 = new Enrollment();
        enrollment12.setStudent(users.get(8));
        enrollment12.setCourse(courses.get(0));

        Enrollment enrollment13 = new Enrollment();
        enrollment13.setStudent(users.get(8));
        enrollment13.setCourse(courses.get(1));

        Enrollment enrollment14 = new Enrollment();
        enrollment14.setStudent(users.get(8));
        enrollment14.setCourse(courses.get(7));

        enrollmentRepository.saveAll(List.of(
                enrollment1, enrollment2, enrollment3, enrollment4, enrollment5,
                enrollment6, enrollment7, enrollment8, enrollment9, enrollment10,
                enrollment11, enrollment12, enrollment13, enrollment14
        ));
    }

    private String getLessonTitleForCourse(int courseIndex, int lessonIndex) {
        return switch (courseIndex) {
            case 0 -> new String[]{"Lịch sử Java và các phiên bản", "Cài đặt JDK và IDE", "Hello World - Chương trình đầu tiên", "Khai báo biến và kiểu dữ liệu", "Toán tử số học và logic", "If-else và Switch statements", "For, while, do-while loops", "Mảng một chiều và hai chiều", "ArrayList và HashMap", "Class và Object", "Inheritance và Polymorphism", "Exception Handling: try-catch", "Đọc ghi file trong Java"}[lessonIndex];
            case 1 -> new String[]{"React là gì?", "JSX Syntax", "Functional Components", "Props và Props Drilling", "State với useState Hook", "useEffect Hook", "Redux Setup", "Redux Actions và Reducers", "React Router Setup", "Navigation và Link Component"}[lessonIndex];
            case 2 -> new String[]{"Cài đặt Python 3", "Jupyter Notebook Setup", "NumPy Arrays", "NumPy Operations", "Pandas Series và DataFrame", "Data Cleaning với Pandas", "Matplotlib Basics", "Advanced Plotting"}[lessonIndex];
            case 3 -> new String[]{"Design Principles", "Color Theory", "Figma Workspace", "Prototyping in Figma", "User Research", "Usability Testing"}[lessonIndex];
            case 4 -> new String[]{"Agile Manifesto", "Scrum Framework", "Sprint Planning", "Estimation Techniques"}[lessonIndex];
            default -> "Bài học " + (lessonIndex + 1);
        };
    }
}
