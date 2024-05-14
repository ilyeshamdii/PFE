import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbscencsService {
  private baseUrl = 'http://localhost:8080/api/CongerMaladie';

  constructor(private http: HttpClient) { }
  submitLeaveRequest(formData: FormData, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Include headers in the request options
    const requestOptions = {
      headers: headers
    };

    return this.http.post(`${this.baseUrl}/submit`, formData, requestOptions);
  }

  
}
