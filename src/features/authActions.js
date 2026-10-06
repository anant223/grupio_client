import { createAsyncThunk } from "@reduxjs/toolkit";
import  UserService  from "@/services/user.service";

const userService = new UserService();

export const signup = createAsyncThunk(
  "user/signup",
  async (data, { rejectWithValue }) => {
    try {
      await userService.signup(data);
      return { message: "Signup successful" };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.login(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await userService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.user();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await userService.updateProfile(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userService.updatePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password update failed");
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      console.log("email", email)
      const response = await userService.forgetPassword(email);
      console.log("response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Request failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({token, password}, { rejectWithValue }) => {
    try {
      console.log(password)
      const response = await userService.resetPassword({token, password});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reset failed");
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "user/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.readHistory();
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch history");
    }
  }
);

export const onboardingComplete = createAsyncThunk(
  "user/onboarding",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userService.onBoarding(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to complete onboarding"
      );
    }
  }
);

export const updatingPreferences = createAsyncThunk(
  "user/preferences",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await userService.updateCategories(categoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update preferences"
      );
    }
  }
);

export const notificationPreferences = createAsyncThunk(
  "notification/preferences",
  async ({ key, value }, { rejectWithValue }) => {
    try {
      const res = await userService.updateNotificationPreferences({
        key,
        value,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications preferences"
      );
    }
  }
);

export const changeEmail = createAsyncThunk(
  "user/emailChange",
  async ({newEmail, password }, { rejectWithValue }) => {
    try {
      const res = await userService.changeEmail({
        newEmail,
        password,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update email"
      );
    }
  }
);
export const emailUpdateConfirmation = createAsyncThunk(
  "user/emailConfirmation",
  async (token, { rejectWithValue }) => {
    try {
      const res = await userService.emailUpdateConfirmation(token);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to confirm email change"
      );
    }
  }
);

export const updateLocation = createAsyncThunk(
  "user/updateLocation",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data)
      const res = await userService.updateLocation(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to confirm email change"
      );
    }
  }
);