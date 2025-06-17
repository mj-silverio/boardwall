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

import com.dashplaygrounds.boardwall.models.StickyNote;
import com.dashplaygrounds.boardwall.services.StickyNoteService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/sticky-notes")
public class StickyNoteControllerV1 {

    @Autowired
    private StickyNoteService stickyNoteService;
    // Get all sticky-notes
    @GetMapping
    public List<StickyNote> getAllStickyNotes() {
        List<StickyNote> result = stickyNoteService.getAllStickyNotes();
        log.info("Fetched all sticky-notes: {}", result);
        return result;
    }

    // Get a specific sticky note by ID
    @GetMapping("/{id}")
    public StickyNote getStickyNoteById(@PathVariable String id) {
        StickyNote stickyNote = stickyNoteService.getOneStickyNoteById(id);
        log.info("Fetched sticky note with ID {}: {}", id, stickyNote);
        return stickyNote;
    }

    // Create a new sticky note
    @PostMapping
    public StickyNote createStickyNote(@RequestBody StickyNote stickyNote) {
        log.info("Creating new sticky note: {}", stickyNote);
        StickyNote result = stickyNoteService.saveStickyNote(stickyNote);
        log.info("Created sticky note: {}", result);
        return result;
    }

    // Update an existing sticky note
    @PutMapping("/{id}")
    public StickyNote updateStickyNote(@PathVariable String id, @RequestBody StickyNote updatedStickyNote) {
        log.info("Updating sticky note with ID {}: {}", id, updatedStickyNote);
        StickyNote result = stickyNoteService.updateOneStickyNoteById(id, updatedStickyNote);
        if (result == null) {
            log.error("StickyNote with ID {} not found", id);
            return null;
        } else {
            log.info("result: {}", result);
        }
        return result;
    }

    // Patch an existing board
    @PatchMapping("/{id}")
    public StickyNote patchStickyNote(@PathVariable String id, @RequestBody StickyNote partialUpdate) {
        log.info("Patching sticky note with ID {}: {}", id, partialUpdate);
        StickyNote result = stickyNoteService.patchOneStickyNoteById(id, partialUpdate);
        if (result == null) {
            log.error("StickyNote with ID {} not found", id);
            return null;
        } else {
            log.info("Patched sticky note: {}", result);
        }
        return result;
    }

    // Delete a sticky note
    @DeleteMapping("/{id}")
    public String deleteStickyNote(@PathVariable String id) {
        log.info("Deleting sticky note with ID {}", id);
        stickyNoteService.deleteById(id);
        return "{\"id\": \"" + id + "\"}";
    }
}
