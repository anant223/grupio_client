import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (event.source === "ticketmaster") {
          window.open(event.externalUrl, "_blank", "noopener,noreferrer");
        } else {
          navigate(`/main/event/${event._id}`);
        }
      }}
      className="bg-white border border-[#e8e4dc] rounded-[14px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-56">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 bg-white text-xs font-medium px-3 py-1 rounded-full shadow text-[#1a1814] flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live event
        </div>
        {/* Category Tag */}
        {event.category && (
          <div className="absolute bottom-4 left-4 bg-[#1a1814]/80 text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
            {event?.category}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[17px] leading-tight text-[#1a1814] line-clamp-1">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">{event.location?.address}</p>

        <p className="text-sm text-gray-600 mt-1">
          {new Date(event.startDateTime).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        <div className="mt-4 flex items-center justify-end">
          <span className="text-xs bg-[#D85A30]/10 text-[#D85A30] px-3 py-1 rounded-full font-medium">
            {event.source === "ticketmaster" ? "Get tickets" : "View event"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
