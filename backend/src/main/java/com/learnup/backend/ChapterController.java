package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Course;
import com.learnup.backend.entity.Lesson;
import com.learnup.backend.repository.ChapterRepository;
import com.learnup.backend.repository.CourseRepository;
import com.learnup.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/course/{courseId}")
    public List<Chapter> getChaptersByCourse(@PathVariable Long courseId) {
        return chapterRepository.findByCourseId(courseId);
    }

    @PostMapping("/course/{courseId}")
    public Chapter addChapter(@PathVariable Long courseId, @RequestBody Chapter chapter) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    @PutMapping("/{chapterId}")
    public Object updateChapter(@PathVariable Long chapterId, @RequestBody Map<String, Object> body) {
        Optional<Chapter> opt = chapterRepository.findById(chapterId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy chương");
        Chapter ch = opt.get();
        if (body.containsKey("title")) ch.setTitle((String) body.get("title"));
        chapterRepository.save(ch);
        return Map.of("success", true, "chapter", ch);
    }

    @DeleteMapping("/{chapterId}")
    @Transactional
    public Object deleteChapter(@PathVariable Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) return Map.of("success", false, "message", "Không tìm thấy chương");
        List<Lesson> lessons = lessonRepository.findByChapterId(chapterId);
        lessonRepository.deleteAll(lessons);
        chapterRepository.deleteById(chapterId);
        return Map.of("success", true, "message", "Đã xóa chương");
    }

    @GetMapping("/{chapterId}/lessons")
    public List<Lesson> getLessonsByChapter(@PathVariable Long chapterId) {
        return lessonRepository.findByChapterId(chapterId);
    }

    @PostMapping("/{chapterId}/lessons")
    public Lesson addLesson(@PathVariable Long chapterId, @RequestBody Lesson lesson) {
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }
}