import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { EmployeeDTO } from '../Models/EmployeeDTO';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:7135/api/employee'; 

  constructor(private http: HttpClient) {}

createEmployee(empployee: EmployeeDTO): Observable<any> {
    return this.http.post(this.apiUrl, empployee);
  }

updateEmployee(employee: EmployeeDTO): Observable<any> {
  return this.http.put(this.apiUrl, employee, {
    headers: { 'Content-Type': 'application/json' }
  });
}


deleteEmployee(idClient: number, id: number): Observable<any> {
  const url = `${this.apiUrl}/${idClient}/${id}`;
  return this.http.patch(url, null, {
  });
}


getAllEmployees(idClient: number): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/?idClient=${idClient}`)
      .pipe(
        catchError(this.handleError)
      );
  }

 getEmployeeById(idClient: number, id: number): Observable<any> {
  const params = new HttpParams()
  .set('Idclient', idClient.toString())
  .set('id', id.toString());

  return this.http.get<EmployeeDTO>(`${this.apiUrl}/getemployeebyid`, { params })
    .pipe(
      catchError(this.handleError)
    );
}


getEmployeeImage(idClient: number, id: number): Observable<Blob> {
  const params = new HttpParams()
    .set('Idclient', idClient.toString())
    .set('id', id.toString());

  return this.http.get(`${this.apiUrl}/employeeimage`, {
    params,
    responseType: 'blob'
  }).pipe(
    catchError(this.handleError)
  );
}
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

}
