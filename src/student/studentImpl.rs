use std::collections::HashMap;

use super::student::{Gender, Program, Student, StudentData, StudentDb, StudentStatus};
use chrono::Local;
use uuid::Uuid;

impl<'a> StudentDb<'a> {
    pub fn new() {
        StudentDb {
            students: HashMap::new(),
        };
    }
    pub fn create_student(&mut self, student: Student<'a>) -> Result<&str, &str> {
        let student_id = Uuid::new_v4();
        let user = self
            .students
            .iter()
            .find(|user| user.1.data.email == student.email);

        match user {
            Some(_) => {
                // let m = format!("user with email {} exit", student.email).as_str();
                return Err("user with this email exist");
            }
            None => {}
        }

        let student: StudentData = StudentData {
            student_id,
            data: Student {
                dob: student.dob,
                email: student.email,
                fist_name: student.fist_name,
                gender: student.gender,
                program: student.program,
                last_name: student.last_name,
            },
            created_at: Local::now(),
            status: StudentStatus::Active,
        };
        self.students.insert(student_id, student);
        Ok("student added")
    }

    pub fn update_student(
        &mut self,
        student_id: Uuid,
        student_data: Student<'a>,
    ) -> Result<&str, &str> {
        let student = self.students.get_mut(&student_id);
        match student {
            Some(data) => {
                data.data.dob = student_data.dob;
                data.data.email = student_data.email;
                data.data.gender = student_data.gender;
                data.data.last_name = student_data.last_name;
                data.data.program = student_data.program;
                return Ok("student succesfully delete");
            }
            None => {
                return Err("student does not exist");
            },
        };
    }

    pub fn get_student_by_id(&mut self, student_id: Uuid) -> Result<&StudentData, &'a str> {
        let student = self.students.get(&student_id);

        match student {
            Some(user) => {
                // let m = format!("user with email {} exit", student.email).as_str();
                return Ok(user);
            }
            None => Err("student does not exist"),
        }
    }

    pub fn get_student_by_program(&mut self, program: Program) -> Vec<&StudentData> {
        let mut users: Vec<&StudentData> = Vec::new();
        for (_, val) in self.students.iter() {
            if val.data.program == program {
                users.push(val);
            }
        }

        users
    }

    pub fn get_student_by_gender(&mut self, gender: Gender) -> Vec<&StudentData> {
        // let user = self
        //     .students
        //     .iter()
        //     .filter(|user| user.1.data.gender == gender);

        let mut users: Vec<&StudentData> = Vec::new();
        for (_, val) in self.students.iter() {
            if val.data.gender == gender {
                users.push(val);
            }
        }

        users
    }

    pub fn get_student_Status(&mut self, status: StudentStatus) -> Vec<&StudentData> {
        // let user = self
        //     .students
        //     .iter()
        //     .filter(|user| user.1.data.program == program);

        let mut users: Vec<&StudentData> = Vec::new();
        for (_, val) in self.students.iter() {
            if val.status == status {
                users.push(val);
            }
        }

        users
    }

    pub fn delete_student(&mut self, student_id: Uuid) -> Result<&'a str, &'a str> {
        let student = self.students.get(&student_id);

        match student {
            Some(_) => {
                self.students.retain(|_, m| m.student_id != student_id);
                return Ok("student succesfully delete");
            }
            None => Err("student does not exist"),
        }
    }

    pub fn update_student_Status(
        &mut self,
        student_id: Uuid,
        status: StudentStatus,
    ) -> Result<&'a str, &'a str> {
        let student = self.students.get_mut(&student_id);

        match student {
            Some(data) => {
                data.status = status;
                return Ok("student succesfully updated");
            }
            None => Err("student does not exist"),
        }
    }
}
