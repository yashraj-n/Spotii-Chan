//@ts-nocheck
import React, { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setDownloads } from "../slices/downloadsSlice";
import { toast } from "react-toastify";

function DownloadListener() {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("[*] - Download Listener Loaded");
    SetupListener(dispatch);
  }, []);
  return <div></div>;
}

function SetupListener(dispatch: Dispatch) {
  (async () => {
    await listen("progress", (event) => {
      //@ts-ignore
      let data = parse_output(event.payload.line);
      if (data) {
        data.img = event.payload.img;
        data.title = event.payload.name;
        data.artist = event.payload.artist;
        data.location = event.payload.location;
        console.log(data);
        if (data.state === "DOWNLOADING" && data.percent === "0.0") {
          toast(`🎶 Started Downloading "${data.title}" [ETA: ${data.eta}]`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (data.state === "COMPLETED" && data.percent === "100.0") {
          toast(`✔ Finished Downloading "${data.title}"`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        dispatch(
          setDownloads({
            data,
            id: event.payload.id,
          })
        );
      }
    });
  })();
}

const parse_output = (line: string) => {
  const regex =
    /\[download\]\s+(\d+\.\d+)%\s+of\s+(\d+\.\d+)(\w+)B\s+at\s+(\d+\.\d+)(\w+)B\/s\s+ETA\s+(\d+:\d+)/;
  const match = regex.exec(line);
  if (match && !line.includes("has already been downloaded")) {
    const percent = match[1];
    const size = match[2];
    const size_unit = match[3];
    const speed = match[4];
    const speed_unit = match[5];
    const eta = match[6];
    const state = percent === "100.0" ? "COMPLETED" : "DOWNLOADING";
    return { percent, size, size_unit, speed, speed_unit, eta, state };
  } else if (line.includes("has already been downloaded")) {
    const state = "COMPLETED";
    return {
      percent: "100.0",
      size: "0.0",
      size_unit: "B",
      speed: "0.0",
      speed_unit: "B",
      eta: "00:00",
      state,
    };
  }
};

export default DownloadListener;
