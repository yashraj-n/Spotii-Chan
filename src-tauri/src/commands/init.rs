use rspotify::{prelude::*, scopes, AuthCodeSpotify, Credentials, OAuth, Token};
use serde::ser::{Serialize, SerializeStruct, Serializer};

use std::mem::drop;
use std::{
    io::{BufRead, BufReader, Write},
    net::{TcpListener, TcpStream},
};

use crate::utils::config_file::save_token;
use crate::utils::utility;

pub async fn cmd_init(id: String, secret: String) -> AuthCodeSpotify {

    let creds = Credentials::new(&id, &secret);
    let oauth = OAuth {
        redirect_uri: "http://localhost:41010/".to_string(),
        scopes: scopes!("user-read-private user-read-email"),
        ..Default::default()
    };
    let mut spotify = AuthCodeSpotify::new(creds, oauth);
    let url = spotify.get_authorize_url(false).unwrap();
    // Opens the url in the default browser
    open::that(url).unwrap();
    let mut code_url = String::new();
    // Starts a server on localhost:41010
    let listener = TcpListener::bind("127.0.0.1:41010").unwrap();
    //Waits till the code_url is not empty
    while code_url.is_empty() {
        for stream in listener.incoming() {
            let stream = stream.unwrap();
            let c = handle_connection(stream);
            code_url = c;
            if !code_url.is_empty() {
                break;
            }
        }
    }
    //Closes the server
    listener.set_nonblocking(true).unwrap();
    // Drops the listener
    drop(listener);
    // Parses the code from the url
    let code = utility::parse_response_code(&code_url);
    println!("Code: {}", code);
    // Gets the token from the code
    spotify.request_token(&code).await.unwrap();
    // Gets the token
    let prev_token = spotify.get_token().lock().await.unwrap().clone().unwrap();
    // Saves the refresh token
    save_token(
        id.to_string(),
        secret.to_string(),
        prev_token.refresh_token.unwrap(),
    );
    spotify
}

//For Authenticating with refresh token
pub async fn with_refresh_token(id: String, secret: String, ref_token: String) -> AuthCodeSpotify {
    let creds = Credentials::new(&id, &secret);
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
    // Sets the token
    *spotify.get_token().lock().await.unwrap() = Some(refreshed.clone());
    // Tries to refresh
    spotify.refresh_token().await.expect("Failed to refresh token");

    spotify
}
// handling the TCP Connection
fn handle_connection(mut stream: TcpStream) -> String {
    // Reads the buffer stream
    let buf_reader = BufReader::new(&mut stream);
    // Reads the lines
    let http_request: Vec<_> = buf_reader
        .lines()
        .map(|result| result.unwrap())
        .take_while(|line| !line.is_empty())
        .collect();
    if http_request.len() == 0 {
        return "".to_string();
    }
    // Gets the code from the url
    let code_url = "http://127.0.0.1:41010".to_string()
        + &http_request[0].split(" ").collect::<Vec<&str>>()[1].to_string();
    // If the url contains favicon or code
    if code_url.contains("favicon") || !code_url.contains("code") {
        return "".to_string();
    }
    // Writes the response
    let status_line = "HTTP/1.1 200 OK\r\n\r\n";
    let content = "You can now close this tab";
    let response = format!("{status_line} {content}");
    stream.write_all(response.as_bytes()).unwrap();
    code_url
}

struct UserData {
    name: String,
    image: String,
}

impl Serialize for UserData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("UserData", 2)?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("image", &self.image)?;
        state.end()
    }
}
// Sending user data
pub async fn get_usr_data(spotify: AuthCodeSpotify) -> String {
    let spotify = spotify;
    let user = spotify.current_user().await.unwrap();
    let usr_data = UserData {
        name: user.display_name.unwrap(),
        image: user.images.unwrap().first().unwrap().url.clone(),
    };
    let json = serde_json::to_string(&usr_data).unwrap();
    return json;
}
