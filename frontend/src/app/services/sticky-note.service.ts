import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { IStickyNote } from '../models/sticky-note.model';


@Injectable({
    providedIn: 'root'
})
export class StickyNoteService {
    private apiUrl = environment.API_URL; // Replace with your API URL

    constructor(private http: HttpClient) {}

    // Fetch all sticky-notes
    getStickyNotes(): Observable<IStickyNote[]> {
        return this.http.get<IStickyNote[]>(`${this.apiUrl}/sticky-notes`);
    }

    // Fetch a single sticky note by ID
    getStickyNoteById(stickyNoteId: String): Observable<IStickyNote> {
        return this.http.get<IStickyNote>(`${this.apiUrl}/sticky-notes/${stickyNoteId}`);
    }

    // Create a new sticky note
    createStickyNote(stickyNoteData: IStickyNote): Observable<IStickyNote> {
        return this.http.post<IStickyNote>(`${this.apiUrl}/sticky-notes`, stickyNoteData);
    }

    // Update an existing sticky note
    updateStickyNoteById(stickyNoteId: String, stickyNoteData: IStickyNote): Observable<IStickyNote> {
        return this.http.put<IStickyNote>(`${this.apiUrl}/sticky-notes/${stickyNoteId}`, stickyNoteData);
    }

    // Patch an existing sticky note
    patchStickyNote(stickyNoteId: String, partialStickyNoteData: Partial<IStickyNote>): Observable<IStickyNote> {
        return this.http.patch<IStickyNote>(`${this.apiUrl}/sticky-notes/${stickyNoteId}`, partialStickyNoteData);
    }

    // Delete a sticky note
    deleteStickyNote(stickyNoteId: String): Observable<IStickyNote> {
        return this.http.delete<IStickyNote>(`${this.apiUrl}/sticky-notes/${stickyNoteId}`);
    }
}