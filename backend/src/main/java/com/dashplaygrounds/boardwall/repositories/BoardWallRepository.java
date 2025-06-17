package com.dashplaygrounds.boardwall.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dashplaygrounds.boardwall.models.BoardWall;

public interface BoardWallRepository extends JpaRepository<BoardWall, String> {

}
