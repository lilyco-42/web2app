use axum::{body::Body, extract::State, http::{header, StatusCode}, response::Response, Router};
use include_dir::{include_dir, Dir};
use std::path::PathBuf;
use std::sync::Arc;

static WEB_DIR: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/../web");

#[derive(Debug, Clone)]
pub struct AppState {
    pub data_dir: PathBuf,
    pub resource_dir: PathBuf,
}

pub fn router(state: Arc<AppState>) -> Router {
    Router::new().fallback(serve_any).with_state(state)
}

async fn serve_any(State(_): State<Arc<AppState>>, req: axum::http::Request<Body>) -> Response {
    let path = req.uri().path().trim_start_matches('/');
    let path = if path.is_empty() { "index.html" } else { path };

    if let Some(file) = WEB_DIR.get_file(path) {
        let mime = mime_guess::from_path(path).first_or_octet_stream().to_string();
        return Response::builder().status(StatusCode::OK)
            .header(header::CONTENT_TYPE, mime)
            .header(header::CACHE_CONTROL, "no-store")
            .body(Body::from(file.contents().to_vec())).unwrap();
    }
    if let Some(index) = WEB_DIR.get_file("index.html") {
        return Response::builder().status(StatusCode::OK)
            .header(header::CONTENT_TYPE, "text/html; charset=utf-8")
            .body(Body::from(index.contents().to_vec())).unwrap();
    }
    Response::builder().status(StatusCode::NOT_FOUND)
        .header(header::CONTENT_TYPE, "text/plain")
        .body(Body::from("404")).unwrap()
}
