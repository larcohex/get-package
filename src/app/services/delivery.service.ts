import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { City } from '../types/city';
import { Time } from '../types/time';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'https://mock-stg.getpackage-dev.com';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/cities`);
  }

  getTimes(): Observable<Time[]> {
    return this.http.get<Time[]>(`${this.baseUrl}/times`);
  }

  createDelivery(data: any) {
    return this.http.post<any>(`${this.baseUrl}/submit`, {
      ...data,
      token: this.cookieService.get('get-package-auth'),
    });
  }
}
