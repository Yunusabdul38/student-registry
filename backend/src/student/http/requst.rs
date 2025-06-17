use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use chrono::Local;
use uuid::Uuid;

use crate::student::types::{
    student_type::{AppState, Student, StudentData, StudentStatus},
    util_req::{
        GetGender, GetProgram, GetStatus, GetStudent, Response, UpdateStatusPayload,
        UpdateStudentPayload,
    },
};

pub async fn new() -> (StatusCode, Json<&'static str>) {
    (StatusCode::OK, Json("WELCOME TO INDIGO"))
}

// =============== create req =============

pub async fn add_student(
    State(state): State<AppState>,
    Json(student): Json<Student>,
) -> Result<(StatusCode, Json<&'static str>), (StatusCode, Json<Response>)> {
    let student_id = Uuid::new_v4();
    let mut db = state.db.lock().await;
    // db.students.insert(student.id.clone(), student);
    let user = db
        .students
        .iter()
        .find(|user| user.1.data.email == student.email);


        if user.is_some() {
            let err = format!("USER WITH EMAIL {} exit", student.email);
            let message = Response {
                message: err.clone(),
            };
            return Err((StatusCode::BAD_GATEWAY, Json(message)));
        }
    

    let student: StudentData = StudentData {
        student_id,
        data: Student {
            dob: student.dob,
            email: student.email,
            first_name: student.first_name,
            gender: student.gender,
            program: student.program,
            last_name: student.last_name,
        },
        created_at: Local::now(),
        status: StudentStatus::Active,
    };
    db.students.insert(student_id, student);
    Ok((StatusCode::OK, Json("STUDENT ADDED SUCCESFULLY")))
}

// =============== update req =============

pub async fn update_student(
    State(state): State<AppState>,
    Json(student): Json<UpdateStudentPayload>,
) -> Result<(StatusCode, Json<Response>), (StatusCode, Json<Response>)> {
    let mut db = state.db.lock().await;
    let student_data = db.students.get_mut(&student.student_id);
    match student_data {
        Some(data) => {
            data.data.dob = student.student_data.dob;
            data.data.email = student.student_data.email;
            data.data.gender = student.student_data.gender;
            data.data.last_name = student.student_data.last_name;
            data.data.program = student.student_data.program;
            let response = Response {
                message: "STUDENT DATA UPDATED SUCCESFULLY".to_string(),
            };
            Ok((StatusCode::OK, Json(response)))
        }
        None => {
            let response = Response {
                message: "STUDENT NOT FOUND".to_string(),
            };
            Ok((StatusCode::NOT_FOUND, Json(response)))
        }
    }
}

pub async fn update_student_status(
    State(state): State<AppState>,
    Json(student): Json<UpdateStatusPayload>,
) -> Result<(StatusCode, Json<Response>), (StatusCode, Json<Response>)> {
    let mut db = state.db.lock().await;
    let db = db.students.get_mut(&student.student_id);

    match db {
        Some(data) => {
            data.status = student.status;
            let response = Response {
                message: "STUDENT DATA UPDATED SUCCESFULLY".to_string(),
            };
            Ok((StatusCode::OK, Json(response)))
        }
        None => {
            let response = Response {
                message: "STUDENT NOT FOUND".to_string(),
            };
            Ok((StatusCode::NOT_FOUND, Json(response)))
        }
    }
}

// =============== delete req =============

pub async fn delete_student(
    State(state): State<AppState>,
    Json(student_id): Json<Uuid>,
) -> Result<(StatusCode, Json<Response>), (StatusCode, Json<Response>)> {
    let mut student = state.db.lock().await;
    let exist = student.students.contains_key(&student_id);

    if exist {
        student.students.remove(&student_id);
        let response = Response {
            message: "STUDENT DATA DELETED".to_string(),
        };
        return Ok((StatusCode::OK, Json(response)));
    }

    let response = Response {
        message: "STUDENT NOT FOUND".to_string(),
    };
    Err((StatusCode::NOT_FOUND, Json(response)))
}

// =============== Read req =============

pub async fn get_student_status(
    State(state): State<AppState>,
    Query(status): Query<GetStatus>,
) -> Json<Vec<StudentData>> {
    // let user = self
    //     .students
    //     .iter()
    //     .filter(|user| user.1.data.program == program);
    let student = state.db.lock().await;
    let mut users: Vec<StudentData> = Vec::new();
    for (_, val) in student.students.iter() {
        if val.status == status.status {
            users.push(val.clone());
        }
    }

    Json(users)
}

pub async fn get_student_by_id(
    State(state): State<AppState>,
    Query(student_id): Query<GetStudent>,
) -> Result<(StatusCode, Json<StudentData>), (StatusCode, Json<Response>)> {
    let db = state.db.lock().await;
    let student = db.students.get(&student_id.id);

    match student {
        Some(user) => {
            // let m = format!("user with email {} exit", student.email).as_str();
            Ok((StatusCode::OK, Json(user.clone())))
        }
        None => {
            let response = Response {
                message: "USER DOES NOT EXIST".to_string(),
            };
            Err((StatusCode::NOT_FOUND, Json(response)))
        }
    }
}

pub async fn get_student_by_program(
    State(state): State<AppState>,
    Query(program): Query<GetProgram>,
) -> Json<Vec<StudentData>> {
    let mut users: Vec<StudentData> = Vec::new();
    let db = state.db.lock().await;
    for (_, val) in db.students.iter() {
        if val.data.program == program.program {
            users.push(val.clone());
        }
    }

    Json(users)
}

pub async fn get_student_by_gender(
    State(state): State<AppState>,
    Query(gender): Query<GetGender>,
) -> Json<Vec<StudentData>> {
    let mut users: Vec<StudentData> = Vec::new();
    let db = state.db.lock().await;
    for (_, val) in db.students.iter() {
        if val.data.gender == gender.gender {
            users.push(val.clone());
        }
    }

    Json(users)
}

pub async fn get_all_students(State(state): State<AppState>) -> Json<Vec<StudentData>> {
    let mut users: Vec<StudentData> = Vec::new();

    let db = state.db.lock().await;

    for (_, val) in db.students.iter() {
        users.push(val.clone());
    }

    Json(users)
}
