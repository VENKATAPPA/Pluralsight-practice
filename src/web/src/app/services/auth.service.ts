import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'jwt_token';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  register(userName: string, email: string, password: string, displayName?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      userName,
      email,
      password,
      displayName
    });
  }

  login(userNameOrEmail: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      userName: userNameOrEmail,
      password
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  loadCurrentUser(): void {
    // This would typically call a /users/me endpoint
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = this.parseJwt(token);
        this.currentUserSubject.next({
          id: decoded.sub,
          userName: decoded.unique_name,
          displayName: decoded.displayName
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
