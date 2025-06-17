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

import com.dashplaygrounds.boardwall.models.BoardWall;
import com.dashplaygrounds.boardwall.services.BoardWallService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/boardwalls")
public class BoardWallControllerV1 {

    @Autowired
    private BoardWallService boardWallService;
    // Get all boardwalls
    @GetMapping
    public List<BoardWall> getAllBoardWalls() {
        List result = boardWallService.getAllBoardWalls();
        log.info("Fetched all boardwalls: {}", result);
        return result;
    }

    // Get a specific boardwall by ID
    @GetMapping("/{id}")
    public BoardWall getBoardWallById(@PathVariable String id) {
        BoardWall boardwall = boardWallService.getOneBoardWallById(id);
        log.info("Fetched boardwall with ID {}: {}", id, boardwall);
        return boardwall;
    }

    // Create a new boardwall
    @PostMapping
    public BoardWall createBoardWall(@RequestBody BoardWall boardwall) {
        log.info("Creating new boardwall: {}", boardwall);
        BoardWall result = boardWallService.saveBoardWall(boardwall);
        log.info("Created boardwall: {}", result);
        return result;
    }

    // Update an existing boardwall
    @PutMapping("/{id}")
    public BoardWall updateBoardWall(@PathVariable String id, @RequestBody BoardWall updatedBoardWall) {
        log.info("Updating boardwall with ID {}: {}", id, updatedBoardWall);
        BoardWall result = boardWallService.updateOneBoardWallById(id, updatedBoardWall);
        if (result == null) {
            log.error("BoardWall with ID {} not found", id);
            return null;
        } else {
            log.info("result: {}", result);
        }
        return result;
    }

    // Delete a boardwall
    @DeleteMapping("/{id}")
    public String deleteBoardWall(@PathVariable String id) {
        log.info("Deleting boardwall with ID {}", id);
        boardWallService.deleteById(id);
        return "{\"id\": \"" + id + "\"}";
    }
}
