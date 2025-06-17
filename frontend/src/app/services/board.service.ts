import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { IBoard } from '../models/board.model';


@Injectable({
    providedIn: 'root'
})
export class BoardService {
    private apiUrl = environment.API_URL; // Replace with your API URL


    httpOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            // Authorization: 'my-auth-token'
        })
    };


    constructor(private http: HttpClient) { }

    // Fetch all boards
    getBoards(): Observable<IBoard[]> {
        return this.http.get<IBoard[]>(`${this.apiUrl}/boards`);
    }

    // Fetch a single board by ID
    getBoardById(boardId: String): Observable<IBoard> {
        return this.http.get<IBoard>(`${this.apiUrl}/boards/${boardId}`);
    }

    // Create a new board
    createBoard(boardData: IBoard): Observable<IBoard> {
        return this.http.post<IBoard>(`${this.apiUrl}/boards`, boardData);
    }

    // Update an existing board
    updateBoard(boardId: String, boardData: IBoard): Observable<IBoard> {
        return this.http.put<IBoard>(`${this.apiUrl}/boards/${boardId}`, boardData);
    }

    // Patch an existing board
    patchBoard(boardId: String, partialBoardData: Partial<IBoard>): Observable<IBoard> {
        return this.http.patch<IBoard>(`${this.apiUrl}/boards/${boardId}`, partialBoardData);
    }

    // Delete a board
    deleteBoard(boardId: String): Observable<IBoard> {
        return this.http.delete<IBoard>(`${this.apiUrl}/boards/${boardId}`);
    }
}