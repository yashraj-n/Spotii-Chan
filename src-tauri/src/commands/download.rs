use crate::utils::config_file::get_config_folder_location;
use serde::{ser::SerializeStruct, Serialize};
use std::{
    io::{BufRead, BufReader},
    path::Path,
    process::{Command, Stdio},
};
use tauri::Window;
use uuid::Uuid;
// Windows:  Command opens a window when executing
// This is a workaround to hide the window

// Data which is returned to the frontend
#[derive(Clone)]
struct Returndata {
    pub line: String,
    pub id: String,
    pub name: String,
    pub img: String,
    pub artist: String,
    location: String,
}
// For serializing the data
impl Serialize for Returndata {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("Returndata", 2)?;
        state.serialize_field("line", &self.line)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("img", &self.img)?;
        state.serialize_field("artist", &self.artist)?;
        state.serialize_field("location", &self.location)?;
        state.end()
    }
}

pub fn cmd_download(
    url: String,
    window: Window,
    name: String,
    img: String,
    artist: String,
    location: String,
) {
    //TODO: Handle sterr  also

    let uid = Uuid::new_v4().to_string();
    println!("Downloading {}", url);

   
    let mut command = if cfg!(target_os = "windows") {
        Command::new("powershell")
    } else {
        Command::new("bash")
    };

    if !cfg!(target_os = "windows") {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        use std::os::windows::process::CommandExt;
        command.creation_flags(CREATE_NO_WINDOW);
    }
    let parsed_location = Path::new(&location).to_str().unwrap();
    // Runs the command
    let args = format!(
        "cd {}; ./yt.exe '{}' --newline -f bestaudio --audio-format mp3 --audio-quality 0 -o '{}'",
        get_config_folder_location(),
        url,
        parsed_location
    );
    println!("Running {}", args);
    // Adds the -c flag to the command
    command.arg("-c").arg(args);
    // Piping the stdout and stderr
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());

    // Spawns the command
    let mut child = command.spawn().unwrap();
    let stdout = child.stdout.take().unwrap();
    let mut stdout = BufReader::new(stdout);

    let mut line = String::new();
    loop {
        // Clears the 'line' string and adds current line
        line.clear();
        let n = stdout.read_line(&mut line).unwrap();
        if n == 0 {
            break;
        }
        let payload = Returndata {
            line: line.clone(),
            id: uid.clone(),
            name: name.clone(),
            img: img.clone(),
            artist: artist.clone(),
            location: location.clone(),
        };
        // Sends the data to the frontend
        window.emit("progress", payload).unwrap();
    }
}
