use rspotify::{
    model::{SearchType, TrackId},
    prelude::*, AuthCodeSpotify,
};

// Searches Song on Spotify
pub async fn cmd_search_song(global_spot: AuthCodeSpotify, query: String) -> String {
    let spotify = global_spot;
    let song_details = spotify.search(&query, &SearchType::Track, None, None, Some(20), None);
    let songs = song_details.await.expect("Failed to get song details");
    // Serialize as json
    let json = serde_json::to_string(&songs).unwrap();
    // Send json to frontend
    json
}
// Searches Song on Spotify but query is a URI
pub async fn cmd_spotify_search_song(spotify : AuthCodeSpotify, uri : String) -> String{
    let formed_uri = format!("spotify:track:{}", uri);
    let track = TrackId::from_uri(&formed_uri).expect("Invalid track URI");
    let track = spotify.track(&track).await.expect("Track not found");
    println!("{:?}", track);
    serde_json::to_string(&track).unwrap()
}
