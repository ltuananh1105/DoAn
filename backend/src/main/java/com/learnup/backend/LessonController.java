package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Lesson;
import com.learnup.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping("/chapters/{chapterId}/lessons")
    public List<Lesson> getLessons(@PathVariable Long chapterId) {
        return lessonRepository.findByChapterId(chapterId);
    }

    @PostMapping("/chapters/{chapterId}/lessons")
    public Lesson createLesson(@PathVariable Long chapterId, @RequestBody Lesson lesson) {
        Chapter chapter = new Chapter();
        chapter.setId(chapterId);
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }
}