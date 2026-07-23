import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id?: number;
  title: string;
  options: string[];
  correctOptionIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/quiz';

  // Auth State
  private authToken: string | null = null;
  public isAdminLoggedIn = false;

  // Temporary container to test credentials before finalizing login state
  createAuthToken(username: string, password: string): string {
    return 'Basic ' + btoa(`${username}:${password}`);
  }

  setCredentials(token: string) {
    this.authToken = token;
    this.isAdminLoggedIn = true;
  }

  logout() {
    this.authToken = null;
    this.isAdminLoggedIn = false;
  }

  // Helper to generate dynamic custom headers
  getHeadersWithToken(token: string) {
    return {
      headers: new HttpHeaders({ 'Authorization': token })
    };
  }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.authToken || ''
      })
    };
  }

  // ADDED: Calls our new backend endpoint to verify credentials against the database parameters
  verifyAdminCredentials(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, {}, this.getHeadersWithToken(token));
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  // Attached authentication headers to write operations
  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question, this.getAuthHeaders());
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
