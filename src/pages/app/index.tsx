//@ts-nocheck
import React from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import SongCard from "../../components/SongCard";
import styles from "../../styles/app/App.module.scss";
import Modal from "react-modal";

import { Item, SpotifySearchResult } from "../../lib/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store";
import YoutubeDownload from "../../components/YoutubeDownload";

Modal.setAppElement("#__next");

function App() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [songToDownload, setSongToDownload] = React.useState<string>("");
  const [songData, setSongData] = React.useState<Item>({
    artists: [{ name: "Loading..." }],
    album: {
      images: [{ url: "" }],
    },
  });
  function openModal(song_name: string) {
    setSongToDownload(song_name);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  //@ts-ignore
  const searchResults: SpotifySearchResult = useSelector(
    (state: RootState) => state.searchSlice.Searchresult
  );
  console.log("From Main Content:- ", searchResults);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          content: {
            backgroundColor: "#2A2A2F",
            border: "none",
          },
        }}
      >
        <YoutubeDownload
          query={songToDownload}
          song_artist={songData.artists}
          song_img={songData.album.images}
          song_name={songData.name}
        />
      </Modal>
      <div className="cont">
        <Sidebar />
        <div style={{ width: "100%" }}>
          <Navbar />
          <br />
          <div className={styles.song_grid}>
            {searchResults.tracks.items.map((f) => (
              <>
                <div
                  onClick={() => {
                    openModal(f.name + " - " + f.artists[0].name);
                    setSongData(f);
                  }}
                  key={f.name}
                >
                  <SongCard
                    artist={f.artists[0].name}
                    img={f.album.images[0].url}
                    name={f.name}
                  />
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
