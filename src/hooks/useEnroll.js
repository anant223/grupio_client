import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleEventRegistration,
  fetchRegisteredEvents,
} from "@/features/registerEventAction";
import {
  selectIsEventRegistered,
  selectRegisteredEvents,
  selectToggleLoading,
  selectRegistrationLoading,
  selectUpcomingRegisteredEvents,
} from "@/app/selector/registerSelector";

export const useEnroll = (eventId) => {
  const dispatch = useDispatch();
  const isRegistered = useSelector((state) =>
    selectIsEventRegistered(eventId)(state)
  );
  const registeredEvents = useSelector(selectRegisteredEvents);
  const upcomingRegisteredEvents = useSelector(selectUpcomingRegisteredEvents);
  const toggleLoading = useSelector(selectToggleLoading);
  const loading = useSelector(selectRegistrationLoading);

  
  useEffect(() => {
    if (registeredEvents.length === 0 && !loading) {
      dispatch(fetchRegisteredEvents());
    }
  }, [dispatch]);

  const toggleRegistration = useCallback((eventId) => {
    return dispatch(toggleEventRegistration(eventId)).unwrap();
  }, [dispatch]);

  const refetch = useCallback(() => {
    return dispatch(fetchRegisteredEvents());
  }, [dispatch]);

  return {
    isRegistered,
    registeredEvents,
    upcomingRegisteredEvents,
    isLoading: toggleLoading,
    loading,
    toggleRegistration,
    refetch,
  };
};

export default useEnroll;
