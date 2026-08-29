package com.learnup.backend;

import com.learnup.backend.entity.Lesson;
import com.learnup.backend.entity.LessonProgress;
import com.learnup.backend.entity.User;
import com.learnup.backend.repository.LessonProgressRepository;
import com.learnup.backend.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired private LessonProgressRepository lessonProgressRepository;
    @Autowired private LessonRepository lessonRepository;

    @GetMapping("/student/{studentId}")
    public List<LessonProgress> getStudentProgress(@PathVariable Long studentId) {
        return lessonProgressRepository.findByStudentId(studentId);
    }

    @PostMapping("/toggle")
    public Object toggleLessonProgress(@RequestBody Map<String, Object> body) {
        Long studentId = Long.parseLong(body.get("studentId").toString());
        Long lessonId = Long.parseLong(body.get("lessonId").toString());

        Optional<LessonProgress> opt = lessonProgressRepository.findByStudentIdAndLessonId(studentId, lessonId);
        LessonProgress lp;
        if (opt.isPresent()) {
            lp = opt.get();
            lp.setIsCompleted(!Boolean.TRUE.equals(lp.getIsCompleted()));
        } else {
            lp = new LessonProgress();
            User s = new User(); s.setId(studentId);
            Lesson l = new Lesson(); l.setId(lessonId);
            lp.setStudent(s);
            lp.setLesson(l);
            lp.setIsCompleted(true);
        }
        LessonProgress saved = lessonProgressRepository.save(lp);
        return Map.of("success", true, "isCompleted", saved.getIsCompleted());
    }
}
