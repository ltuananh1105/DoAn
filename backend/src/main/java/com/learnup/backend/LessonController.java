package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Lesson;
import com.learnup.backend.repository.ChapterRepository;
import com.learnup.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired private com.learnup.backend.repository.LessonProgressRepository lessonProgressRepository;

    @GetMapping("/chapter/{chapterId}")
    public List<Lesson> getLessonsByChapter(@PathVariable Long chapterId) {
        return lessonRepository.findByChapterIdOrderByOrderIndexAscIdAsc(chapterId);
    }

    @PostMapping("/chapter/{chapterId}")
    public Lesson addLesson(@PathVariable Long chapterId, @RequestBody Lesson lesson) {
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();
        if (lesson.getTitle() == null || lesson.getTitle().isBlank()) throw new IllegalArgumentException("Tên bài học không được để trống");
        lesson.setTitle(lesson.getTitle().trim());
        lesson.setOrderIndex(lessonRepository.findByChapterId(chapterId).stream()
                .map(Lesson::getOrderIndex).filter(java.util.Objects::nonNull).max(Integer::compareTo).orElse(0) + 1);
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }

    @PutMapping("/{lessonId}")
    public Object updateLesson(@PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        Optional<Lesson> opt = lessonRepository.findById(lessonId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy bài học");
        Lesson l = opt.get();
        if (body.containsKey("title")) {
            String title = body.get("title") instanceof String value ? value.trim() : "";
            if (title.isEmpty()) return Map.of("success", false, "message", "Tên bài học không được để trống");
            l.setTitle(title);
        }
        if (body.containsKey("videoUrl")) l.setVideoUrl((String) body.get("videoUrl"));
        lessonRepository.save(l);
        return Map.of("success", true, "lesson", l);
    }

    @DeleteMapping("/{lessonId}")
    @org.springframework.transaction.annotation.Transactional
    public Object deleteLesson(@PathVariable Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) return Map.of("success", false, "message", "Không tìm thấy bài học");
        lessonProgressRepository.deleteByLessonId(lessonId);
        lessonRepository.deleteById(lessonId);
        return Map.of("success", true, "message", "Đã xóa bài học");
    }
}
