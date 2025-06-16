use std::{collections::HashMap, sync::Arc};

use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Mutex<StudentDb>>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct StudentDb {
    // #[serde(borrow)]
    pub students: HashMap<Uuid, StudentData>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct StudentData {
    pub student_id: Uuid,
    // #[serde(borrow)]
    pub data: Student,
    pub status: StudentStatus,
    pub created_at: DateTime<Local>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Student {
    pub first_name: String,
    pub last_name: String,
    pub dob: Dob,
    pub gender: Gender,
    pub email: String,
    pub program: Program,
}
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Dob {
    pub day: u16,
    pub month: Month,
    pub year: u32,
}
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Month {
    Jenuary,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Clone)]
pub enum Gender {
    Male,
    Female,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Clone)]
pub enum Program {
    Mathematics,
    History,
    Economics,
    Literature,
    Physics,
    Biochemistry,
    ComputerScience,
    Architecture,
}

#[derive(Debug, Deserialize, Serialize, PartialEq, Clone)]
pub enum StudentStatus {
    Active,
    Expelled,
    Graduated,
}
