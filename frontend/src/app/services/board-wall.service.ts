import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { IBoardWall } from '../models/board-wall.model';


@Injectable({
    providedIn: 'root'
})
export class BoardWallService {
    private apiUrl = environment.API_URL; // Replace with your API URL

    constructor(private http: HttpClient) {}

    // Fetch all board walls
    getBoardWalls(): Observable<IBoardWall[]> {
        return this.http.get<IBoardWall[]>(`${this.apiUrl}/boardwalls`);
    }

    // Fetch a single board wall by ID
    getBoardWallById(boardWallId: Number): Observable<IBoardWall> {
        return this.http.get<IBoardWall>(`${this.apiUrl}/boardwalls/${boardWallId}`);
    }

    // Create a new board wall
    createBoardWall(boardWallData: IBoardWall): Observable<IBoardWall> {
        return this.http.post<IBoardWall>(`${this.apiUrl}/boardwalls`, boardWallData);
    }

    // Update an existing board wall
    updateBoardWall(boardWallId: Number, boardWallData: IBoardWall): Observable<IBoardWall> {
        return this.http.put<IBoardWall>(`${this.apiUrl}/boardwalls/${boardWallId}`, boardWallData);
    }

    // Delete a board wall
    deleteBoardWall(boardWallId: Number): Observable<IBoardWall> {
        return this.http.delete<IBoardWall>(`${this.apiUrl}/boardwalls/${boardWallId}`);
    }
}