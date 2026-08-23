import React, {
  useState,
  useMemo,
  useRef,
  memo,
  useEffect,
} from "react";


import {
  X,
  List,
  Map,
} from "lucide-react";
import { useMapInstance } from "@/hooks/useMapInstance";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventsMarkers } from "@/hooks/useMarkers";
import { fitMapBounds } from "@/utils/fitMapBounds";
import { Badge } from "../ui/badge";
import EventCard from "../Cards/EventCard";
import { LoadingSpinner } from "../common";

const getCategoryColor = (category) => {
  const colors = {
    music: "bg-pink-500/20 text-pink-300",
    art: "bg-red-500/20 text-red-300",
    sports: "bg-orange-500/20 text-orange-300",
    tech: "bg-blue-500/20 text-blue-300",
    food: "bg-yellow-500/20 text-yellow-300",
    education: "bg-purple-500/20 text-purple-300",
    networking: "bg-green-500/20 text-green-300",
    health: "bg-teal-500/20 text-teal-300",
  };
  return colors[category?.toLowerCase()] || "bg-slate-500/20 text-slate-300";
};

const getCategoryEmoji = (category) => {
  const emojis = {
    music: "🎵",
    art: "🎨",
    sports: "⚽",
    tech: "💻",
    food: "🍽️",
    education: "📚",
    networking: "🤝",
    health: "💪",
  };
  return emojis[category?.toLowerCase()] || "🎉";
};

const ALL_CATEGORIES = [
  "music",
  "art",
  "sports",
  "tech",
  "food",
  "education",
  "networking",
  "health",
];

const MapFilters = ({ events, user, onFilterChange }) => {
  const [mode, setMode] = useState("picks"); // "picks" | "all"
  const [activeCategory, setActiveCategory] = useState(null);

  // user's onboarding preferences
  const userCategories = useMemo(() => {
    const prefs = [
      ...(user?.preferredCategories || []),
      ...(user?.interests || []),
    ];
    return [...new Set(prefs.map((c) => c.toLowerCase()))].slice(0, 5);
  }, [user]);

  const displayCategories = mode === "picks" ? userCategories : ALL_CATEGORIES;

  const handleCategoryClick = (cat) => {
    const next = activeCategory === cat ? null : cat;
    setActiveCategory(next);

    // filter events by category
    if (next) {
      onFilterChange(
        events.filter(
          (e) =>
            e.category?.toLowerCase() === next ||
            e.tags?.some((t) => t.toLowerCase() === next)
        )
      );
    } else {
      onFilterChange(events); // show all
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setActiveCategory(null);
    onFilterChange(events); // reset filter on mode switch
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* My Picks / All toggle */}
      <div
        style={{
          display: "inline-flex",
          background: "rgba(242,238,231,0.92)",
          border: "0.5px solid rgba(255,255,255,0.75)",
          borderRadius: 100,
          padding: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        }}
      >
        {["picks", "all"].map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            style={{
              padding: "4px 12px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              transition: "all 0.15s",
              background: mode === m ? "#1a1814" : "transparent",
              color: mode === m ? "white" : "#888",
            }}
          >
            {m === "picks" ? "My Picks" : "All"}
          </button>
        ))}
      </div>

      {/* category pills */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: 320 }}>
        <AnimatePresence mode="popLayout">
          {displayCategories.map((cat, i) => {
            const color = getCategoryColor(cat);
            const emoji = getCategoryEmoji(cat);
            const isActive = activeCategory === cat;

            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.03, duration: 0.15 }}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "5px 11px",
                  borderRadius: 100,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? color : "rgba(242,238,231,0.92)",
                  color: isActive ? "white" : "#3d3a34",
                  boxShadow: isActive
                    ? `0 2px 8px ${color}40`
                    : "0 2px 6px rgba(0,0,0,0.07)",
                  border: isActive
                    ? "none"
                    : "0.5px solid rgba(255,255,255,0.75)",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 12 }}>{emoji}</span>
                <span style={{ textTransform: "capitalize" }}>{cat}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* no picks fallback */}
        {mode === "picks" && userCategories.length === 0 && (
          <span style={{ fontSize: 11, color: "#999", padding: "5px 4px" }}>
            Complete onboarding to see your picks
          </span>
        )}
      </div>
    </div>
  );
};


const CategoryBar = ({ events, activeCategory, onSelect }) => {
  const categories = [
    "all",
    ...new Set(events.map((e) => e.category?.toLowerCase()).filter(Boolean)),
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 mb-3"
      style={{ scrollbarWidth: "none" }}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const color = getCategoryColor(cat);
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border-none cursor-pointer text-[11px] font-medium capitalize transition-all"
            style={{
              background: isActive ? color : "rgba(0,0,0,0.06)",
              color: isActive ? "white" : "#555",
              boxShadow: isActive ? `0 2px 8px ${color}40` : "none",
            }}
          >
            {cat !== "all" && <span>{getCategoryEmoji(cat)}</span>}
            {cat === "all" ? "All" : cat}
          </button>
        );
      })}
    </div>
  );
};

const EventBottomSheet = ({ eventLength, onClose, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AnimatePresence>
      {eventLength > 0 && (
        <>
          {/* backdrop — only when expanded */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
              onClick={() => setIsExpanded(false)}
            />
          )}

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute font-roboto capitalize bottom-0 left-0 right-0 z-30 flex flex-col bg-[rgba(242,238,231,0.98)] rounded-t-[20px] shadow-[0_-4px_32px_rgba(0,0,0,0.12)] overflow-hidden"
            style={{
              height: isExpanded ? "95vh" : "90px",
              transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* ── Always visible peek area ── */}
            <div className="px-4 pt-3 flex-shrink-0">
              {/* drag handle */}
              <div
                className="flex justify-center mb-2.5 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="w-9 h-1 bg-black/15 rounded-full" />
              </div>

              {/* count row — always visible */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#1a1814]">
                    Events nearby
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {eventLength} event{eventLength === 1 ? "" : "s"} in your
                    area
                  </p>
                </div>

                {/* close — only when expanded */}
                {isExpanded && (
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-black/[0.07] border-none flex items-center justify-center cursor-pointer"
                  >
                    <X size={13} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Content — only when expanded ── */}
            {isExpanded && (
              <div className="overflow-y-auto flex-1 px-4 pt-3 pb-6">
                {eventLength > 0 ? (
                  children
                ) : (
                  <div className="text-center py-6">
                    <p className="text-2xl mb-2">🗺️</p>
                    <p className="text-xs text-gray-400">No events nearby</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EventListCardMobile = ({ event, index = 0 }) => {
  const navigate = useNavigate();

  const dateLabel = event.startDateTime
    ? new Date(event.startDateTime)
        .toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .toUpperCase()
    : "DATE TBD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/main/events/${event._id}`)}
      className="flex gap-3 py-3 border-b border-black/5 cursor-pointer last:border-b-0 font-roboto"
    >
    Hell
      {/* image */}
      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-2xl"
            style={{ background: `${getCategoryColor(event.category)}15` }}
          >
            {getCategoryEmoji(event?.category)}
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* date */}
        <p className="text-[10px] font-semibold text-gray-400 tracking-wide mb-0.5">
          {dateLabel}
        </p>

        {/* title */}
        <p className="text-[13px] font-semibold text-[#1a1814] leading-snug mb-1 capitalize">
          {event.title}
        </p>

        {/* distance / location */}
        {event.location?.address && (
          <p className="text-[11px] text-gray-400 capitalize">
            {event?.location?.address}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const EventMiniPreview = ({ event, onClose, onExpand }) => {
  const navigate = useNavigate();
  if (!event) return null;

  const color = getCategoryColor(event.category);
  const emoji = getCategoryEmoji(event.category);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="absolute bottom-0 left-0 right-0 z-30 bg-[rgba(242,238,231,0.98)] rounded-t-[20px] shadow-[0_-4px_32px_rgba(0,0,0,0.12)]"
        >
          <div className="px-4 pt-3 pb-6 relative">
            {/* drag handle → expands to full list */}
            <div
              className="flex justify-center mb-3 cursor-pointer"
              onClick={onExpand}
            >
              <div className="w-9 h-1 bg-black/15 rounded-full" />
            </div>

            {/* close */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-4 w-7 h-7 rounded-full bg-black/[0.07] border-none flex items-center justify-center cursor-pointer"
            >
              <X size={13} className="text-gray-500" />
            </button>

            {/* event info */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl"
                style={{ background: `${color}18` }}
              >
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  emoji
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1a1814] truncate mb-0.5">
                  {event.title}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                    style={{ background: `${color}15`, color }}
                  >
                    {event.category}
                  </span>
                  {event.startDateTime && (
                    <p className="text-[11px] text-gray-400">
                      {new Date(event.startDateTime).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate(`/main/events/${event._id}`)}
              className="w-full py-3 bg-[#1a1814] border-none rounded-2xl text-[13px] font-semibold text-white cursor-pointer"
            >
              View Event →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Single Event Grid Card ───────────────────────────────────────────────────


// ─── Desktop List Panel ───────────────────────────────────────────────────────
const DesktopSplitPanel = ({
  events,
  onClose,
  highlightedId,
  onHover,
  onLeave,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = events.map((e) => e.category?.toLowerCase()).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [events]);

  const filtered = useMemo(() => {
    return activeCategory === "all"
      ? events
      : events.filter((e) => e.category?.toLowerCase() === activeCategory);
  }, [events, activeCategory]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="relative z-20 flex flex-col w-1/2 h-full top-20"
    >
      <h1 className="text-2xl font-bold">
        <span>{events?.length} Events</span> <span>Nearby you</span>
      </h1>
      <div className="flex-1 overflow-y-auto pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-[13px] text-gray-400">
              No events in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.2 }}
              >
                <EventGridCard
                  event={event}
                  isHighlighted={highlightedId === event._id}
                  onHover={onHover}
                  onLeave={onLeave}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const GeoMap = memo(
  ({ events = [], location, user, loading, eventPreview, pageInfo }) => {
    const [showList, setShowList] = useState(false);
    const [markerEvents, setMarkerEvents] = useState(null);

    const coordinates = location?.coordinates;

    const [currentCenter, setCurrentCenter] = useState({
      lat: coordinates?.[1] || null,
      lng: coordinates?.[0] || null,
    })

    const [currentPage, setCurrentPage] = useState(0);

    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);



    const { mapContainerRef, mapRef, loadError, isMapReady } = useMapInstance({
      coordinates,
      onBoundsChange: ({ lat, lng }) => {
        setCurrentCenter({lng, lat})
        setCurrentPage(1)
        eventPreview({ lat, lng});
      },
    });

    const onMarkerClick = ({ events: groupEvents }) => {
      setMarkerEvents(groupEvents);
      setShowList(true);
    };
    console.log("Events", events);
    useEventsMarkers({
      events,
      mapRef,
      isMapReady,
      onMarkerClick,
    });

    const isMobile = useIsMobile(768);
    const displayedEvents = markerEvents || events;

    useEffect(() => {
      if(!loaderRef.current) return;
      const hasMorePages = pageInfo?.number < pageInfo?.totalPages - 1
      const hasCenter = currentCenter.lat && currentCenter.lng;

      const observer = new IntersectionObserver((entries)=>{
        const first = entries[0]

        if (first.isIntersecting && !isFetchingRef.current && !loading && hasMorePages && hasCenter) {
          
          isFetchingRef.current = true;

          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          eventPreview({
            lat: currentCenter.lat,
            lng: currentCenter.lng,
            page: nextPage,
            radius: 50,
            size: 50,
          });
        }
        if (!first.isIntersecting) {
          isFetchingRef.current = false;
        }

      }, {threshold:0.1})

      observer.observe(loaderRef.current)
      return () => observer.disconnect(); 
    },[pageInfo, currentPage, currentCenter, isFetchingRef, loading])

    useEffect(() => {

      if (!mapRef.current) return;

      const timer = setTimeout(() => {
        mapRef.current?.resize();
        fitMapBounds({ map: mapRef.current, events: displayedEvents });
      }, 520);

      return () => clearTimeout(timer);
    }, [showList]);
    return (
      <div
        className="w-full h-screen flex p-1 md:pb-24 md:px-8 md:pt-6 gap-4
        bg-[#f0ede6] relative overflow-hidden"
      >
        <AnimatePresence>
          {!isMobile && showList && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "50%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="hidden md:flex flex-col md:w-full lg:w-[720px] flex-shrink-0 bg-white overflow-hidden rounded-3xl shadow-[4px_0_28px_-6px_rgba(0,0,0,0.08)] relative z-10"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
                <div>
                  <p className="text-[#1a1814] text-sm font-medium">
                    {user?.location?.city}
                    {user?.location?.city && user?.location?.country && " • "}
                    {user?.location?.country}
                  </p>
                  <span className="text-xs text-[#9b9890]">
                    {displayedEvents?.length ?? 0} event
                    {displayedEvents?.length === 1 ? "" : "s"}
                  </span>
                </div>

                {markerEvents && (
                  <Badge className="bg-[#1a1814] hover:bg-[#26231e] text-white text-xs gap-1 pr-1.5">
                    <span>📍 {markerEvents[0]?.location?.address}</span>
                    <button
                      onClick={() => setMarkerEvents(null)}
                      className="ml-1 hover:opacity-70 transition-opacity"
                      aria-label="Clear selected location"
                    >
                      ✕
                    </button>
                  </Badge>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {displayedEvents?.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {displayedEvents.map((event) => (
                      <EventCard key={event?.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-16">
                    <p className="text-[#1a1814] font-medium">
                      No events nearby
                    </p>
                    <p className="text-sm text-[#9b9890] max-w-[28ch]">
                      Try zooming out on the map or checking back later.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isMobile && (
          <EventBottomSheet eventLength={events?.length}>
            {events?.map((event) => (
              <EventListCardMobile key={event._id} event={event} />
            ))}
          </EventBottomSheet>
        )}
        <div className="flex-1 relative overflow-hidden rounded-3xl">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full"
          />
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute z-30 bottom-1 left-2 hidden md:block transition-[left] duration-350 ease-in-out"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowList(!showList)}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-[rgba(242,238,231,0.95)] border border-white/80 rounded-full cursor-pointer shadow-lg backdrop-blur-xl"
              >
                {showList ? (
                  <Map size={14} className="text-[#1a1814]" />
                ) : (
                  <List size={14} className="text-[#1a1814]" />
                )}
                <span className="text-[12px] font-semibold text-[#1a1814]">
                  {showList ? "Show map" : "Show list"}
                </span>
                <span className="bg-[#1a1814] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {events?.length ?? 0} events
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

GeoMap.displayName = "GeoMap";

export default GeoMap;

