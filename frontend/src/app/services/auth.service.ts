import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';

interface UserContext {
  userName: string;
  role: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = `${environment.apiUrl}/auth`;
  private userData: UserContext | null = null;
  $user = signal(this.userData);

  constructor(private http: HttpClient) {}

  get user() {
    return this.userData;
  }

  set user(value: UserContext | null) {
    this.userData = value;
    this.$user.set(value);
  }

  login(credentials: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/login`, credentials, {
      observe: 'response',
    });
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  signup(user: any) {
    return this.http.post(`${this.url}/signup`, user, { observe: 'response' });
  }

  recoverPassword(email: string) {
    return this.http.post(`${this.url}/recover-password`, { email });
  }

  refreshToken() {
    return this.http.post(`${this.url}/refresh`, {});
  }

  validateToken(token: string): Observable<{ role: string }> {
    return this.http.post<any>(`${this.url}/refresh`, { token }).pipe(
      map((data) => {
        localStorage.setItem('access_token', data.access_token);
        this.user = data;
        return { role: data.role };
      })
    );
  }
}
