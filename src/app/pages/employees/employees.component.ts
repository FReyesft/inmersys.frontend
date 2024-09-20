import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { EmployeesService } from './employees.service';
import { Employee } from '../../interfaces/getAllUsersResponse.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Validators } from '@angular/forms';
import { CreateUserRequest } from '../../interfaces/createUserRequest.interface';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'last-name',
    'update',
    'delete',
  ];

  public employees: Employee[] = [];
  public isCreating: boolean = false;

  public newUserForm;
  public isLoading: boolean = false;
  employeeToEdit: Employee | null = null;
  //* Form for create user

  constructor(
    private employeesService: EmployeesService,
    private formBuilder: FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.employeesService.getAllEmployees().subscribe({
      next: (response) => {
        if (!response.error.isError) {
          this.employees = response.employees;
        } else {
          alert(response.error.message);
        }
      },
      error: (error) => {
        alert('Ocurrio un error obteniendo los usuarios');
      },
    });
  }

  deleteEmployee(id: number) {
    this.isLoading = true;
    this.employeesService.deleteEmployee(id).subscribe({
      next: (response) => {
        if (!response.error.isError) {
          this.getUsers();
        } else {
          alert(response.error.message);
        }
      },
      error: () => {
        alert('Ocurrio un error eliminando el usuario');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updateEmployee(employee: Employee) {
    this.isLoading = true;
    this.isCreating = true;
    this.employeesService.getEmployeeById(employee.employeeId).subscribe({
      next: (response) => {
        if (!response.error.isError) {
          this.newUserForm.patchValue({
            name: response.name,
            lastName: response.lastName,
          });
          this.employeeToEdit = response;
        } else {
          alert(response.error.message);
        }
      },
      error: () => {
        alert('Ocurrio un error inesperado');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  addEmployee() {
    this.employeeToEdit = null;
    this.isCreating = !this.isCreating;
  }

  confirmAddEmployee() {
    if (!this.newUserForm.valid) return;
    this.isLoading = true;
    let request: CreateUserRequest = {
      name: this.newUserForm.value.name || '',
      lastName: this.newUserForm.value.lastName || '',
    };
    if (!this.employeeToEdit) {
      this.employeesService.createEmployee(request).subscribe({
        next: (response) => {
          if (!response.error.isError) {
            this.getUsers();
            this.newUserForm.reset();
            this.isCreating = false;
          } else {
            alert(response.error.message);
          }
        },
        error: () => {
          alert('Ocurrio un error creando el usuario');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else if (this.employeeToEdit) {
      this.employeesService.updateEmployee(this.employeeToEdit.employeeId, request).subscribe({
        next: (response) => {
          if (!response.error.isError) {
            this.getUsers();
            this.isCreating = false;
            this.newUserForm.reset();
          } else {
            alert(response.error.message);
          }
        },
        error: () => {
          alert('Ocurrio un error creando el usuario');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
