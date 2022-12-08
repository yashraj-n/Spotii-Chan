use std::fs::remove_file;

use crate::utils::config_file::get_config_file_location;

pub fn cmd_logout(){
    //Delete Spotii config file
    let config_path = get_config_file_location();
    remove_file(config_path).unwrap();
}