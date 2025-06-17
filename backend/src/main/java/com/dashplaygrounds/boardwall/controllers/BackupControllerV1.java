package com.dashplaygrounds.boardwall.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.dashplaygrounds.boardwall.models.Board;
import com.dashplaygrounds.boardwall.models.StickyNote;
import com.dashplaygrounds.boardwall.services.BackupService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/backups")
public class BackupControllerV1 {

    @Autowired
    private BackupService backupService;

    // Get all boards
    @GetMapping("/filtered-sticky-notes")
    public List<StickyNote> exportData(@RequestParam String boardId) {
        log.info("Fetching all sticky notes by board id");
        List<StickyNote> result = backupService.getAllStickyNotesByBoardId(boardId);
        log.info("Fetched all sticky notes by board id: {}", result);
        return result;
    }

    // Create a new board
    @PostMapping("/new-board")
    public Board importNewBoard(@RequestBody Board board) {
        log.info("Creating new board: {}", board);
        Board newBoard = backupService.importBoard(board);
        log.info("Created board: {}", newBoard);
        return newBoard;
    }

    // Create new sticky notes
    @PostMapping("new-sticky-notes")
    public ResponseEntity<String> importNewStickyNotesByBoardId(@RequestParam String boardId,
            @RequestBody List<StickyNote> stickyNotes) {
        log.info("Importing sticky notes with boardId: {}", stickyNotes, boardId);
        ResponseEntity<String> result = backupService.importStickyNotesByBoardId(boardId, stickyNotes);
        log.info("Created sticky notes: {}", result);
        return result;
    }
}
