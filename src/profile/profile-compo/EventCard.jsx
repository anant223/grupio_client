import { MapPin, ImageOff } from "lucide-react";



const STATUS_STYLES = {
  completed: "bg-[#e8f3ea] text-[#2f8f4e]",
  cancelled: "bg-[#fbe4d8] text-[#c24b2c]",
  draft: "bg-[#f0ece2] text-[#6b6b6b]",
  published: "bg-[#fbe4d8] text-[#e8663c]",
};

function formatEventDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventListCard({ event }) {
  const {
    title,
    image,
    location,
    status,
    startDateTime,
    organizers = [],
    extraCount = 0,
  } = event || {};

  const date = formatEventDate(startDateTime);
  const visibleAvatars = organizers.slice(0, 3);
  const names = organizers?.map((o) => o.name).join(", ");
  const statusStyle = STATUS_STYLES[status] ?? "bg-[#f0ece2] text-[#6b6b6b]";

  return (
    <div className="flex items-center gap-4 py-3 cursor-pointer group">
      {/* Event image */}
      <div className="w-16 h-16 shrink-0 overflow-hidden bg-[#f0ece2]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        <ImageOff
          className="w-5 h-5 text-[#9a9792] m-auto"
          strokeWidth={1.6}
          style={{ display: image ? "none" : "flex" }}
        />
      </div>

      {/* Event information */}
      <div className="min-w-0 flex-1">
        {/* Date */}
        <div className="text-[13px] text-[#6b6b6b] mb-1">{date}</div>

        {/* Title */}
        <h3 className="text-[16px] font-semibold text-[#1a1a1a] leading-snug truncate group-hover:text-[#e8663c] transition-colors">
          {title}
        </h3>

        {/* Organizers */}
        {organizers.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1 min-w-0">
            <div className="flex -space-x-1.5 shrink-0">
              {visibleAvatars.map((o, i) => (
                <img
                  key={o.name + i}
                  src={o.avatarUrl}
                  alt=""
                  className="w-4 h-4 rounded-full border border-[#f5f2eb] object-cover"
                />
              ))}
            </div>

            <span className="text-[13px] text-[#6b6b6b] truncate">
              By {names}
              {extraCount > 0 && ` & ${extraCount} ...`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
