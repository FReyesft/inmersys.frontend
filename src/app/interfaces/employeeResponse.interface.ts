export interface EmployeeResponse {
  error:      Error;
  employeeId: number;
  name:       string;
  lastName:   string;
  createdAt:  CreatedAt;
}

export interface CreatedAt {
  year:      number;
  month:     number;
  day:       number;
  dayOfWeek: number;
  dayOfYear: number;
  dayNumber: number;
}

export interface Error {
  isError: boolean;
  message: string;
}
