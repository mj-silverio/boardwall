package com.dashplaygrounds.boardwall.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import com.dashplaygrounds.boardwall.models.Board;
import com.dashplaygrounds.boardwall.models.StickyNote;
import com.dashplaygrounds.boardwall.repositories.BoardRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BackupService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardService boardService;

    @Autowired
    private StickyNoteService stickyNoteService;

    // Export all sticky notes according to board id
    public List<StickyNote> getAllStickyNotesByBoardId(String boardId) {
        List<StickyNote> matchingStickyNotes = stickyNoteService.getAllStickyNotes()
                .stream()
                .filter(stickyNote -> stickyNote.getBoardId().equals(boardId))
                .peek(stickyNote -> System.out.println("Matching StickyNote: " + stickyNote))
                .toList();
        return matchingStickyNotes;
    }

    // Import a board
    public Board importBoard(Board board) {
        String existingUuid = board.getId();
        log.info("Importing board: {}", board);

        // Create and save the new entity
        Board blankBoard = new Board();
        // blankBoard.setId(existingUuid);
        blankBoard.setName(board.getName());
        blankBoard.setDescription(board.getDescription());
        blankBoard.setCategoryId(board.getCategoryId());
        blankBoard.setCreatedAt(board.getCreatedAt());
        blankBoard.setUpdatedAt(board.getUpdatedAt());
        
        try {
            return boardRepository.save(blankBoard);
        } catch (Exception e) {
            // Log error details
            System.err.println("Error saving Board: " + e.getMessage());
            throw e; // Handle exception as needed
        }
    }

    // Import all sticky notes according to board id
    public ResponseEntity<String> importStickyNotesByBoardId(String boardId, List<StickyNote> stickyNotes) {

        List<StickyNote> existingStickyNotes = stickyNoteService.getAllStickyNotes();
        for (StickyNote stickyNote : stickyNotes) {
            if (existingStickyNotes.stream().anyMatch(existing -> existing.getId().equals(stickyNote.getId()))) {
                log.info("Sticky note with id {} already exists", stickyNote.getId());
                // return new ResponseEntity<String>("Custom error message", HttpStatusCode.valueOf(418));
            } else {
                log.info("Saving sticky note: {}", stickyNote);
                StickyNote importedStickyNote = new StickyNote();
                importedStickyNote.setTitle(stickyNote.getTitle());
                importedStickyNote.setContent(stickyNote.getContent());
                importedStickyNote.setColor(stickyNote.getColor());
                importedStickyNote.setPosition(stickyNote.getPosition());
                importedStickyNote.setSize(stickyNote.getSize());
                importedStickyNote.setBoardId(boardId);
                importedStickyNote.setCreatedAt(stickyNote.getCreatedAt());
                importedStickyNote.setUpdatedAt(stickyNote.getUpdatedAt());

                stickyNoteService.saveStickyNote(importedStickyNote);
            }
        }
        return new ResponseEntity<String>("Success message", HttpStatus.OK);
    }
}
