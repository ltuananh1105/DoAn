package com.learnup.backend;

import com.learnup.backend.entity.Category;
import com.learnup.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public Object createCategory(@RequestBody Category category) {
        String name = category.getName() == null ? "" : category.getName().trim();
        if (name.isEmpty()) return Map.of("success", false, "message", "Tên danh mục không được để trống");
        if (categoryRepository.existsByNameIgnoreCase(name)) return Map.of("success", false, "message", "Danh mục đã tồn tại");
        category.setName(name);
        return categoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public Object updateCategory(@PathVariable Long id, @RequestBody Category input) {
        var category = categoryRepository.findById(id).orElse(null);
        if (category == null) return Map.of("success", false, "message", "Không tìm thấy danh mục");
        String name = input.getName() == null ? "" : input.getName().trim();
        if (name.isEmpty()) return Map.of("success", false, "message", "Tên danh mục không được để trống");
        if (!name.equalsIgnoreCase(category.getName()) && categoryRepository.existsByNameIgnoreCase(name)) {
            return Map.of("success", false, "message", "Danh mục đã tồn tại");
        }
        category.setName(name);
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public Object deleteCategory(@PathVariable Long id,
                                 @Autowired com.learnup.backend.repository.CourseRepository courseRepository) {
        if (!categoryRepository.existsById(id)) return Map.of("success", false, "message", "Không tìm thấy danh mục");
        if (courseRepository.countByCategoryId(id) > 0) return Map.of("success", false, "message", "Không thể xóa danh mục đang có khóa học");
        categoryRepository.deleteById(id);
        return Map.of("success", true, "message", "Đã xóa danh mục");
    }
}
