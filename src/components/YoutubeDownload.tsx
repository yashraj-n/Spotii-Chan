import React, { useEffect, useState } from "react";
import { DownloadSong, GetYoutubeVideo } from "../lib/api";
import { YoutubeVideoResult } from "../lib/interfaces";
import styles from "../styles/components/YoutubeDownload.module.scss";
import Image from "next/image";
import { open } from "@tauri-apps/api/shell";
import { save } from "@tauri-apps/api/dialog";

function YoutubeDownload({ query, song_name, song_artist, song_img }) {
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<YoutubeVideoResult>(null);
  const openYtURL = () => {
    open(`https://www.youtube.com/watch?v=${video.id}`);
  };
  const startDownload = async () => {
    let filePath = await save({
      filters: [
        {
          name: "Audio File",
          extensions: ["mp3"],
        },
      ],
    });
    // Replace spaces, ' and other characters which posses threat to command line injection to userscore
    filePath = filePath.replace(/ /g, "_");
    filePath = filePath.replace(/'/g, "_");
    song_artist = song_artist[0].name;
    song_img = song_img[0].url;
    await DownloadSong(
      `https://www.youtube.com/watch?v=${video.id}`,
      song_name,
      song_artist,
      song_img,
      filePath
    );
  };
  useEffect(() => {
    (async () => {
      const YoutubeSearchData = await GetYoutubeVideo(query);
      setVideo(YoutubeSearchData);
      setLoading(false);
      console.log(YoutubeSearchData);
    })();
  }, []);
  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{
          display: "flex",
          minHeight: "80vh",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}>
          <div className="dot-stretching"></div>
        </div>
      ) : (
        <>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <h2>YouTube Video found for “{query}” </h2>
            <div className={styles.video_thumb}>
              <Image
                src={video.thumbnail}
                width="50%"
                height="15%"
                layout="responsive"
                objectFit="contain"
              />
            </div>
            <br />
            <div className={styles.data_holder}>
              <div className={styles.data}>
                <span className={styles.key}>Title: </span>{" "}
                <span>{video.title}</span>
              </div>
              <div className={styles.data}>
                <span className={styles.key}>Channel: </span>{" "}
                <span>{video.author}</span>
              </div>
              <div className={styles.data}>
                <span className={styles.key}>Duration: </span>{" "}
                <span>{fancyTimeFormat(video.length)} mins</span>
              </div>
              <br />
              <div className={styles.btns}>
                <button className={styles.btns_btn} onClick={startDownload}>
                  <div>
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.875 16.875H1.125C0.50368 16.875 0 17.3787 0 18C0 18.6213 0.50368 19.125 1.125 19.125H16.875C17.4963 19.125 18 18.6213 18 18C18 17.3787 17.4963 16.875 16.875 16.875Z"
                        fill="white"
                      />
                      <path
                        d="M0 15.75V18C0 18.6213 0.50368 19.125 1.125 19.125C1.74632 19.125 2.25 18.6213 2.25 18V15.75C2.25 15.1287 1.74632 14.625 1.125 14.625C0.50368 14.625 0 15.1287 0 15.75Z"
                        fill="white"
                      />
                      <path
                        d="M15.75 15.75V18C15.75 18.6213 16.2537 19.125 16.875 19.125C17.4963 19.125 18 18.6213 18 18V15.75C18 15.1287 17.4963 14.625 16.875 14.625C16.2537 14.625 15.75 15.1287 15.75 15.75Z"
                        fill="white"
                      />
                      <path
                        d="M9.00001 13.5C8.76678 13.5018 8.53876 13.431 8.34751 13.2975L3.84751 10.125C3.60498 9.95295 3.44042 9.69187 3.38983 9.39884C3.33923 9.10581 3.40671 8.80467 3.57751 8.56125C3.66277 8.43958 3.77129 8.33601 3.89679 8.2565C4.0223 8.17699 4.16231 8.12313 4.30875 8.09803C4.45518 8.07293 4.60514 8.07708 4.74996 8.11024C4.89478 8.14341 5.0316 8.20493 5.15251 8.29125L9.00001 10.98L12.825 8.1C13.0637 7.92098 13.3637 7.84412 13.6591 7.88631C13.9545 7.92851 14.221 8.08631 14.4 8.325C14.579 8.5637 14.6559 8.86373 14.6137 9.1591C14.5715 9.45447 14.4137 9.72098 14.175 9.90001L9.67501 13.275C9.48028 13.4211 9.24343 13.5 9.00001 13.5Z"
                        fill="white"
                      />
                      <path
                        d="M9 11.25C8.70163 11.25 8.41548 11.1315 8.2045 10.9205C7.99353 10.7095 7.875 10.4234 7.875 10.125V1.125C7.875 0.826631 7.99353 0.540483 8.2045 0.329505C8.41548 0.118526 8.70163 0 9 0C9.29837 0 9.58452 0.118526 9.79549 0.329505C10.0065 0.540483 10.125 0.826631 10.125 1.125V10.125C10.125 10.4234 10.0065 10.7095 9.79549 10.9205C9.58452 11.1315 9.29837 11.25 9 11.25Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  Download
                </button>
                <button className={styles.btns_btn} onClick={openYtURL}>
                  <div>
                    <svg
                      width="24"
                      height="20"
                      viewBox="0 0 24 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 6.5C1 3.2 3.2 1 6.5 1H17.5C20.8 1 23 3.2 23 6.5V13.1C23 16.4 20.8 18.6 17.5 18.6H6.5C3.2 18.6 1 16.4 1 13.1V11.549M11.362 7.039L14.079 8.667C15.113 9.294 15.113 10.306 14.079 10.933L11.362 12.561C10.262 13.221 9.36 12.715 9.36 11.428V8.161C9.36 6.885 10.262 6.379 11.362 7.039Z"
                        stroke="white"
                        strokeWidth="1.5"
                        stroke-miterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Watch
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

export default YoutubeDownload;
