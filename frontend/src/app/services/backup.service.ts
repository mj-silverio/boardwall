import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { IBoard } from '../models/board.model';
import { StickyNote } from '../models/sticky-note.model';
import { BoardService } from './board.service';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private apiUrl = environment.API_URL; // Replace with your API URL

    constructor(private http: HttpClient, private boardService: BoardService) {}

    // Get one board by ID
    getBoardById(boardId: String): Observable<IBoard> {
        return this.boardService.getBoardById(boardId);
    }

    // Fetch all board walls
    getStickyNotesByBoardId(boardId: String): Observable<Object[]> {
        return this.http.get<Object[]>(`${this.apiUrl}/backups/filtered-sticky-notes?boardId=${boardId}`);
    }

    // Fetch a single board wall by ID
    importNewBoard(boardData: IBoard): Observable<IBoard> {
        return this.http.post<IBoard>(`${this.apiUrl}/backups/new-board`, boardData);
    }

    // Create a new board wall
    importNewStickyNotesByBoardId(boardId: String, stickyNotes: StickyNote[]): Observable<IBoard> {
        return this.http.post<IBoard>(`${this.apiUrl}/backups/new-sticky-notes?boardId=${boardId}`, stickyNotes);
    }

}