#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod server;

use std::net::TcpStream;
use std::sync::Arc;
use std::time::Duration;
use tauri::Manager;

fn wait_for_server() -> bool {
    for _ in 0..30 {
        std::thread::sleep(Duration::from_millis(300));
        if TcpStream::connect_timeout(
            &"127.0.0.1:4173".parse().unwrap(),
            Duration::from_millis(200),
        ).is_ok() { return true; }
    }
    false
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            if TcpStream::connect_timeout(&"127.0.0.1:4173".parse().unwrap(), Duration::from_millis(100)).is_ok() {
                return Ok(());
            }
            let resource_dir = app.path().resource_dir().expect("resource dir");
            let data_dir = app.path().app_data_dir().unwrap_or_else(|_| resource_dir.clone());
            let state = Arc::new(server::AppState { data_dir: data_dir.clone(), resource_dir });
            let router = server::router(state);
            std::thread::spawn(move || {
                let rt = tokio::runtime::Runtime::new().expect("tokio");
                rt.block_on(async {
                    let listener = tokio::net::TcpListener::bind("127.0.0.1:4173").await.expect("bind");
                    axum::serve(listener, router).await.expect("serve");
                });
            });
            wait_for_server();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("run");
}
