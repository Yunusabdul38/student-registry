use axum::{
    Router,
    routing::{delete, get, patch, post},
};
use std::{collections::HashMap, net::Ipv6Addr, os::unix::net::SocketAddr, sync::Arc};
use tokio::sync::Mutex;
use tower_http::{cors::{Any, CorsLayer}};

use crate::{config::{Configuration, Db}, student::{
    http::requst::{
        add_student, delete_student, get_all_students, get_student_by_gender, get_student_by_id,
        get_student_by_program, get_student_status, new, update_student, update_student_status,
    },
    types::student_type::{AppState, StudentDb},
}};
mod student;
mod telementry;
mod config;
// use tracing_subscriber;

#[tokio::main]
async fn main() {
    // read env 
    dotenvy::dotenv().ok();
    // to set cors 
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);
    // initialize tracing
    // tracing_subscriber::fmt::init();
    telementry::setup_tracing();
    // let state = StudentDb {
    //     students: HashMap::new(),
    // };
    // App configuration.
    tracing::debug!("Initializing configuration");
    let config = Configuration::new();
        // Initialize DB connection.
        tracing::debug!("Initializing DB pool");
        let db = Db::new(&config.db_str, config.db_pool_max_size)
            .await
            .expect("Failed to initialize DB");
    println!("database {:?}",db);
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
        // .layer(cors.clone())
        .route("/get-student-by-id", get(get_student_by_id))
        // .layer(cors.clone())
        .route("/get-student-by-program", get(get_student_by_program))
        // .layer(cors.clone())
        .route("/get-student-by-status", get(get_student_status))
        // .layer(cors.clone())
        .route("/get-student-by-gender", get(get_student_by_gender))
        // .layer(cors.clone())
        // `POST /student` goes to `add_student`
        .route("/add-student", post(add_student))
        // .layer(cors.clone())
        // `patch /student` goes to `update_stident data`
        .route("/update-student", patch(update_student))
        // .layer(cors.clone())
        .route("/update-status", patch(update_student_status))
        // .layer(cors.clone())
        // `DELETE /student` goes to `delete_student`
        .route("/delete", delete(delete_student))
        .layer(cors)
        // .layer(TraceLayer::new_for_http())
        .with_state(state);
      // 0.0.0.0 + Port to support containerisation.
    //   let listen_address = SocketAddr::from((Ipv6Addr::UNSPECIFIED));

    // run our app with hyper, listening globally on port 2005
     // Listen for requests on specified port.
     tracing::info!("Starting server on 78");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:9090").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
