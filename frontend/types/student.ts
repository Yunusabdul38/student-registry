export interface Student {
  student_id: string;
  data: {
    first_name: string;
    last_name: string;
    dob: {
      day: number;
      month: "Jenuary " |
      "February" |
      "March" |
      "April" |
      "May" |
      "June" |
      "July" |
      "August" |
      "September" |
      "October" |
      "November" |
      "December" ;
      year: number;
    };
    gender: string;
    email: string;
    program: string;
  };
  status: "Active" | "Expelled" | "Graduated";
  created_at: string;
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export enum Program {
  Mathematics = "Mathematics",
  History = "History",
  Economics = "Economics",
  Literature = "Literature",
  Physics = "Physics",
  Biochemistry = "Biochemistry",
  ComputerScience = "Computer Science",
  Architecture = "Architecture",
}

export enum StudentStatus {
  Active="Active",
  Expelled = "Expelled",
  Graduated = "Graduated",
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
