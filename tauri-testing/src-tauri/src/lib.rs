use rand::Rng;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn generate_random_numbers() -> Vec<i32> {
    let mut rng = rand::thread_rng();
    (0..2).map(|_| rng.gen_range(0..100)).collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, generate_random_numbers])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
