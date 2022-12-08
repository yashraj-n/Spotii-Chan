#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use commands::{download::cmd_download, search_yt_url::cmd_search_yt_urls};
use rspotify::AuthCodeSpotify;
use std::{path::Path, process::Command};
use tauri::Window;
use utils::{
    config_file,
    download_binary::{self, check_ytdl_exists},
};
// * Having a mutable Global Spotify Variable so that after login we can use it in other functions
static mut GLBOAL_SPOTIFY: Option<AuthCodeSpotify> = None;

mod commands;
mod utils;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_init,       // Initiliazing the app
            search_song,      // Searching Song from query
            get_yt_url,       //Getting Youtube URL from query
            reauth,           // Authenticating with Client ID and secret
            download_yt_url,  // Downloading Youtube Videoo
            logout,           //Logging Out
            get_usr_data,     // Get user data
            open_folder,      // Open Folder
            from_spotify_uri  // Get Song Details from Spotify URI
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// Searches Song
#[tauri::command]
async fn search_song(query: String) -> String {
    let spotify = unsafe { GLBOAL_SPOTIFY.clone().unwrap() };
    let result = commands::search_song::cmd_search_song(spotify, query).await;
    result
}
// Logs out
#[tauri::command]
async fn logout() -> String {
    unsafe {
        GLBOAL_SPOTIFY = None;
    }
    commands::logout::cmd_logout();
    "".into()
}
// Downloads Youtube Video from URL
#[tauri::command]
async fn download_yt_url(
    url: String,
    song_img: String,
    song_title: String,
    song_artist: String,
    location: String,
    window: Window,
) -> String {
    cmd_download(url, window, song_title, song_img, song_artist, location);

    "".into()
}
//Getting Song Details from Youtube URL
#[tauri::command]
async fn get_yt_url(query: String) -> String {
    cmd_search_yt_urls(query).await
}
//* Init function, whenever app starts, this will run
#[tauri::command]
async fn start_init(window: Window) -> String {
    //If yt.exe or yt doesnt exists in ~/.spotii, it'll download it
    if !check_ytdl_exists() {
        download_binary::DownloadLatestYTDL().await;
        println!("Downloaded YTDL");
    } else {
        println!("YTDL Exists");
    }
    //Validating config file
    let f = config_file::is_config_file_valid().await;
    if f {
        let creds = config_file::get_creds();

        let spotify = commands::init::with_refresh_token(creds.0, creds.1, creds.2).await;
        unsafe {
            GLBOAL_SPOTIFY = Some(spotify);
        }
        String::from("OK")
    } else {
        // If config file is not valid, it'll open login window
        String::from("LOGIN_REQ")
    }
}

//Getting Logged in user data
#[tauri::command]
async fn get_usr_data() -> String {
    let spotify = unsafe { GLBOAL_SPOTIFY.clone().unwrap() };
    let usrdata = commands::init::get_usr_data(spotify).await;
    usrdata
}

// Authenticating with Client ID and secret
#[tauri::command]
async fn reauth(id: String, secret: String) -> String {
    //Checking if creds are valid
    let f = config_file::check_valid_oauth_creds(&id, &secret).await;
    if f {
        let spotify = commands::init::cmd_init(id, secret).await;
        // Make Spotify globally availible and pass it to checking_mut without giving params
        unsafe {
            GLBOAL_SPOTIFY = Some(spotify);
        }

        String::from("OK")
    } else {
        String::from("INVALID_CREDS")
    }
}
// Opening Folder
#[tauri::command]
fn open_folder(path: String) {
    let file_path = Path::new(&path);
    //extract folder path
    let mut folder = file_path.parent().unwrap().to_str().unwrap();
    //Remove trailing slash
    if folder.ends_with("\\") || folder.ends_with("/") {
        folder = &folder[..folder.len() - 1];
    }
    println!("{}", folder);
    #[cfg(target_os = "windows")]
    Command::new("explorer")
        .arg(&folder)
        .spawn()
        .expect("Failed to open folder");

    #[cfg(target_os = "macos")]
    Command::new("open")
        .args(["-R", folder.to_str().unwrap()])
        .spawn()
        .unwrap();

    #[cfg(target_os = "linux")]
    Command::new("xdg-open")
        .arg(folder.to_str().unwrap())
        .spawn()
        .unwrap();
}

// Getting Song Details from Spotify URI
#[tauri::command]
async fn from_spotify_uri(query: String) -> String {
    let spotify = unsafe { GLBOAL_SPOTIFY.clone().unwrap() };
    let result = commands::search_song::cmd_spotify_search_song(spotify, query).await;
    result
}
