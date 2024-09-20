import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { GetAllUsersResponse } from '../../interfaces/getAllUsersResponse.interface';
import { Observable } from 'rxjs';
import { CreateUserRequest } from '../../interfaces/createUserRequest.interface';
import { EmployeeResponse } from '../../interfaces/employeeResponse.interface';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly apiUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<GetAllUsersResponse> {
    return this.http.get<GetAllUsersResponse>(`${this.apiUrl}/employees`);
  }

  createEmployee(request: CreateUserRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(
      `${this.apiUrl}/employees`,
      request
    );
  }

  deleteEmployee(employeeId: number): Observable<EmployeeResponse> {
    return this.http.delete<EmployeeResponse>(
      `${this.apiUrl}/employees/${employeeId}`
    );
  }

  getEmployeeById(employeeId: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(
      `${this.apiUrl}/employees/${employeeId}`
    );
  }

  updateEmployee(employeeId: number, request: CreateUserRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(
      `${this.apiUrl}/employees/${employeeId}`, request
    );
  }
}
