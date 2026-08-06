import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found. Please login first.");

      const res = await fetch(`${BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");

      return {
        notifications: data.notifications || [],
        unreadCount: Number(data.unreadCount || 0),
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load notifications");
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found. Please login first.");

      const res = await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");

      return {
        notification: data.notification,
        unreadCount: Number(data.unreadCount || 0),
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark notification as read",
      );
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found. Please login first.");

      const res = await fetch(`${BACKEND_URL}/api/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");

      return { unreadCount: Number(data.unreadCount || 0) };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to mark all notifications as read",
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found. Please login first.");

      const res = await fetch(`${BACKEND_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");

      return { id, unreadCount: Number(data.unreadCount || 0) };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete notification");
    }
  },
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notifications";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { notification, unreadCount } = action.payload;
        const index = state.notifications.findIndex(
          (n) => n._id === notification._id,
        );
        if (index !== -1) {
          state.notifications[index] = {
            ...state.notifications[index],
            ...notification,
          };
        }
        state.unreadCount = unreadCount;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload.id,
        );
        state.unreadCount = action.payload.unreadCount;
      });
  },
});

export const { clearNotificationsError, resetNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
