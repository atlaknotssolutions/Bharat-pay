import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api/uservideo`;

export const normalizeVideoListItem = (video) => ({
  id: video._id || video.id,
  title: video.title || "Untitled video",
  thumb: video.thumbnail
    ? video.thumbnail.startsWith("http")
      ? video.thumbnail.replace(/\\/g, "/")
      : `${BACKEND_URL}/${video.thumbnail.replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  description: video.description || "",
  duration: video.duration || "",
  views: Number(video.views || 0),
  category: video.category || null,
  videoType: video.videoType || null,
  videoUrl: video.videoUrl
    ? video.videoUrl.startsWith("http")
      ? video.videoUrl.replace(/\\/g, "/")
      : `${BACKEND_URL}/${video.videoUrl.replace(/\\/g, "/")}`
    : "",
  channel: video.channel || null,
  uploadDate: video.createdAt || video.uploadDate || null,
  status: video.status || (video.isPublic === false ? "Private" : "Public"),
  likesCount: Number(video.likesCount || video.likes || 0),
  avgWatchPercent: Number(video.avgWatchPercent || 0),
  earnings: Number(video.earnings || 0),
  totalWatchTime: video.totalWatchTime || "",
  raw: video,
});

export const normalizeShort = (video) => ({
  id: video._id || video.id,
  title: video.title || "Untitled Short",
  videoUrl: video.videoUrl
    ? video.videoUrl.startsWith("http")
      ? video.videoUrl.replace(/\\/g, "/")
      : `${BACKEND_URL}/${video.videoUrl.replace(/\\/g, "/")}`
    : "",
  views: Number(video.views || 0),
  likes: Number(video.likesCount ?? video.likes ?? 0),
  comments: Array.isArray(video.comments)
    ? video.comments.length
    : Number(video.comments) || 0,
  isLiked: video.userReaction === "like",
  reaction: video.userReaction || null,
  thumbnail: video.thumbnail
    ? video.thumbnail.startsWith("http")
      ? video.thumbnail.replace(/\\/g, "/")
      : `${BACKEND_URL}/${video.thumbnail.replace(/\\/g, "/")}`
    : "",
  raw: video,
});

const getVideosArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.videos)) return payload.videos;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

let homeFetchRequestId = 0;

export const fetchHomeVideos = createAsyncThunk(
  "videos/fetchHomeVideos",
  async (category, { rejectWithValue }) => {
    const requestId = ++homeFetchRequestId;
    try {
      const token = localStorage.getItem("token");
      if (!token)
        return {
          recommended: [],
          trending: [],
          latest: [],
          subscriptions: [],
          shorts: [],
        };

      const categoryParam = category ? `?category=${category}` : "";

      const [
        recommendedRes,
        trendingRes,
        latestRes,
        subscriptionsRes,
        shortsRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/recommended${categoryParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/trending${categoryParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/latest${categoryParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/subscriptions${categoryParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/trending-shorts${categoryParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (requestId !== homeFetchRequestId) return { cancelled: true };

      const [
        recommendedData,
        trendingData,
        latestData,
        subscriptionsData,
        shortsData,
      ] = await Promise.all([
        recommendedRes.json().catch(() => ({ videos: [] })),
        trendingRes.json().catch(() => ({ videos: [] })),
        latestRes.json().catch(() => ({ videos: [] })),
        subscriptionsRes.json().catch(() => ({ videos: [] })),
        shortsRes.json().catch(() => ({ videos: [] })),
      ]);

      if (requestId !== homeFetchRequestId) return { cancelled: true };

      return {
        recommended: getVideosArray(recommendedData).map(
          normalizeVideoListItem,
        ),
        trending: getVideosArray(trendingData).map(normalizeVideoListItem),
        latest: getVideosArray(latestData).map(normalizeVideoListItem),
        subscriptions: getVideosArray(subscriptionsData).map(
          normalizeVideoListItem,
        ),
        shorts: getVideosArray(shortsData).map(normalizeShort),
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load videos");
    }
  },
);

export const fetchMyVideos = createAsyncThunk(
  "videos/fetchMyVideos",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await fetch(`${API_BASE}/my-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      const videos = Array.isArray(data.videos) ? data.videos : [];
      return videos.map(normalizeVideoListItem);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load My Videos");
    }
  },
);

const initialState = {
  recommended: [],
  trending: [],
  latest: [],
  subscriptions: [],
  shorts: [],
  myVideos: [],
  selectedCategory: null,
  loading: false,
  myVideosLoading: false,
  error: null,
};

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    clearVideosError: (state) => {
      state.error = null;
    },
    setSelectedCategory: (state, action) => {
      if (state.selectedCategory === action.payload) return;
      state.selectedCategory = action.payload;
      state.recommended = [];
      state.trending = [];
      state.latest = [];
      state.subscriptions = [];
      state.shorts = [];
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeVideos.fulfilled, (state, action) => {
        if (action.payload?.cancelled) return;
        state.loading = false;
        state.error = null;
        state.recommended = action.payload.recommended;
        state.trending = action.payload.trending;
        state.latest = action.payload.latest;
        state.subscriptions = action.payload.subscriptions;
        state.shorts = action.payload.shorts;
      })
      .addCase(fetchHomeVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load videos";
      })
      .addCase(fetchMyVideos.pending, (state) => {
        state.myVideosLoading = true;
      })
      .addCase(fetchMyVideos.fulfilled, (state, action) => {
        state.myVideosLoading = false;
        state.myVideos = action.payload;
      })
      .addCase(fetchMyVideos.rejected, (state, action) => {
        state.myVideosLoading = false;
        state.error = action.payload || "Failed to load My Videos";
      });
  },
});

export const { clearVideosError, setSelectedCategory } = videosSlice.actions;
export default videosSlice.reducer;
