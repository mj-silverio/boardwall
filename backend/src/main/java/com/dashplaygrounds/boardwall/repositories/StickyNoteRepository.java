package com.dashplaygrounds.boardwall.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dashplaygrounds.boardwall.models.StickyNote;

public interface StickyNoteRepository extends JpaRepository<StickyNote, String> {

}
