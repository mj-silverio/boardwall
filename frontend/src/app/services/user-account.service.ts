import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { IUserAccount } from '../models/user-account.model';


@Injectable({
    providedIn: 'root'
})
export class UserAccountService {
    private apiUrl = environment.API_URL; // Replace with your API URL

    constructor(private http: HttpClient) {}

    // Fetch all user-accounts
    getUserAccounts(): Observable<IUserAccount[]> {
        return this.http.get<IUserAccount[]>(`${this.apiUrl}/user-accounts`);
    }

    // Fetch a single user account by ID
    getUserAccountById(userAccountId: Number): Observable<IUserAccount> {
        return this.http.get<IUserAccount>(`${this.apiUrl}/user-accounts/${userAccountId}`);
    }

    // Create a new user account
    createUserAccount(userAccountData: IUserAccount): Observable<IUserAccount> {
        return this.http.post<IUserAccount>(`${this.apiUrl}/user-accounts`, userAccountData);
    }

    // Update an existing user account
    updateUserAccount(userAccountId: Number, userAccountData: IUserAccount): Observable<IUserAccount> {
        return this.http.put<IUserAccount>(`${this.apiUrl}/user-accounts/${userAccountId}`, userAccountData);
    }

    // Delete a user account
    deleteUserAccount(userAccountId: Number): Observable<IUserAccount> {
        return this.http.delete<IUserAccount>(`${this.apiUrl}/user-accounts/${userAccountId}`);
    }
}