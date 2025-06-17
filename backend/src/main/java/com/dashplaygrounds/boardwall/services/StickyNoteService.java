package com.dashplaygrounds.boardwall.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dashplaygrounds.boardwall.models.StickyNote;
import com.dashplaygrounds.boardwall.repositories.StickyNoteRepository;

@Service
public class StickyNoteService {
    @Autowired
    private StickyNoteRepository stickyNoteRepository;

    public List<StickyNote> getAllStickyNotes() {
        return stickyNoteRepository.findAll();
    }

    public StickyNote getOneStickyNoteById(String id) {
        return stickyNoteRepository.findById(id).orElseThrow(() -> new RuntimeException("StickyNote not found"));
    }

    public StickyNote saveStickyNote(StickyNote stickyNote) {
        return stickyNoteRepository.save(stickyNote);
    }

    public StickyNote updateOneStickyNoteById(String id, StickyNote updatedStickyNote) {
        return stickyNoteRepository.findById(id).map(stickyNote -> {
            stickyNote.setColor(updatedStickyNote.getColor());
            stickyNote.setPosition(updatedStickyNote.getPosition());
            return stickyNoteRepository.save(updatedStickyNote);
        }).orElseThrow(() -> new RuntimeException("StickyNote not found"));
    }

    public StickyNote patchOneStickyNoteById(String id, StickyNote partialUpdate) {
        return stickyNoteRepository.findById(id).map(stickyNote -> {
            if (partialUpdate.getColor() != null) {
                stickyNote.setColor(partialUpdate.getColor());
            }
            if (partialUpdate.getPosition() != null) {
                stickyNote.setPosition(partialUpdate.getPosition());
            }
            return stickyNoteRepository.save(stickyNote);
        }).orElseThrow(() -> new RuntimeException("StickyNote not found"));
    }

    public void deleteById(String id) {
        stickyNoteRepository.deleteById(id);
    }
}
