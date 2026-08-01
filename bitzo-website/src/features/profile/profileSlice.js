import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:8000";

const normalizeProfileVideos = (videos = []) =>
  Array.isArray(videos)
    ? videos.map((video) => ({
        id: video._id || video.id,
        title: video.title || "Untitled video",
        thumbnail:
          video.thumbnail ||
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
        views: Number(video.views || 0),
        likesCount: Number(video.likesCount || 0),
        duration: video.duration || "—",
        uploadDate: video.createdAt
          ? new Date(video.createdAt).toLocaleDateString("en-IN")
          : "Recently uploaded",
        status: "Public",
        raw: video,
      }))
    : [];

const normalizeHistoryVideos = (videos = []) =>
  Array.isArray(videos)
    ? videos.map((video) => ({
        id: video._id || video.id,
        title: video.title || "Untitled video",
        thumbnail:
          video.thumbnail ||
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
        channel: video.channel?.name || video.channelName || "Unknown channel",
        views: Number(video.views || 0),
        duration: video.duration || "—",
        watchedAt: video.watchedAt || video.updatedAt || video.createdAt,
        raw: video,
      }))
    : [];

export const fetchProfileData = createAsyncThunk(
  "profile/fetchProfileData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login first.");

      const profileRes = await fetch(`${BACKEND_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        if (profileRes.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Server error: ${profileRes.status}`);
      }

      const profileData = await profileRes.json();
      if (!profileData.success || !profileData.user) {
        throw new Error("Invalid profile data received");
      }

      const profile = profileData.user;
      const profileVideos = normalizeProfileVideos(profile.videos);

      let historyItems = [];
      try {
        const historyRes = await fetch(`${BACKEND_URL}/api/uservideo/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          historyItems = normalizeHistoryVideos(historyData.videos);
        }
      } catch (historyErr) {
        console.error("Failed to load watch history:", historyErr);
      }

      return {
        user: {
          _id: profile._id,
          name: profile.name || "User",
          handle: `@${(profile.name || "user").toLowerCase().replace(/\s+/g, "")}`,
          email: profile.email || "",
          avatar:
            profile.avatar ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          createdAt: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "Unknown date",
          subscribers: profile.subscribers || 0,
          totalVideos: profile.totalVideos || profile.videos?.length || 0,
          totalViews: profile.totalViews || 0,
          totalEarnings: profile.totalEarnings || 0,
          avgRPM: profile.avgRPM || "0.0",
          videos: profileVideos,
        },
        myVideos: profileVideos,
        historyVideos: historyItems,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load profile");
    }
  },
);

const initialState = {
  user: null,
  myVideos: [],
  historyVideos: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.myVideos = action.payload.myVideos;
        state.historyVideos = action.payload.historyVideos;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile";
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
