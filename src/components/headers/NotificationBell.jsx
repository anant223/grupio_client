import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import useNotifications from "@/hooks/useNotifications";
import { transformNotification } from "@/utils/constant";

const NotificationBell = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unReadCount,
    fetchLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const transformed = useMemo(
    () =>
      notifications.slice(0, 5).map((notif) => transformNotification(notif)),
    [notifications]
  );

  const handleClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {/* ✅ unread badge */}
          {unReadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unReadCount > 9 ? "9+" : unReadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unReadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-auto py-1"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        <Separator />

        {/* List */}
        <ScrollArea className="max-h-96">
          {fetchLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : transformed.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            transformed.map((notif) => (
              <div key={notif.id}>
                <div
                  onClick={() => handleClick(notif)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notif.read ? "bg-orange-500/5" : ""
                  }`}
                >
                  {/* avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base overflow-hidden"
                    style={{ backgroundColor: `${notif.color}18` }}
                  >
                    {notif.avatar?.startsWith("http") ? (
                      <img
                        src={notif.avatar}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      notif.avatar
                    )}
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {notif.time}
                    </p>
                  </div>

                  {/* unread dot */}
                  {!notif.read && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ backgroundColor: notif.color }}
                    />
                  )}
                </div>
                <Separator />
              </div>
            ))
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground"
            onClick={() => navigate("/main/notifications")}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
