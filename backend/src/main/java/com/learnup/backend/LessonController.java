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

    @GetMapping("/chapter/{chapterId}")
    public List<Lesson> getLessonsByChapter(@PathVariable Long chapterId) {
        return lessonRepository.findByChapterId(chapterId);
    }

    @PostMapping("/chapter/{chapterId}")
    public Lesson addLesson(@PathVariable Long chapterId, @RequestBody Lesson lesson) {
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }

    @PutMapping("/{lessonId}")
    public Object updateLesson(@PathVariable Long lessonId, @RequestBody Map<String, Object> body) {
        Optional<Lesson> opt = lessonRepository.findById(lessonId);
        if (opt.isEmpty()) return Map.of("success", false, "message", "Không tìm thấy bài học");
        Lesson l = opt.get();
        if (body.containsKey("title")) l.setTitle((String) body.get("title"));
        if (body.containsKey("videoUrl")) l.setVideoUrl((String) body.get("videoUrl"));
        lessonRepository.save(l);
        return Map.of("success", true, "lesson", l);
    }

    @DeleteMapping("/{lessonId}")
    public Object deleteLesson(@PathVariable Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) return Map.of("success", false, "message", "Không tìm thấy bài học");
        lessonRepository.deleteById(lessonId);
        return Map.of("success", true, "message", "Đã xóa bài học");
    }
}