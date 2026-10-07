import { useState } from "react";
import ProfileAbout from "./profile-compo/ProfileAbout";
import useAuth from "@/hooks/useAuth";
import ProfileImage from "./profile-compo/ProfileImage";
import ProfileInfo from "./profile-compo/ProfileInfo";
import { Link } from "react-router-dom";
import { ArrowRight} from "lucide-react";
import EventCard from "./profile-compo/EventCard";


const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
};

const LAYOUT_BY_TAB = {
  // Own profile
  going: "row",
  attended: "grid",
  hosting: "row",
  saved: "row",
  // Other's profile
  upcoming: "row",
  past: "grid",
};

const isPast = (iso) => new Date(iso) < new Date();

const RENDER_LIMIT = 4

export default function ProfilePage({id}) {
  const {user, authLoading, userEvents} = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming");
  const isOwn = Boolean(user._id) && String(user._id) === String(id);

  const { pastOrganizedEvents } = userEvents ?? [];

  if (Array.isArray(pastOrganizedEvents) && pastOrganizedEvents?.length === 0) {
      return (
        <EmptyState
          title={EMPTY_COPY[variant]?.title ?? "Nothing here yet"}
          description={EMPTY_COPY[variant]?.desc}
        />
      );
    }
    const visible = pastOrganizedEvents?.slice(0, RENDER_LIMIT);
    const hasMore = pastOrganizedEvents?.length > RENDER_LIMIT;


  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 sm:items-start">
          <div className="md:col-span-5 min-w-0 flex  flex-col justify-center md:justify-start">
            <ProfileImage avatar={user?.avatar} name={user?.name} />
          </div>
          <div className="md:col-span-7 flex flex-col gap-4 w-full">
            <ProfileInfo
              name={user?.name}
              bio={user?.bio}
              location={user?.location}
              socialLinks={user?.socialLinks}
              interests={user?.interests}
              preferred={user?.preferredCategories}
              // eventsHosted={eventsHosted}
              isOwnProfile={isOwn}
            />
          </div>
        </section>

        <ProfileAbout
          joinedAt={user?.createdAt}
          bio={user?.bio}
          isOwnProfile={isOwn}
        />

        <div className=" mt-8 ">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold text-[#1a1814]">
              Past Orgnized Events
            </h2>
            {!hasMore && (
              <Link
                to={`/profile/events?tab=past`}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#1a1814] hover:text-[#e8663c] transition-colors"
              >
                See all
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-col">
            {Array.isArray(pastOrganizedEvents) &&
              pastOrganizedEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}