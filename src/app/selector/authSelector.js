import { createSelector } from "@reduxjs/toolkit";

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthInitialized = (state) => state.auth.initialized;
export const selectUserHistory = (state) => state.auth.userEvents

export const selectUpcomingOrganized = createSelector(
  (state) => state.auth.userEvents.upcomingOrganizeEvents,
  (organized) =>
    organized?.filter((e) => new Date(e.startDateTime) >= new Date()) ?? null
);
export const selectPastOrganized = createSelector(
  (state) => state.auth.userEvents.pastOrganized,
  (organized) =>
    organized?.filter((e) => new Date(e.startDateTime) < new Date()) ?? null
);
export const selectPastSubs = createSelector(
  (state) => state.auth.userEvents.subscribed,
  (subscribed) =>
    subscribed?.filter((e) => new Date(e.event.startDateTime) < new Date()) ??
    null
);
export const selectUpcomingSubs = createSelector(
  (state) => state.auth.userEvents.subscribed,
  (subscribed) =>
    subscribed?.filter((e) => new Date(e.event.startDateTime) >= new Date()) ??
    null
);
export const selectIsSubscribed = (eventId) =>
  createSelector(
    (state) => state.auth.userEvents.subscribed,
    (subscribed) =>
      subscribed?.some((sub) => sub.event._id === eventId) ?? false
  );
export const selectAuthLoading = (state) => state.auth.authLoading;

export const selectPreferencesLoading = (state) =>
  state.auth.preferencesLoading;
export const selectNotificationLoading = (state) =>
  state.auth.notificationLoading;
export const selectHistoryLoading = (state) => state.auth.historyLoading;

export const selectAuthError = (state) => state.auth.errors.auth;
export const selectUpdateProfileError = (state) =>
  state.auth.errors.updateProfile;
export const selectChangeEmailError = (state) => state.auth.errors.changeEmail;
export const selectOnboardingError = (state) => state.auth.errors.onboarding;
export const selectFetchHistoryError = (state) =>
  state.auth.errors.fetchHistory;
export const selectPreferencesError = (state) => state.auth.errors.preferences;
export const selectNotificationsError = (state) =>
  state.auth.errors.notifications;

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name || "Guest"
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || ""
);

export const selectUserAvatar = createSelector(
  [selectUser],
  (user) => user?.avatar || "/default-avatar.png"
);

export const selectUserBio = createSelector(
  [selectUser],
  (user) => user?.bio || ""
);

export const selectUserSocialLinks = createSelector(
  [selectUser],
  (user) => user?.socialLinks || {}
);

export const selectUserPreferences = createSelector(
  [selectUser],
  (user) => user?.preferredCategories || []
);

export const selectUserNotificationPreferences = createSelector(
  [selectUser],
  (user) => user?.notificationPreferences || {}
);

export const selectOnboardingCompleted = createSelector(
  [selectUser],
  (user) => user?.onboardingCompleted || false
);

export const selectHasCompletedProfile = createSelector(
  [selectUser],
  (user) => {
    if (!user) return false;
    return !!(user.name && user.email && user.avatar);
  }
);
