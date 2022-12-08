import { configureStore } from "@reduxjs/toolkit";
import downloadsSlice from "../slices/downloadsSlice";
import searchSlice from "../slices/searchSlice";

export const store = configureStore({
  reducer: {
    searchSlice : searchSlice,
    downloadsSlice : downloadsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
