import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../features/profile/profileSlice";
import videosReducer from "../features/videos/videosSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    videos: videosReducer,
  },
});

export default store;
