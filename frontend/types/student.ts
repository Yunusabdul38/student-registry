export interface Student {
  id?: number;
  student_id: string; // Unique student identifier
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  gender: Gender;
  email: string;
  program: Program;
  student_status: StudentStatus;
  created_at?: string;
  updated_at?: string;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Program {
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  ENGINEERING = "ENGINEERING",
  BUSINESS = "BUSINESS",
  MEDICINE = "MEDICINE",
  LAW = "LAW",
  ARTS = "ARTS",
  SCIENCE = "SCIENCE",
}

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  GRADUATED = "GRADUATED",
  SUSPENDED = "SUSPENDED",
  TRANSFERRED = "TRANSFERRED",
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  dob: string;
  gender: Gender;
  email: string;
  program: Program;
  student_status?: StudentStatus;
}

export interface UpdateStudentRequest extends CreateStudentRequest {
  id: number;
  student_id: string;
}

export interface StudentFilters {
  program?: Program;
  gender?: Gender;
  status?: StudentStatus;
  search?: string;
}
