import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { ICategory } from '../models/category.model';


@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = environment.API_URL; // Replace with your API URL

    constructor(private http: HttpClient) {}

    // Fetch all categories
    getCategories(): Observable<ICategory[]> {
        return this.http.get<ICategory[]>(`${this.apiUrl}/categories`);
    }

    // Fetch a single category by ID
    getCategoryById(categoryId: Number): Observable<ICategory> {
        return this.http.get<ICategory>(`${this.apiUrl}/categories/${categoryId}`);
    }

    // Create a new category
    createCategory(categoryData: ICategory): Observable<ICategory> {
        return this.http.post<ICategory>(`${this.apiUrl}/categories`, categoryData);
    }

    // Update an existing category
    updateCategory(categoryId: Number, categoryData: ICategory): Observable<ICategory> {
        return this.http.put<ICategory>(`${this.apiUrl}/categories/${categoryId}`, categoryData);
    }

    // Delete a category
    deleteCategory(categoryId: Number): Observable<ICategory> {
        return this.http.delete<ICategory>(`${this.apiUrl}/categories/${categoryId}`);
    }
}