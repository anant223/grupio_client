import Badge from '@/components/my-ui/Badge';
import { AnimatePresence, motion } from 'framer-motion';
import EventCard from './EventCard';
import React from 'react' 

const EventListPanel = ({user, markerEvents, displayedEvents, isOpen, onClearMarker}) => {

  return (
    <AnimatePresence>
      {isOpen && (
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
                  onClick={() => onClearMarker(null)}
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
                <p className="text-[#1a1814] font-medium">No events nearby</p>
                <p className="text-sm text-[#9b9890] max-w-[28ch]">
                  Try zooming out on the map or checking back later.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EventListPanel
