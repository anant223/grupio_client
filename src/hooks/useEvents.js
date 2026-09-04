import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateCoHost,
  inviteUsers,
  activateEvent,
  cancelEvent,
  respondInvitation
} from "@/features/eventActions";
import {
  selectAllEvents,
  selectCurrentEvent,
  selectEventLoading,
  selectCreateLoading,
  selectUpdateLoading,
  selectDeleteLoading,
  selectEventError,
  selectPastEvents,
  selectHostLoading,
  selectStatusLoading,
  selectInviteLoading,
  selectEventCategories,
  selectEventsByLocation,
  selectPopularEvents
} from "@/app/selector/eventsSelector";
import { buildEventFormData } from "@/utils/eventFormData";

const useEvents = () => {
    const dispatch = useDispatch();
    const liveEvents = useSelector(selectAllEvents);
    const currentEvent = useSelector(selectCurrentEvent);
    const loading = useSelector(selectEventLoading);
    const createLoading = useSelector(selectCreateLoading);
    const updateLoading = useSelector(selectUpdateLoading);
    const deleteLoading = useSelector(selectDeleteLoading);
    const error = useSelector(selectEventError);
    const pastEvents = useSelector(selectPastEvents)
    const cohostLoading = useSelector(selectHostLoading);
    const invitationLoading = useSelector(selectInviteLoading);
    const statusLoading = useSelector(selectStatusLoading);

    
    
    const liveEventsPreview = useCallback(({ lat, lng, page, size, radius }) => {
        if(liveEvents.length === 0 && !loading){
            // console.log(liveEvents)
            dispatch(fetchAllEvents({ lat, lng }))
        }
    }, [dispatch, liveEvents.length, loading]);

    const refetchEvent = useCallback(() => {
      return dispatch(fetchAllEvents()).unwrap();
    }, [dispatch])

    const create = useCallback((data) => {
      return dispatch(createEvent(buildEventFormData(data))).unwrap();
    }, [dispatch])
    

     const getEventById = useCallback((id) => {
       return dispatch(fetchEventById(id)).unwrap();
     }, [dispatch]);
    const update = useCallback(({data, id}) => {
        console.log("id", id)
        console.log("data", data)
        return dispatch(updateEvent({eventId: id, data: buildEventFormData(data)})).unwrap()
    },[dispatch])
    const delEvent = useCallback((id) => {
      return dispatch(deleteEvent(id)).unwrap();
    },[dispatch]);
    const cohost = useCallback(
      ({eventId, data}) => {
        return dispatch(updateCoHost({eventId, data}))
      },
      [dispatch]
    );

     const invitations  = useCallback(
      ({eventId, data}) => {
        return dispatch(inviteUsers({eventId, data}))
      },
      [dispatch]
    );

     const cancel = useCallback(
      (eventId) => {
        return dispatch(cancelEvent({eventId}))
      },
      [dispatch]
    );

     const publishEvent = useCallback(
      (eventId) => {
        return dispatch(activateEvent(eventId))
      },
      [dispatch]
    );

     const userConfimation  = useCallback(
      ({eventId, data}) => {
        return dispatch(respondInvitation({eventId, data}))
      },
      [dispatch]
    );

    return {
      liveEvents,
      currentEvent,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      error,
      getEventById,
      update,
      create,
      delEvent,
      refetchEvent,
      cohost,
      publishEvent,
      cancel,
      invitations,
      userConfimation,
      cohostLoading,
      statusLoading,
      invitationLoading,
      pastEvents,
      liveEventsPreview
    };

    

};

export default useEvents;

