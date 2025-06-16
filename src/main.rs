use axum::{
    Router,
    routing::{delete, get, patch, post},
};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;

use crate::student::{
    http::requst::{
        add_student, delete_student, get_all_students, get_student_by_gender, get_student_by_id,
        get_student_by_program, get_student_status, new, update_student, update_student_status,
    },
    types::student_type::{AppState, StudentDb},
};
mod student;

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();
    // let state = StudentDb {
    //     students: HashMap::new(),
    // };
    let state = AppState {
        db: Arc::new(Mutex::new(StudentDb {
            students: HashMap::new(),
        })),
    };
    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(new))
        .route("/get-all-students", get(get_all_students))
        .route("/get-student-by-id", get(get_student_by_id))
        .route("/get-student-by-program", get(get_student_by_program))
        .route("/get-student-by-status", get(get_student_status))
        .route("/get-student-by-gender", get(get_student_by_gender))
        // `POST /student` goes to `add_student`
        .route("/add-student", post(add_student))
        // `patch /student` goes to `update_stident data`
        .route("/update-student", patch(update_student))
        .route("/update-status", patch(update_student_status))
        // `DELETE /student` goes to `delete_student`
        .route("/delete", delete(delete_student))
        .with_state(state);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:2005").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
