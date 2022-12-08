//* Stores the downlooads in Redux state so that it can be accessed from anywhere in the app

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IDownloadsSlice {
  downloads: {};
}

const initialValue: IDownloadsSlice = {
  downloads: {},
};

interface PayloadData {
  id: string;
  data: {};
}
export const DownloadsSlice = createSlice({
  name: "downloadsSlice",
  initialState: initialValue,
  reducers: {
    setDownloads: (state, action: PayloadAction<PayloadData>) => {
      state.downloads[action.payload.id] = action.payload.data;
    },
  },
});

export const { setDownloads } = DownloadsSlice.actions;
export default DownloadsSlice.reducer;
