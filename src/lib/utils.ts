export const parse_output = (line: string) => {
  // [download]   0.0% of    4.42MiB at  998.88KiB/s ETA 00:04
  // Get %, speed, size, eta from line
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
  } else if(line.includes("has already been downloaded")) {
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
