//* This slice is used to store the search query from Navbar to App page

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SpotifySearchResult } from "../lib/interfaces";

export interface ISearchSlice {
  Searchresult: SpotifySearchResult;
}

const initialValue: ISearchSlice = {
  Searchresult: {
    tracks: {
      //@ts-ignore
      item: [],
      href: "",
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
  },
};

export const SearchSlice = createSlice({
  name: "searchSlice",
  initialState: initialValue,
  reducers: {
    setSearchResult: (state, action: PayloadAction<SpotifySearchResult>) => {
      //@ts-ignore
      state.Searchresult = action.payload;
    },
  },
});

export const { setSearchResult } = SearchSlice.actions;
export default SearchSlice.reducer;
