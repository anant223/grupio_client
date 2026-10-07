import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Pencil, Share2, Globe, ExternalLinkIcon, ExternalLink } from "lucide-react";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import useCategory from "@/hooks/useCategory";
import { Link } from "react-router-dom";
import Badge from "@/components/my-ui/Badge";
import { clearRegisteredEvents } from "@/app/slices/registerSlice";





const PLATFORMS = {
  linkedin: { icon: FaLinkedin, label: "LinkedIn" },
  instagram: { icon: FaInstagram, label: "Instagram" },
  twitter: { icon: FaXTwitter, label: "X/twitter" },
  x: { icon: FaXTwitter, label: "X" },
};

const prettyUrl = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const tap = { whileTap: { scale: 0.97 } };
const spring = { type: "spring", stiffness: 320, damping: 22 };

const RENDER_LIMIT = 4;



export default function ProfileInfo({
  name,
  bio,
  location,
  socialLinks,
  interests,
  preferred,
  eventsHosted = 0,
  isOwnProfile,
  onEditProfile,
  onContactInfo,
}) {
  const { categories, isCategoryLoading } = useCategory();
 

  const tags = useMemo(() => {
    const preferredIds = new Set((preferred ?? []).map(String));
    const seen = new Set();
    const result = [];

    const add = (key, label, color) => {
      const id = label?.trim().toLowerCase();
      if (!id || seen.has(id)) return;
      seen.add(id);
      result.push({ key, label, color });
    };

    (categories ?? []).forEach((c) => {
      if (preferredIds.has(String(c._id))) add(c._id, c.name, c.color);
    });
    (interests ?? []).forEach((t) => add(`custom-${t}`, t));

    return result;
  }, [categories, preferred, interests]);

  const links = useMemo(
    () => (socialLinks ?? []).filter((l) => l?.url),
    [socialLinks]
  );
  const other = useMemo(
    () => (socialLinks ?? []).filter((l) => l?.platform === "other"),
    [socialLinks]
  );

  const place = [location?.city, location?.country].filter(Boolean).join(", ");


  const skeletonCount = isCategoryLoading
    ? Math.min(preferred?.length ?? 0, 3)
    : 0;

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* user cancelled */
    }
  }, [name]);

  const showInterests = tags.length > 0 || skeletonCount > 0 || isOwnProfile;
  const showLinks = links.length > 0 || isOwnProfile;



  return (
    <div className="flex flex-col gap-2.5 sm:gap-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1814] leading-tight break-words capitalize">
          {name || "Unnamed user"}
        </h1>

        <div className="flex gap-1.5 shrink-0 pt-0.5">
          {!isOwnProfile && (
            <IconButton label="Edit profile" onClick={onEditProfile}>
              <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
            </IconButton>
          )}
          <IconButton label="Share profile" onClick={handleShare}>
            <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
          </IconButton>
        </div>
      </div>

      {bio ? (
        <p className="text-[15px] text-[#1a1814]/85 leading-snug max-w-prose">
          {bio}
        </p>
      ) : (
        isOwnProfile && (
          <p className="text-[15px] text-[#9a9590] italic leading-snug">
            Add a short bio so people know who you are.
          </p>
        )
      )}

      {(place || true) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {place && (
            <span className="text-sm text-[#9a9590] truncate max-w-full">
              {place}
            </span>
          )}
          <button
            type="button"
            onClick={onContactInfo}
            className="text-sm text-[#e8663c] font-medium hover:underline underline-offset-2"
          >
            Contact info
          </button>
        </div>
      )}

      {other.length > 0 && (
        <Link
          href={other[0]?.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e8663c] hover:underline underline-offset-2 w-fit"
        >
          {prettyUrl(other[0].url)}
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      )}

      {/* ── Events hosted (stat) ─────────────────────────────── */}
      <div className="inline-flex items-baseline gap-1.5 w-fit">
        <span className="text-base font-semibold text-[#1a1814] tabular-nums">
          {eventsHosted}
        </span>
        <span className="text-sm text-[#6b665d]">
          {eventsHosted === 1 ? "Event hosted" : "Events hosted"}
        </span>
      </div>

      {/* ── Interests ────────────────────────────────────────── */}
      {showInterests && (
        <Section
          title="Interests"
          className="mt-2 pt-4 border-t border-black/10"
        >
          {tags.length > 0 || skeletonCount > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.label}
                  variant="default"
                  className="text-[#e8663c] bg-[#e2beb1] border-transparent"
                >
                  {tag.label}
                </Badge>
              ))}
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <span
                  key={`sk-${i}`}
                  aria-hidden="true"
                  className="h-6 w-16 rounded-full bg-black/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9a9590] italic">
              Pick a few interests to get better event suggestions.
            </p>
          )}
        </Section>
      )}

      {/* ── Links ────────────────────────────────────────────── */}
      {showLinks && (
        <Section title="Links" className="mt-2 pt-4 border-t border-black/10">
          {links.filter((l) => l.platform?.toLowerCase() !== "other").length >
          0 ? (
            <div className="flex flex-wrap gap-2.5">
              {links
                .filter((link) => link.platform?.toLowerCase() !== "other")
                .map((link) => {
                  const meta = PLATFORMS[link.platform?.toLowerCase()];
                  return (
                    <LinkRow
                      key={link._id ?? link.url}
                      href={link.url}
                      icon={meta?.icon ?? Globe}
                      label={meta?.label ?? prettyUrl(link.url)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#eceae4] bg-white px-3.5 py-1.5 text-sm font-medium text-[#1a1814] transition-colors hover:border-[#e8663c]/40 hover:bg-[#fff5f1] hover:text-[#e8663c]"
                    />
                  );
                })}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#eceae4] px-4 py-3 text-sm text-[#9a9590]">
              <Globe className="w-4 h-4 shrink-0" strokeWidth={2} />
              <span>Add your website or social links.</span>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

/* ---------------- Small pieces ---------------- */

function IconButton({ label, onClick, children }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...tap}
      transition={spring}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#e5e1d8] text-[#1a1814] hover:bg-[#f5f3ee]"
    >
      {children}
    </motion.button>
  );
}

function Section({ title, className = "", children }) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6b6b] mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function LinkRow({ href, icon: Icon, label }) {
  return (
    <Link
      to={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]/85 hover:text-[#e8663c] transition-colors w-fit"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}