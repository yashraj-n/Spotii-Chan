use home;
use rspotify::{prelude::*, scopes, AuthCodeSpotify, Credentials, OAuth, Token};
use std::fs;
use std::path::Path;

pub async fn is_config_file_valid() -> bool {
    // Looks for file in ~/spotii/creds.uwu
    let home_dir = home::home_dir().unwrap().to_str().unwrap().to_string();
    let path = Path::new(&home_dir).join(".spotii").join("creds.uwu");
    if path.exists() {
        // Checks if file is valid
        let file = fs::read_to_string(path).unwrap();
        // Splits the file into lines
        let lines = file.lines().collect::<Vec<&str>>();
        // Checks if the file has 3 lines
        if lines.len() == 3 {
            // Checks if the creds are valid
            let f = check_creds().await;
            f
        } else {
            false
        }
    } else {
        false
    }
}

// Checks if the creds are valid
async fn check_creds() -> bool {
    // Getting the creds from the file
    let home_dir = home::home_dir().unwrap().to_str().unwrap().to_string();
    let path = Path::new(&home_dir).join(".spotii").join("creds.uwu");
    let file = fs::read_to_string(path).unwrap();
    let lines = file.lines().collect::<Vec<&str>>();

    let id = lines[0];
    let secret = lines[1];
    let ref_token = lines[2];
    // validating by sending a request to spotify
    let creds = Credentials::new(id, secret);
    let oauth = OAuth {
        redirect_uri: "http://localhost:41010/".to_string(),
        scopes: scopes!("user-read-private user-read-email"),
        ..Default::default()
    };
    let spotify = AuthCodeSpotify::new(creds, oauth);
    let refreshed: Token = Token {
        refresh_token: Some(ref_token.to_string()),
        ..Default::default()
    };
    *spotify.get_token().lock().await.unwrap() = Some(refreshed.clone());
    let try_refresh = spotify.refresh_token();
    match try_refresh.await {
        // If the creds are valid, return true
        Ok(_) => true,
        Err(_) => false,
    }
}

pub async fn check_valid_oauth_creds(id: &str, secret: &str) -> bool {
    let creds = Credentials::new(id, secret);
    let oauth = OAuth {
        redirect_uri: "http://localhost:41010/".to_string(),
        scopes: scopes!("user-read-private user-read-email"),
        ..Default::default()
    };
    let spotify = AuthCodeSpotify::new(creds, oauth);
    spotify.get_authorize_url(false).is_ok()
}
// Gets the creds from the file
pub fn get_creds() -> (String, String, String) {
    let home_dir = home::home_dir().unwrap().to_str().unwrap().to_string();
    let path = Path::new(&home_dir).join(".spotii").join("creds.uwu");
    let file = fs::read_to_string(path).unwrap();
    let lines = file.lines().collect::<Vec<&str>>();

    let id = lines[0];
    let secret = lines[1];
    let ref_token = lines[2];

    (id.to_string(), secret.to_string(), ref_token.to_string())
}

// Saves the creds to the file
pub fn save_token(id: String, secret: String, ref_token: String) {
    let home_dir = home::home_dir().unwrap().to_str().unwrap().to_string();
    let path = Path::new(&home_dir).join(".spotii").join("creds.uwu");
    let contents = format!("{}\n{}\n{}", id, secret, ref_token);

    fs::write(path, contents).unwrap();
}

pub fn get_config_folder_location() -> String {
    Path::new(&home::home_dir().unwrap().to_str().unwrap().to_string())
        .join(".spotii")
        .to_str()
        .unwrap()
        .to_string()
}

pub fn get_config_file_location() -> String {
    Path::new(&home::home_dir().unwrap().to_str().unwrap().to_string())
        .join(".spotii")
        .join("creds.uwu")
        .to_str()
        .unwrap()
        .to_string()
}
