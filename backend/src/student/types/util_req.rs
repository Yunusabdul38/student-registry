use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::student::types::student_type::{Gender, Program, Student, StudentStatus};

#[derive(Serialize)]
pub struct Response {
    pub message: String,
}

#[derive(Deserialize)]
pub struct UpdateStatusPayload {
    pub student_id: Uuid,
    pub status: StudentStatus,
}

#[derive(Deserialize)]
pub struct UpdateStudentPayload {
    pub student_id: Uuid,
    pub student_data: Student,
}

#[derive(Deserialize)]
pub struct GetProgram {
    pub program: Program,
}

#[derive(Deserialize)]
pub struct GetGender {
    pub gender: Gender,
}

#[derive(Deserialize)]
pub struct GetStudent {
    pub id: Uuid,
}

#[derive(Deserialize)]
pub struct GetStatus {
    pub status: StudentStatus,
}
