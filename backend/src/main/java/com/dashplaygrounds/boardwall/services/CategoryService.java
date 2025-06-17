package com.dashplaygrounds.boardwall.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dashplaygrounds.boardwall.models.Category;
import com.dashplaygrounds.boardwall.repositories.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getOneCategoryById(String id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category saveCategory(Category categoryAccount) {
        return categoryRepository.save(categoryAccount);
    }

    public Category updateOneCategoryById(String id, Category updatedCategory) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(updatedCategory.getName());
            category.setDescription(updatedCategory.getDescription());
            return categoryRepository.save(updatedCategory);
        }).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public void deleteById(String id) {
        categoryRepository.deleteById(id);
    }
}
