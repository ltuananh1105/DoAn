package com.learnup.backend;

import com.learnup.backend.entity.Category;
import com.learnup.backend.repository.CategoryRepository;
import com.learnup.backend.repository.CourseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTests {
    @Mock CategoryRepository categoryRepository;
    @Mock CourseRepository courseRepository;
    @InjectMocks CategoryController controller;

    @Test
    void createRejectsBlankName() {
        Category input = new Category();
        input.setName("   ");
        Object response = controller.createCategory(input);
        assertEquals(false, ((Map<?, ?>) response).get("success"));
        verifyNoInteractions(categoryRepository);
    }

    @Test
    void createRejectsDuplicateName() {
        Category input = new Category();
        input.setName("IELTS");
        when(categoryRepository.existsByNameIgnoreCase("IELTS")).thenReturn(true);
        Object response = controller.createCategory(input);
        assertEquals(false, ((Map<?, ?>) response).get("success"));
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void deleteRejectsCategoryUsedByCourse() {
        when(categoryRepository.existsById(1L)).thenReturn(true);
        when(courseRepository.countByCategoryId(1L)).thenReturn(2L);
        Object response = controller.deleteCategory(1L, courseRepository);
        assertEquals(false, ((Map<?, ?>) response).get("success"));
        verify(categoryRepository, never()).deleteById(anyLong());
    }
}
