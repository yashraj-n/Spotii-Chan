//* API

//mport { goto } from "$app/navigation";
import type {
  SpotifySearchResult,
  UserData,
  YoutubeVideoResult,
} from "./interfaces";
import { Item } from "./state";

export async function init() {
  const { invoke } = require("@tauri-apps/api");

  let res: "OK" | "LOGIN_REQ" = await invoke("start_init");
  return res;
}

export async function reauth(id: string, secret: string) {
  const { invoke } = require("@tauri-apps/api");

  let res: "OK" | "INVALID_CREDS" = await invoke("reauth", { id, secret });
  return res;
}

export async function getUserData() {
  const { invoke } = require("@tauri-apps/api");

  let res: string = await invoke("get_usr_data");
  return JSON.parse(res) as UserData;
}
//TODO: Image
// export async function setUserImage() {
//   if (get(usr_img) === "") {
//     let data = await getUserData();
//     usr_img.set(data.image);
//   }
// }

export async function Logout() {
  const { invoke } = require("@tauri-apps/api");

  await invoke("logout");
  
}

export async function SearchSong(query: string) {
  const SPOTIFY_URL_REGEX = /https:\/\/open\.spotify\.com\/track\/([^\?&#]+)/;
  const SPOTIFY_URI_REGEX = /spotify:track:(\w+)/;
  const YOUTUBE_REGEX = /https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+)/;

  let spotifyURLmatch = SPOTIFY_URL_REGEX.exec(query);
  let spotifyURImatch = SPOTIFY_URI_REGEX.exec(query);
  let youtubeMatch = YOUTUBE_REGEX.exec(query);

  if (spotifyURLmatch) {
    return await SearchSpotifyURI(spotifyURLmatch[1]);
  } else if (spotifyURImatch) {
    return await SearchSpotifyURI(spotifyURImatch[1]);
  } else if (youtubeMatch) {   
    let yt_vid_data = await GetYoutubeVideo(query);
    let queryToSend = yt_vid_data.title + " " + yt_vid_data.author;
    let res = await SearchSpotifySong(queryToSend);
    return res;
  } else {
    let res = await SearchSpotifySong(query);
    return res;
  }
}

async function SearchSpotifyURI(uri: string) {
  const { invoke } = require("@tauri-apps/api");

  let res: string = await invoke("from_spotify_uri", { query: uri });
  let dummySearch: SpotifySearchResult = {
    tracks: {
      href: "",
      items: [JSON.parse(res) as Item],
      limit: 1,
      next: "",
      offset: 0,
      previous: null,
      total: 1,
    },
  };
  return dummySearch;
}
export async function SearchSpotifySong(query: string) {
  const { invoke } = require("@tauri-apps/api");

  let res: string = await invoke("search_song", { query });
  return JSON.parse(res) as SpotifySearchResult;
}

export async function GetYoutubeVideo(query: String) {
  const { invoke } = require("@tauri-apps/api");

  let res: string = await invoke("get_yt_url", { query });
  return JSON.parse(res) as YoutubeVideoResult;
}

export async function DownloadSong(
  url: string,
  songTitle: string,
  songArtist: string,
  songImg: string,
  location: string
) {
  const { invoke } = require("@tauri-apps/api");
  let res: string = await invoke("download_yt_url", {
    url,
    songTitle,
    songArtist,
    songImg,
    location,
  });
  return res;
}

export async function OpenFolder(path: string) {
  const { invoke } = require("@tauri-apps/api");
  console.log(path);
  await invoke("open_folder", { path });
}
