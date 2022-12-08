//@ts-nocheck
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import { OpenFolder } from "../../lib/api";
import { RootState } from "../../lib/store";
import styles from "../../styles/downloads/Download.module.scss";

function Downloads() {
  // Gets Current downloads from Redux Store
  const downloaded = useSelector(
    (root: RootState) => root.downloadsSlice.downloads
  );
  // All the keys of the download
  let keys = Object.keys(downloaded);
  const open_folder = (location: string) => {
    OpenFolder(location).then();
  };
  return (
    <div className="cont">
      <Sidebar />
      <div>
        <div className={styles.heading}>
          <h2>Downloads</h2>
        </div>
        <br />
        <br />
        <div className={styles.downloads_list}>
          {/* Loop through every download using key */}
          {keys.map((key) => (
            <div className={styles.card}>
              <img
                src={downloaded[key].img}
                alt="Song_image"
                className={styles.album_img}
              />
              <div>
                <div className={styles.name}>{downloaded[key].title}</div>
                <div className={styles.artist}>{downloaded[key].artist}</div>
              </div>
              <div style={{ display: "flex" }}>
                <div className={styles.slider_cont}>
                  <div className={styles.full_slider}>
                    <div
                      style={{
                        maxWidth: "100%",
                        width: `${downloaded[key].percent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div onClick={() =>{
                open_folder(downloaded[key].location)
              }}>
                <svg
                  className={styles.open_folder}
                  viewBox="0 0 35 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.625 29.7503H4.375C3.23157 29.7644 2.12916 29.3247 1.30917 28.5277C0.489182 27.7307 0.0184324 26.6412 0 25.4978V4.25283C0.0184324 3.10945 0.489182 2.01998 1.30917 1.22295C2.12916 0.425917 3.23157 -0.0137114 4.375 0.000326122H12.425C12.6835 0.00203549 12.9384 0.0609865 13.1714 0.172942C13.4044 0.284898 13.6097 0.447078 13.7725 0.647826L18.3225 6.21283H30.5725C31.1431 6.19889 31.7107 6.29809 32.2428 6.50469C32.7748 6.7113 33.2607 7.02122 33.6723 7.41658C34.0839 7.81194 34.4132 8.2849 34.641 8.80817C34.8689 9.33144 34.9909 9.89466 35 10.4653V25.4978C34.9816 26.6412 34.5108 27.7307 33.6908 28.5277C32.8708 29.3247 31.7684 29.7644 30.625 29.7503Z"
                    fill="white"
                  />
                </svg>
              </div>
           
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Downloads;
