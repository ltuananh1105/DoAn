package com.learnup.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = @UniqueConstraint(
        name = "uk_progress_student_lesson", columnNames = {"student_id", "lesson_id"}))
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private Boolean isCompleted;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
}
