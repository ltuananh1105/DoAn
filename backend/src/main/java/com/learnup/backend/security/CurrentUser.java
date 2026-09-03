package com.learnup.backend.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;
import com.learnup.backend.repository.*;

@Component
public class CurrentUser {
    private final CourseRepository courses;
    private final ChapterRepository chapters;
    private final LessonRepository lessons;
    private final QuizRepository quizzes;
    private final EnrollmentRepository enrollments;

    public CurrentUser(CourseRepository courses, ChapterRepository chapters, LessonRepository lessons,
                       QuizRepository quizzes, EnrollmentRepository enrollments) {
        this.courses = courses; this.chapters = chapters; this.lessons = lessons;
        this.quizzes = quizzes; this.enrollments = enrollments;
    }
    private Map<?, ?> claims() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Map<?, ?> map)) {
            throw new AccessDeniedException("Chưa đăng nhập");
        }
        return map;
    }

    public Long id() {
        Object value = claims().get("userId");
        if (!(value instanceof Number number)) throw new AccessDeniedException("Token không hợp lệ");
        return number.longValue();
    }

    public String role() { return String.valueOf(claims().get("role")); }
    public boolean isAdmin() { return "admin".equalsIgnoreCase(role()); }

    public void requireSelf(Long requestedId) {
        if (!isAdmin() && !id().equals(requestedId)) throw new AccessDeniedException("Không có quyền truy cập dữ liệu này");
    }

    public void requireStudentSelf(Long studentId) {
        if (!"student".equalsIgnoreCase(role()) || !id().equals(studentId)) {
            throw new AccessDeniedException("Không có quyền truy cập dữ liệu học viên này");
        }
    }

    public void requireTeacher(Long teacherId) {
        if (!"teacher".equalsIgnoreCase(role()) || !id().equals(teacherId)) {
            throw new AccessDeniedException("Không có quyền quản lý dữ liệu giáo viên này");
        }
    }

    public void requireCourseOwner(Long courseId) {
        var course = courses.findById(courseId).orElseThrow();
        if (course.getTeacher() == null) throw new AccessDeniedException("Khóa học chưa có giáo viên");
        requireTeacher(course.getTeacher().getId());
    }

    public void requireChapterOwner(Long chapterId) {
        var chapter = chapters.findById(chapterId).orElseThrow();
        requireCourseOwner(chapter.getCourse().getId());
    }

    public void requireLessonOwner(Long lessonId) {
        var lesson = lessons.findById(lessonId).orElseThrow();
        requireChapterOwner(lesson.getChapter().getId());
    }

    public void requireQuizOwner(Long quizId) {
        var quiz = quizzes.findById(quizId).orElseThrow();
        requireCourseOwner(quiz.getCourse().getId());
    }

    public void requireCourseEditable(Long courseId) {
        requireCourseOwner(courseId);
        var course = courses.findById(courseId).orElseThrow();
        String status = course.getStatus() == null ? "draft" : course.getStatus().toLowerCase();
        if (!("draft".equals(status) || "rejected".equals(status))) {
            throw new AccessDeniedException("Chỉ được sửa nội dung khóa học ở trạng thái bản nháp hoặc bị từ chối");
        }
    }

    public void requireChapterEditable(Long chapterId) {
        var chapter = chapters.findById(chapterId).orElseThrow();
        requireCourseEditable(chapter.getCourse().getId());
    }

    public void requireLessonEditable(Long lessonId) {
        var lesson = lessons.findById(lessonId).orElseThrow();
        requireChapterEditable(lesson.getChapter().getId());
    }

    public void requireQuizEditable(Long quizId) {
        var quiz = quizzes.findById(quizId).orElseThrow();
        requireCourseEditable(quiz.getCourse().getId());
    }

    public void requireCourseAccess(Long courseId) {
        if (isAdmin()) return;
        var course = courses.findById(courseId).orElseThrow();
        if ("teacher".equalsIgnoreCase(role()) && course.getTeacher() != null && id().equals(course.getTeacher().getId())) return;
        if ("student".equalsIgnoreCase(role()) && enrollments.existsByStudentIdAndCourseId(id(), courseId)) return;
        throw new AccessDeniedException("Bạn chưa được cấp quyền truy cập khóa học này");
    }

    public void requireChapterAccess(Long chapterId) {
        var chapter = chapters.findById(chapterId).orElseThrow();
        requireCourseAccess(chapter.getCourse().getId());
    }
}
