import React, { useCallback, useEffect } from 'react'
import {fetchNotifications, deleteNotification, markAllNotificationsAsRead, markNotificationAsRead } from "@/features/notificationAction"
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllNotifications,
  selectCurrentPage,
  selectDeleteLoading,
  selectFetchLoading,
  selectHasMorePages,
  selectMarkAsReadLoading,
  selectUnReadCount,
} from "@/app/selector/notificationSelector";
import socketConfig from '@/socket/config';
import { selectUser } from '@/app/selector/authSelector';
import { addNotification } from '@/app/slices/notificationSlice';


const useNotifications = () => {
   const dispatch = useDispatch();
   const user = useSelector(selectUser);

   const notifications = useSelector(selectAllNotifications);
   const unReadCount = useSelector(selectUnReadCount);
   const currentPage = useSelector(selectCurrentPage);
   const hasMorePages = useSelector(selectHasMorePages);
   const fetchLoading = useSelector(selectFetchLoading);
   const deleteLoading = useSelector(selectDeleteLoading);
   const markAsReadLoading = useSelector(selectMarkAsReadLoading);

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    if (!user?._id) return;
    const handleNewNotification = (notification) => {
      dispatch(addNotification(notification));
    };

    const handlePendingNotification = (notifications) => {
      notifications.forEatch(notiy => dispatch(addNotification(notiy)))
    }

    socketConfig.on("notification:new", handleNewNotification);
    socketConfig.on("notification:pending", handlePendingNotification)

    return () => {
      socketConfig.off("notification:new", handleNewNotification);
      socketConfig.off("notification:pending", handlePendingNotification);
    };
  }, [user?._id, dispatch]);

  const loadMore = useCallback(() => {
    if (hasMorePages) {
      dispatch(fetchNotifications({ page: currentPage + 1 }));
    }
  }, [dispatch, currentPage, hasMorePages]);

  const markAsRead = useCallback((notificationId) => 
    dispatch(markNotificationAsRead(notificationId))
  , [dispatch])

  const markAllAsRead = useCallback(
    () => dispatch(markAllNotificationsAsRead()),
    [dispatch]
  );
  const removeNotification = useCallback(
    (notificationId) => dispatch(deleteNotification(notificationId)),
    [dispatch]
  );

  return {
    notifications,
    unReadCount,
    currentPage,
    hasMorePages,
    
    fetchLoading,
    deleteLoading,
    markAsReadLoading,
    
    loadMore,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };;
}

export default useNotifications
