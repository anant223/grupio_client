import React from "react";

const NotificationItem = ({ notification,onMarkRead,onDismiss, }) => (
    <div
        className="relative flex items-start gap-4 bg-white rounded-2xl px-4 py-4 shadow-sm cursor-pointer"
        style={{
            borderLeft: !notification.read
                ? `3px solid ${notification.color}`
                : "3px solid transparent",
        }}
        onClick={() => onMarkRead(notification.id)}
    >
        <div
            className="flex items-center justify-center w-11 h-11 rounded-full shrink-0 text-xl overflow-hidden"
            style={{ backgroundColor: `${notification.color}18` }}
        >
            {notification.avatar?.startsWith("http")
                ? <img 
                    src={notification.avatar} 
                    alt="" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                : notification.avatar
            }
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {notification.title}
                </p>
                {!notification.read && (
                    <span
                        className="dot-pulse w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: notification.color }}
                    />
                )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {notification.message}
            </p>
            <p className="text-xs text-gray-300 mt-1.5 font-medium">
                {notification.time}
            </p>
        </div>

        <button
            className="dismiss-btn shrink-0 text-gray-300 hover:text-gray-500 mt-0.5"
            onClick={(e) => {
                e.stopPropagation();
                onDismiss(notification.id);
            }}
        >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </button>
    </div>
);

export default NotificationItem;
