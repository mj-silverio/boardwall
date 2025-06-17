package com.dashplaygrounds.boardwall.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.dashplaygrounds.boardwall.models.Board;
import com.dashplaygrounds.boardwall.repositories.BoardRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board getOneBoardById(String id) {
        return boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }

    public Board updateOneBoardById(String id, Board updatedUser) {
        return boardRepository.findById(id).map(board -> {
            board.setName(updatedUser.getName());
            board.setDescription(updatedUser.getDescription());
            return boardRepository.save(updatedUser);
        }).orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public Board patchOneBoardById(String id, Board partialUpdate) {
        return boardRepository.findById(id).map(board -> {
            if (partialUpdate.getName() != null) {
                board.setName(partialUpdate.getName());
            }
            if (partialUpdate.getDescription() != null) {
                board.setDescription(partialUpdate.getDescription());
            }
            return boardRepository.save(board);
        }).orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public void deleteById(String id) {
        boardRepository.deleteById(id);
    }
}
