import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient, private router:Router) { }

  doLogin(congregation: any) {
    localStorage.setItem('congregation', JSON.stringify(congregation));
  }

  doLogout() {
    localStorage.removeItem('congregation');
    this.router.navigate(['/login']);
  }

  getSignatureZoom(meetingID: string, role: number = 0, idWeb: number = 0): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { meetingNumber: meetingID, role, idWeb })
  }
}
