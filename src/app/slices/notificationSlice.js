import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/features/notificationAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unReadCount: 0,
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    fetchLoading: false,
    markAsReadLoading: false,
    markAllAsReadLoading: false,
    deleteLoading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,

    reducers: {
    clearError: (state) => {
        state.error = null;
    },
    addNotification: (state, action) => {
        state.notifications.unshift(action.payload);
        state.unReadCount += 1;
        state.totalCount += 1;
    },
    },

    extraReducers: (builder) => {
    builder
        .addCase(fetchNotifications.pending, (state) => {
            state.fetchLoading = true;
            state.error = null;
        })
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.fetchLoading = false;
            // console.log("PAYLOAD:", action.payload);
            state.notifications = action.payload.allNotifications;
            state.unReadCount = action.payload.unReadCount;
            state.totalCount = action.payload.totalCount;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        })
        .addCase(fetchNotifications.rejected, (state, action) => {
            state.fetchLoading = false;
            state.error = action.payload;
        })
        .addCase(markNotificationAsRead.pending, (state) => {
            state.markAsReadLoading = true;
            state.error = null;
        })
        .addCase(markNotificationAsRead.fulfilled, (state, action) => {
            state.markAsReadLoading = false;
            const index = state.notifications.findIndex(
                (n) => n._id === action.payload.notification._id
            );
            if (index !== -1) {
                state.notifications[index] = action.payload.notification;
                state.unReadCount = Math.max(0, state.unReadCount - 1);
            }
        })
        .addCase(markNotificationAsRead.rejected, (state, action) => {
            state.markAsReadLoading = false;
            state.error = action.payload;
        })
        .addCase(markAllNotificationsAsRead.pending, (state) => {
            state.markAllAsReadLoading = true;
            state.error = null;
        })
        .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
            state.markAllAsReadLoading = false;
            state.notifications = state.notifications.map((n) => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
            }));
            state.unReadCount = 0;
        })
        .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
            state.markAllAsReadLoading = false;
            state.error = action.payload;
        })
        .addCase(deleteNotification.pending, (state) => {
            state.deleteLoading = true;
            state.error = null;
        })
        .addCase(deleteNotification.fulfilled, (state, action) => {
            state.deleteLoading = false;
            const deleted = state.notifications.find(
            (n) => n._id === action.meta.arg
            );
            state.notifications = state.notifications.filter(
            (n) => n._id !== action.meta.arg
            );
            if (deleted && !deleted.isRead) {
            state.unReadCount = Math.max(0, state.unReadCount - 1);
            }
            state.totalCount -= 1;
        })
        .addCase(deleteNotification.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.payload;
        });
    },
});

export const { clearError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
