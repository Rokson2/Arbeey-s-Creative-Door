use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use std::time::Duration;
use std::thread;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Get the resource directory path
            let resource_dir = app.path().resource_dir().expect("failed to get resource dir");
            let server_script = resource_dir.join("binaries").join("server");
            
            println!("Server script path: {:?}", server_script);
            
            // Start the Next.js server using shell command
            let shell = app.shell();
            
            let (_rx, _child) = shell
                .command("bash")
                .args([server_script.to_str().unwrap()])
                .spawn()
                .expect("Failed to spawn server");
            
            // Wait for server to be ready
            let client = reqwest::blocking::Client::builder()
                .timeout(Duration::from_secs(2))
                .build()
                .expect("Failed to create HTTP client");
                
            let mut ready = false;
            println!("Waiting for server to start...");
            
            for i in 0..30 {  // Try for 30 seconds
                thread::sleep(Duration::from_secs(1));
                match client.get("http://localhost:3000").send() {
                    Ok(_) => {
                        ready = true;
                        println!("Server is ready!");
                        break;
                    }
                    Err(e) => {
                        println!("Attempt {}: Server not ready yet ({})", i + 1, e);
                    }
                }
            }
            
            if !ready {
                eprintln!("Warning: Server failed to start within 30 seconds");
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
