use chrono::{DateTime, Local};
use std::collections::HashMap;
use uuid::Uuid;

pub struct StudentDb<'a> {
    pub students: HashMap<Uuid, StudentData<'a>>,
}

pub struct StudentData<'a> {
    pub student_id: Uuid,
    pub data: Student<'a>,
    pub status: StudentStatus,
    pub created_at: DateTime<Local>,
}

pub struct Student<'a> {
    pub fist_name: &'a str,
    pub last_name: &'a str,
    pub dob: Dob,
    pub gender: Gender,
    pub email: &'a str,
    pub program: Program,
}

pub struct Dob {
    pub day: u16,
    pub month: Month,
    pub year: u32,
}

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

#[derive(Debug, PartialEq)]
pub enum Gender {
    Male,
    Female,
}

#[derive(Debug, PartialEq)]
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

#[derive(Debug, PartialEq)]
pub enum StudentStatus {
    Active,
    Expelled,
    Graduated,
}
