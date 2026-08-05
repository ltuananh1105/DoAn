package com.learnup.backend;

import com.learnup.backend.entity.Chapter;
import com.learnup.backend.entity.Course;
import com.learnup.backend.repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ChapterController {

    @Autowired
    private ChapterRepository chapterRepository;

    @GetMapping("/courses/{courseId}/chapters")
    public List<Chapter> getChapters(@PathVariable Long courseId) {
        return chapterRepository.findByCourseId(courseId);
    }

    @PostMapping("/courses/{courseId}/chapters")
    public Chapter createChapter(@PathVariable Long courseId, @RequestBody Chapter chapter) {
        Course course = new Course();
        course.setId(courseId);
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }
}