use invidious::{reqwest::asynchronous::Client, structs::hidden::SearchItem};
use serde::ser::{Serialize, SerializeStruct, Serializer};
//Data to send to the YouTube Popup
struct PopupData<'b> {
    author: &'b str,
    title: &'b str,
    length: &'b u64,
    thumbnail: &'b str,
    id: &'b str,
}
// Serialize the data
impl Serialize for PopupData<'_> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("popupData", 4)?;
        state.serialize_field("author", &self.author)?;
        state.serialize_field("title", &self.title)?;
        state.serialize_field("length", &self.length)?;
        state.serialize_field("thumbnail", &self.thumbnail)?;
        state.serialize_field("id", &self.id)?;
        state.end()
    }
}

pub async fn cmd_search_yt_urls(query: String) -> String {
    let to_query = format!("q={}", query);
    // * Uses the invidious-rs crate to search for the video
    // TODO: Add this in config also

    let client = Client::new(String::from("https://inv.riverside.rocks"));
    // Searches the item query
    let search_results = client.search(Some(&to_query)).await.unwrap().items;
    let closest_match = search_results.first().unwrap();
    let mut json_to_return = String::new();
    // Gets the first match
    match closest_match {
        SearchItem::Video {
            author,
            length,
            thumbnails,
            title,
            id,
            ..
        } => {
            let dat = PopupData {
                title,
                author,
                length,
                thumbnail: &thumbnails.first().unwrap().url.clone(),
                id
            };
            json_to_return = serde_json::to_string(&dat).unwrap();
        }
        _ => {}
    }
    // Returns the data as json
    json_to_return
}

