import React from "react";
import {NotificationItem} from "./index"
import { clearRegisteredEvents } from "@/app/slices/registerSlice";


const NotificationList = ({
  notifications,
  onMarkRead,
  onDismiss,
  fetchLoading,
  hasMorePages,
  onLoadMore,
}) => {
  if (fetchLoading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-gray-400 font-medium">Loading notifications...</p>
      </div>
    );
  }
  console.log(notifications)
  if (notifications?.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔔</div>
        <p className="text-[#111827] font-medium">No notifications here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      { 
        notifications
        .map(
          (notification) => {
            
            return <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
            />
          }
        )
      }

      {/* Load More Button */}
      {hasMorePages && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          {loadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            "Load more"
          )}
        </button>
      )}
    </div>
  );
};

export default NotificationList;
