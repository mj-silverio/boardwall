package com.dashplaygrounds.boardwall.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dashplaygrounds.boardwall.models.Category;
import com.dashplaygrounds.boardwall.services.CategoryService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
public class CategoryControllerV1 {

    @Autowired
    private CategoryService categoryService;
    // Get all categories
    @GetMapping
    public List<Category> getAllCategories() {
        List<Category> result = categoryService.getAllCategories();
        log.info("Fetched all categories: {}", result);
        return result;
    }

    // Get a specific category by ID
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable String id) {
        Category category = categoryService.getOneCategoryById(id);
        log.info("Fetched category with ID {}: {}", id, category);
        return category;
    }

    // Create a new category
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        log.info("Creating new category: {}", category);
        Category result = categoryService.saveCategory(category);
        log.info("Created category: {}", result);
        return result;
    }

    // Update an existing category
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category updatedCategory) {
        log.info("Updating category with ID {}: {}", id, updatedCategory);
        Category result = categoryService.updateOneCategoryById(id, updatedCategory);
        if (result == null) {
            log.error("Category with ID {} not found", id);
            return null;
        } else {
            log.info("result: {}", result);
        }
        return result;
    }

    // Delete a category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable String id) {
        log.info("Deleting category with ID {}", id);
        categoryService.deleteById(id);
        return "{\"id\": \"" + id + "\"}";
    }
}
