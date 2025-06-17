package com.dashplaygrounds.boardwall.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dashplaygrounds.boardwall.models.Board;
import com.dashplaygrounds.boardwall.services.BoardService;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/api/v1/boards")
public class BoardControllerV1 {

    @Autowired
    private BoardService boardService;
    
    // Get all boards
    @GetMapping
    public List<Board> getAllBoards() {
        List<Board> result = boardService.getAllBoards();
        log.info("Fetched all boards: {}", result);
        return result;
    }

    // Get a specific board by ID
    @GetMapping("/{id}")
    public Board getBoardById(@PathVariable String id) {
        Board board = boardService.getOneBoardById(id);
        log.info("Fetched board with ID {}: {}", id, board);
        return board;
    }

    // Create a new board
    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        log.info("Creating new board: {}", board);
        Board result = boardService.saveBoard(board);
        log.info("Created board: {}", result);
        return result;
    }

    // Update an existing board
    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable String id, @RequestBody Board updatedBoard) {
        log.info("Updating board with ID {}: {}", id, updatedBoard);
        Board result = boardService.updateOneBoardById(id, updatedBoard);
        if (result == null) {
            log.error("Board with ID {} not found", id);
            return null;
        } else {
            log.info("result: {}", result);
        }
        return result;
    }

    // Patch an existing board
    @PatchMapping("/{id}")
    public Board patchBoard(@PathVariable String id, @RequestBody Board partialBoard) {
        log.info("Patching board with ID {}: {}", id, partialBoard);
        Board result = boardService.patchOneBoardById(id, partialBoard);
        if (result == null) {
            log.error("Board with ID {} not found", id);
            return null;
        } else {
            log.info("Patched board: {}", result);
        }
        return result;
    }

    // Delete a board
    @DeleteMapping("/{id}")
    public String deleteBoard(@PathVariable String id) {
        log.info("Deleting board with ID {}", id);
        boardService.deleteById(id);
        return "{\"id\": \"" + id + "\"}";
    }
}
