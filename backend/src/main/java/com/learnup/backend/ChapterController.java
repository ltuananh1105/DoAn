package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Course;
import com.learnup.backend.entity.Lesson;
import com.learnup.backend.repository.ChapterRepository;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.LessonRepository;
import com.learnup.backend.repository.LessonProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Objects;
import com.learnup.backend.security.CurrentUser;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;
    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private CurrentUser currentUser;

    @GetMapping("/course/{courseId}")
    public List<Chapter> getChaptersByCourse(@PathVariable Long courseId) {
        currentUser.requireCourseAccess(courseId);
        return chapterRepository.findByCourseIdOrderByOrderIndexAscIdAsc(courseId);
    }

    @PostMapping("/course/{courseId}")
    public Chapter addChapter(@PathVariable Long courseId, @RequestBody Chapter chapter) {
        currentUser.requireCourseOwner(courseId);
        Course course = courseRepository.findById(courseId).orElseThrow();
        if (chapter.getTitle() == null || chapter.getTitle().isBlank()) throw new IllegalArgumentException("Tên chương không được để trống");
        chapter.setTitle(chapter.getTitle().trim());
        chapter.setOrderIndex(chapterRepository.findByCourseId(courseId).stream()
                .map(Chapter::getOrderIndex).filter(Objects::nonNull).max(Integer::compareTo).orElse(0) + 1);
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    @PutMapping("/{chapterId}")
    public Object updateChapter(@PathVariable Long chapterId, @RequestBody Map<String, Object> body) {
        currentUser.requireChapterOwner(chapterId);
        Optional<Chapter> opt = chapterRepository.findById(chapterId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy chương");
        Chapter ch = opt.get();
        String title = body.get("title") instanceof String value ? value.trim() : "";
        if (title.isEmpty()) return Map.of("success", false, "message", "Tên chương không được để trống");
        ch.setTitle(title);
        chapterRepository.save(ch);
        return Map.of("success", true, "chapter", ch);
    }

    @DeleteMapping("/{chapterId}")
    @Transactional
    public Object deleteChapter(@PathVariable Long chapterId) {
        currentUser.requireChapterOwner(chapterId);
        if (!chapterRepository.existsById(chapterId)) return Map.of("success", false, "message", "Không tìm thấy chương");
        List<Lesson> lessons = lessonRepository.findByChapterId(chapterId);
        for (Lesson lesson : lessons) lessonProgressRepository.deleteByLessonId(lesson.getId());
        lessonRepository.deleteAll(lessons);
        chapterRepository.deleteById(chapterId);
        return Map.of("success", true, "message", "Đã xóa chương");
    }

    @GetMapping("/{chapterId}/lessons")
    public List<Lesson> getLessonsByChapter(@PathVariable Long chapterId) {
        currentUser.requireChapterAccess(chapterId);
        return lessonRepository.findByChapterIdOrderByOrderIndexAscIdAsc(chapterId);
    }

    @PostMapping("/{chapterId}/lessons")
    public Lesson addLesson(@PathVariable Long chapterId, @RequestBody Lesson lesson) {
        currentUser.requireChapterOwner(chapterId);
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();
        if (lesson.getTitle() == null || lesson.getTitle().isBlank()) throw new IllegalArgumentException("Tên bài học không được để trống");
        lesson.setTitle(lesson.getTitle().trim());
        lesson.setOrderIndex(lessonRepository.findByChapterId(chapterId).stream()
                .map(Lesson::getOrderIndex).filter(Objects::nonNull).max(Integer::compareTo).orElse(0) + 1);
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }
}
