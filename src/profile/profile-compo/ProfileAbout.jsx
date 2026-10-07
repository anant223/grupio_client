import { Calendar, Plus} from "lucide-react";

function formatJoined(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null; // invalid date guard
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}


export default function ProfileAbout({ bio, joinedAt, isOwnProfile = true }) {
  const joined = formatJoined(joinedAt);

  return (
    <section className="mt-5 md:mt-8">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <h2 className="shrink-0 text-xl md:text-2xl font-bold text-[#1a1a1a]">
          About
        </h2>

        <div className="h-px flex-1 bg-[#e6e0d4]" />
      </div>

      {/* Bio */}
      {bio ? (
        <p className="max-w-2xl text-[15px] md:text-base text-[#1a1a1a]/85 leading-relaxed whitespace-pre-line">
          {bio}
        </p>
      ) : isOwnProfile ? (
        <p className="max-w-2xl text-[15px] text-[#9a9590] italic leading-relaxed">
          Add a bio to tell people about yourself.
        </p>
      ) : (
        <p className="max-w-2xl text-[15px] text-[#9a9590] italic leading-relaxed">
          No bio added yet.
        </p>
      )}

      {joined && (
        <div className="mt-5 flex items-center gap-2 text-sm text-[#6b6b6b]">
          <Calendar className="w-4 h-4 shrink-0" strokeWidth={1.8} />

          <span>Joined {joined}</span>
        </div>
      )}
    </section>
  );
}
