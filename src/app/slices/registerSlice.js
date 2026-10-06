import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchRegisteredEvents, 
  toggleEventRegistration 
} from "@/features/registerEventAction";

const initialState = {
  registeredEvents: [],
  loading: false,
  error: null,
  toggleLoading: false,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegisteredEvents: (state) => {
      state.registeredEvents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Registration
      .addCase(toggleEventRegistration.pending, (state) => {
        state.toggleLoading = true;
        state.error = null;
      })
      .addCase(toggleEventRegistration.fulfilled, (state, action) => {
        state.toggleLoading = false;
        console.log("payload", action.payload);
        
        const { eventId, isRegistered, event } = action.payload;
        
        if (isRegistered) {
          const exists = state.registeredEvents.find(e => e._id === eventId);
          if (!exists && event) {
            state.registeredEvents.push(event);
          }
        } else {
          state.registeredEvents = state.registeredEvents.filter(
            e => e._id !== eventId
          );
        }
      })
      .addCase(toggleEventRegistration.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRegisteredEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredEvents = action.payload.events || action.payload;
      })
      .addCase(fetchRegisteredEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRegisteredEvents } = registrationSlice.actions;
export default registrationSlice.reducer;
