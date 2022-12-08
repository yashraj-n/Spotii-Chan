use super::config_file;
use std::{fs, io::Write, path::Path};
//* YT-dlp Downlaod links for Linux and Windows OS */
const YT_WINDOWS: &str = "https://github.com/yt-dlp/yt-dlp/releases/download/2022.11.11/yt-dlp.exe";
#[cfg(target_os = "linux")]
const YT_LINUX: &str = "https://github.com/yt-dlp/yt-dlp/releases/download/2022.11.11/yt-dlp_linux";

// Downloads the latest version of yt-dlp
pub async fn download_latest_ytdl() {
    // Gets the config folder location
    let config_path = config_file::get_config_folder_location();

    #[cfg(target_os = "windows")]
    // Windows
    {   // Sending a GET request to the YT-dlp download link
        let response = reqwest::get(YT_WINDOWS).await.unwrap();
        let mut bytes = response.bytes().await.unwrap();
        let mut file = fs::File::create(format!("{}\\yt.exe", config_path)).unwrap();
        // Writing the bytes to the file
        file.write_all(&mut bytes).unwrap();
    }
    #[cfg(target_os = "linux")]
    // Linux
    {
        let response = reqwest::get(YT_LINUX).await.unwrap();
        let mut bytes = response.bytes().await.unwrap();
        let mut file = fs::File::create(format!("{}/yt", config_path)).unwrap();
        file.write_all(&mut bytes).unwrap();
    }
}

// Checks if yt-dlp exists in the config folder
pub fn check_ytdl_exists() -> bool {
    let config_path = config_file::get_config_folder_location();
    #[cfg(target_os = "windows")]
    // Windows
    {
        if !Path::new(&format!("{}\\yt.exe", config_path)).exists() {
            false
        } else {
            true
        }
    }
    #[cfg(target_os = "linux")]
    // Linux
    {
        if !Path::new(&format!("{}/yt", config_path)).exists() {
            false
        } else {
            true
        }
    }
}
