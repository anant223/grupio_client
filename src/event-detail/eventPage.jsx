import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Share2,
  MapPin,
  Calendar,
  Ticket,
  Globe,
  Video,
  Edit,
  UserPlus,
  ChevronLeft,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useEvents  from "@/hooks/useEvents";
import CenteredSpinner from "@/components/common/LoadingSpinner";
import ResponsiveModal from "@/components/my-ui/Sheet";
import { toast } from "sonner";
import useEnroll from "@/hooks/useEnroll";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const PLATFORM_LABELS = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  teams: "Microsoft Teams",
  youtube: "YouTube Live",
  custom: "Custom link",
};

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    draft: "bg-black/[0.07] text-[#6b6966]",
    active: "bg-[#3B6D11]/10 text-[#3B6D11]",
    cancelled: "bg-red-50 text-red-500",
    completed: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
  };
  const labels = {
    draft: "Draft",
    active: "Live",
    cancelled: "Cancelled",
    completed: "Completed",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${map[status] ?? map.draft}`}
    >
      {labels[status] ?? "Draft"}
    </span>
  );
}

// ─── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({ icon, title, sub }) {
  if (!title) return null;
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-black/[0.06] last:border-0">
      <div className="w-9 h-9 rounded-[10px] bg-[#f0ede6] flex items-center justify-center flex-shrink-0">
        <span className="text-[#9a9590]">{icon}</span>
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[14px] font-semibold text-[#1a1814] leading-snug">
          {title}
        </p>
        {sub && (
          <p className="text-[12.5px] text-[#9a9590] mt-0.5 leading-snug">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin flex-shrink-0"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}


function CTACard({
  event,
  isOrganizer,
  onPublish,
  onCancel,
  onEdit,
  onCoHost,
  onRegister,
  isRegistered,
  publishing,
  cancelling,
  registering,
}) {
  const isDraft = event.status === "draft";
  const isActive = event.status === "active";
  const isCancelled = event.status === "cancelled";
  const isCompleted = event.status === "completed";
  const isPaid = event.ticketType === "paid";
  const isFull = event.availableTickets === 0;
  


  return (
    <div className="bg-white rounded-[16px] border border-black/[0.08] overflow-hidden">
      {/* card header */}
      <div className="px-4 py-3 border-b border-black/[0.06] flex items-center justify-between">
        <p className="text-[12px] font-semibold text-[#9a9590] uppercase tracking-wider">
          {isOrganizer ? "Manage event" : "Registration"}
        </p>
        <StatusBadge status={event.status} />
      </div>

      <div className="p-4 flex flex-col gap-3">
        {(isCancelled || isCompleted) && (
          <div className="flex items-center gap-2.5 p-3 bg-[#faf9f7] rounded-[10px]">
            <div className="w-7 h-7 rounded-full bg-[#f0ede6] flex items-center justify-center flex-shrink-0">
              <Calendar size={13} className="text-[#9a9590]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#1a1814]">
                {isCancelled ? "Event cancelled" : "Event ended"}
              </p>
              <p className="text-[12px] text-[#9a9590]">
                {isCancelled
                  ? "This event has been cancelled."
                  : "This event has already taken place."}
              </p>
            </div>
          </div>
        )}

        {/* organizer actions */}
        {isOrganizer && !isCancelled && !isCompleted && (
          <>
            {isDraft && (
              <button
                type="button"
                onClick={onPublish}
                disabled={publishing}
                className="w-full h-11 rounded-xl bg-[#D85A30] text-white text-[13.5px] font-bold hover:bg-[#c04e28] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {publishing ? (
                  <>
                    <Spinner /> Publishing…
                  </>
                ) : (
                  "Publish event →"
                )}
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 h-10 rounded-xl border border-black/[0.1] text-[13px] font-semibold text-[#1a1814] hover:bg-[#f0ede6] transition-all flex items-center justify-center gap-1.5"
              >
                <Edit size={13} /> Edit
              </button>

              {/* <button
                type="button"
                onClick={onCoHost}
                className="flex-1 h-10 rounded-xl border border-black/[0.1] text-[13px] font-semibold text-[#1a1814] hover:bg-[#f0ede6] transition-all flex items-center justify-center gap-1.5"
              >
                <UserPlus size={13} /> Co-hosts
              </button> */}

              {isActive && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={cancelling}
                  className="flex-1 h-10 rounded-xl border border-red-200 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {cancelling ? <Spinner /> : "Cancel"}
                </button>
              )}
            </div>
          </>
        )}

        {/* attendee actions */}
        {!isOrganizer && (
          <>
            {isActive && (
              <>
                <button
                  type="button"
                  onClick={onRegister}
                  disabled={registering || isFull || isRegistered}
                  className="w-full h-11 rounded-xl bg-[#1a1814] text-white text-[13.5px] font-bold hover:bg-[#272420] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <>
                      <Spinner /> Processing…
                    </>
                  ) : isFull ? (
                    "Event full"
                  ) : isRegistered ? (
                    "Already registered"
                  ) : isPaid ? (
                    `Buy ticket · ${event.currency} ${event.price}`
                  ) : event.requireApproval ? (
                    "Request to join"
                  ) : (
                    "Join event"
                  )}
                </button>

                {/* ✅ Optional: Show ticket availability */}
                {isPaid && event.availableTickets !== undefined && (
                  <p className="text-[12px] text-[#9a9590] text-center">
                    {event.availableTickets} tickets left
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Co-host modal ─────────────────────────────────────────────────────────────
function CoHostModal({ open, onOpenChange, eventId, onAdded }) {
  const { cohost } = useEvents();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await cohost({ eventId, data: { hosts: [] } });
      onAdded?.();
      onOpenChange(false);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <div className="p-1">
        <p className="text-[15px] font-semibold text-[#1a1814] mb-1">
          Add co-hosts
        </p>
        <p className="text-[13px] text-[#6b6966] mb-4">
          Co-hosts can only be added before publishing.
        </p>
        {/* replace with your <UserSearch> component */}
        <input
          type="text"
          placeholder="Search by name or username…"
          className="w-full h-11 bg-[#faf9f7] border border-black/[0.12] rounded-[11px] px-3.5 text-[14px] text-[#1a1814] placeholder:text-[#9a9590] outline-none focus:border-[#D85A30] focus:shadow-[0_0_0_3px_rgba(216,90,48,0.11)] mb-4"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          className="w-full h-11 bg-[#1a1814] text-white rounded-xl text-[13.5px] font-bold hover:bg-[#272420] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner /> Adding…
            </>
          ) : (
            "Add co-host"
          )}
        </button>
      </div>
    </ResponsiveModal>
  );
}


export default function EventReadPage({eventId}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isRegistered, isToggling, toggleRegistration, registeredEvents } = useEnroll(eventId);
  const { getEventById, currentEvent, cancel, publishEvent, loading, createLoading: publishing, statusLoading } = useEvents();
  const [coHostOpen, setCoHostOpen] = useState(false);

  // console.log("reg", registeredEvents)

  useEffect(() => {
    const fetchEvent = async () => {
      await getEventById(eventId);
    };
    fetchEvent();
  }, [eventId, statusLoading]);

  const event = currentEvent;
  const isOrganizer = event && (user?._id === event?.organizer?._id);

  const handlePublish = async () => {
    try {
      await publishEvent(eventId);
      toast.success("Event published!")
    } catch (err) {
      toast.error(err?.message || "Failed to publish event");
    }
  };

  const handleCancel = async () => {
    try {
      await cancel(eventId);
    } catch (err) {
      toast.error(err?.message || "Failed to Cancel event");
    }
  };

  const handleShare = () => {
    if (navigator.share)
      navigator.share({ title: event?.title, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };
  const handleRegister = async () => {
    if (!eventId || isToggling) return;

    if (event.availableTickets === 0) {
      toast.error("All seats are sold");
      return;
    }

    try {
      await toggleRegistration(eventId);

      if (isRegistered) {
        toast.success("You've been unregistered from this event");
      } else if (event.requireApproval) {
        toast.success("Request sent to organizer");
      } else if (event.ticketType === "paid") {
        toast.success("Registration confirmed");
      } else {
        toast.success("You're in! See you there 🎉");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Failed to update registration");
    }
  };

  if (loading) return <CenteredSpinner />;
  if (!event)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-[15px] font-medium text-[#1a1814]">
          Event not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-[13px] text-[#D85A30] hover:underline"
        >
          Go back
        </button>
      </div>
    );

  const showLocation =
    event.eventMode === "in_person" || event.eventMode === "hybrid";
  const showOnline =
    event.eventMode === "online" || event.eventMode === "hybrid";

  return (
    <div className="min-h-full bg-[#f0ede6]">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* back + share */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#6b6966] hover:text-[#1a1814] transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#6b6966] hover:text-[#1a1814] transition-colors"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-3">
            <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-[#e8e4dc]">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#e8e4dc] to-[#d4d0c7] flex items-center justify-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b4b0a8"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* organizer */}
            {event?.organizer && (
              <div className="bg-white rounded-[16px] border border-black/[0.08] p-4">
                <p className="text-[11px] font-semibold text-[#9a9590] uppercase tracking-wider mb-3">
                  Presented by
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#e8e4dc] flex items-center justify-center text-[13px] font-bold text-[#6b6966] flex-shrink-0">
                      {event.organizer?.name.split("")[0].toUpperCase()}
                    </div>
                    <p className="text-[14px] font-semibold text-[#1a1814]">
                      {event.organizer?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* co-hosts */}
            {event.hosts?.length > 0 && (
              <div className="bg-white rounded-[16px] border border-black/[0.08] p-4">
                <p className="text-[11px] font-semibold text-[#9a9590] uppercase tracking-wider mb-3">
                  Hosted by
                </p>
                <div className="flex flex-col gap-3">
                  {event.hosts.map((host, i) => {
                    const name = host?.userId?.name || "Co-host";
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e8e4dc] flex items-center justify-center text-[11px] font-bold text-[#6b6966] flex-shrink-0">
                          {name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-medium text-[#1a1814]">
                            {name}
                          </p>
                          {host.status && host.status !== "accepted" && (
                            <p className="text-[11px] text-[#9a9590] capitalize">
                              {host.status}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — title, details, CTA */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* title + category */}
            <div>
              {event.category && (
                <span className="text-[11.5px] font-semibold text-[#D85A30] tracking-wider capitalize">
                  {event.category}
                </span>
              )}
              <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#1a1814] tracking-[-0.04em] leading-tight mt-1">
                {event.title}
              </h1>
            </div>

            {/* details card */}
            <div className="bg-white rounded-[16px] border border-black/[0.08] px-4 divide-y divide-black/[0.06]">
              <DetailRow
                icon={<Calendar size={14} />}
                title={formatDate(event.startDateTime)}
                sub={
                  event.endDateTime
                    ? `Ends ${formatDate(event.endDateTime)}`
                    : null
                }
              />
              {showLocation && event.location?.address && (
                <DetailRow
                  icon={<MapPin size={14} />}
                  title={event.location.address}
                  sub={
                    [event.location.city, event.location.country]
                      .filter(Boolean)
                      .join(", ") || null
                  }
                />
              )}
              {showOnline && (
                <DetailRow
                  icon={<Video size={14} />}
                  title={
                    PLATFORM_LABELS[event.online?.platform] || "Online event"
                  }
                  sub={
                    event.online?.linkVisibility === "attendees_only"
                      ? "Link visible to registered attendees only"
                      : event.online?.link || null
                  }
                />
              )}
              <DetailRow
                icon={<Ticket size={14} />}
                title={
                  event.ticketType === "paid"
                    ? `${event.currency} ${event.price}`
                    : "Free"
                }
                sub={
                  event.ticketType === "paid" && event.totalTickets
                    ? `${event.availableTickets ?? event.totalTickets} of ${event.totalTickets} tickets available`
                    : event.requireApproval
                      ? "Requires organizer approval"
                      : null
                }
              />
            </div>

            <CTACard
              event={event}
              isOrganizer={isOrganizer}
              onPublish={handlePublish}
              onCancel={handleCancel}
              onEdit={() => navigate(`/main/create-form`, { state: { event } })}
              onCoHost={() => setCoHostOpen(true)}
              publishing={publishing}
              cancelling={statusLoading}
              onRegister={handleRegister}
              isRegistered={isRegistered}
              registering={isToggling}
            />
            {/* description */}
            {event.desc && (
              <div className="bg-white rounded-[16px] border border-black/[0.08] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a9590] mb-3">
                  About event
                </p>
                <div
                  className="prose prose-sm max-w-none text-[14px] text-[#6b6966] leading-relaxed [&_h1]:text-[18px] [&_h1]:font-bold [&_h1]:text-[#1a1814] [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:text-[#1a1814] [&_strong]:text-[#1a1814]"
                  dangerouslySetInnerHTML={{ __html: event.desc }}
                />
              </div>
            )}

            {/* tags */}
            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-white border border-black/[0.08] text-[#6b6966] rounded-full text-[12px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Co-host modal */}
      <CoHostModal
        open={coHostOpen}
        onOpenChange={setCoHostOpen}
        eventId={eventId}
        onAdded={() => getEventById(eventId)}
      />
    </div>
  );
}
