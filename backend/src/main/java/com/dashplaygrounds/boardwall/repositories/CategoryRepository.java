package com.dashplaygrounds.boardwall.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dashplaygrounds.boardwall.models.Category;

public interface CategoryRepository extends JpaRepository<Category, String> {

}
