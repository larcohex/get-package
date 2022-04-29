import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://mock-stg.getpackage-dev.com';

  constructor(private http: HttpClient) {}

  login(data: {
    email: string;
    password: string;
  }): Observable<{ res?: string; token?: string }> {
    return this.http.post<{ res: string }>(`${this.baseUrl}/login`, data);
  }
}
