import {createAsyncThunk } from "@reduxjs/toolkit";
import  RegisterService from "@/services/register.service";

const registerService = new RegisterService();

export const toggleEventRegistration = createAsyncThunk(
  "registration/toggle",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await registerService.toggleRegisterEvent(eventId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to toggle registration"
      );
    }
  }
);

export const fetchRegisteredEvents = createAsyncThunk(
  "registration/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await registerService.registredEvents();
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch registered events"
      );
    }
  }
);

