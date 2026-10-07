import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "tech",
  "business",
  "health",
  "education",
  "entertainment",
  "sports",
  "other",
];
const CURRENCIES = ["INR", "USD"];



// ─── tiny primitives ──────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-medium tracking-[0.06em] uppercase text-[#9b9890] mb-1.5">
    {children}
  </label>
);

const PanelInput = ({ className, ...props }) => (
  <input
    {...props}
    className={cn(
      "w-full bg-white border border-black/[0.12] rounded-xl px-3 py-2.5",
      "text-[13px] text-[#1a1814] placeholder:text-[#9b9890]",
      "outline-none focus:border-black/40 transition-colors font-[inherit]",
      className
    )}
  />
);

const ToggleChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex-1 py-2 rounded-xl text-[12px] font-medium border transition-all cursor-pointer",
      active
        ? "bg-[#1a1814] text-[#f2eee7] border-[#1a1814]"
        : "bg-transparent text-[#9b9890] border-black/12"
    )}
  >
    {label}
  </button>
);

const CategoryChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer",
      active
        ? "bg-[#1a1814] text-[#f2eee7] border-[#1a1814]"
        : "bg-transparent text-[#6b6966] border-black/12"
    )}
  >
    {label}
  </button>
);

// ─── toolbar icon button ──────────────────────────────────────────────────────

const ToolBtn = ({ active, title, onClick, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      "w-9 h-9 rounded-xl border-none cursor-pointer flex items-center justify-center transition-colors",
      active
        ? "bg-[#f0ede6] text-[#1a1814]"
        : "bg-transparent text-[#9b9890] hover:bg-[#f0ede6] hover:text-[#1a1814]"
    )}
  >
    {children}
  </button>
);

// ─── location autocomplete ────────────────────────────────────────────────────

const LocationInput = ({ value, onChange }) => {
  const [query, setQuery] = useState(value?.address ?? "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef();

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q.trim())}.json?access_token=${token}&limit=5`
      );
      const data = await res.json();
      setResults(data.features ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(e.target.value), 350);
  };

  const select = (feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    onChange({ address: feature.place_name, lat, lng, locationId: feature.id });
    setQuery(feature.place_name);
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9890]"
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2C5.2 2 3 4.2 3 7c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2.2-5-5-5z" />
          <circle cx="8" cy="7" r="1.5" />
        </svg>
        <Input
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search address or 'Online'"
          className="pl-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-[#9b9890] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/[0.09] rounded-xl overflow-hidden z-50 shadow-sm"
          >
            {results.map((f) => (
              <button
                key={f.id}
                type="button"
                onMouseDown={() => select(f)}
                className="w-full text-left px-3 py-2.5 hover:bg-[#f8f7f5] transition-colors border-none bg-transparent cursor-pointer"
              >
                <p className="text-[13px] font-medium text-[#1a1814] truncate">
                  {f.text}
                </p>
                <p className="text-[11px] text-[#9b9890] truncate">
                  {f.place_name}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const TagInput = ({ value = [], onChange }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const tag = input.trim().toLowerCase();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInput("");
  };
  return (
    <div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0ede6] rounded-full text-[11px] text-[#1a1814] border border-black/10"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== t))}
                className="text-[#9b9890] bg-none border-none cursor-pointer p-0 leading-none hover:text-[#1a1814]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <PanelInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a tag and press Enter…"
          className="flex-1"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-xl bg-[#f0ede6] text-[#1a1814] text-[12px] font-medium border border-black/10 cursor-pointer shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// ─── expandable panel ─────────────────────────────────────────────────────────

const Panel = ({ open, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="bg-[#f8f7f5] rounded-2xl p-4 mt-2">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── meta pill (shows in body when filled) ────────────────────────────────────

const MetaPill = ({ icon, label, onRemove }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ede6] border border-black/[0.08] rounded-full text-[12px] font-medium text-[#1a1814]">
    {icon}
    <span>{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="text-[#9b9890] bg-none border-none cursor-pointer p-0 ml-0.5 hover:text-[#1a1814] leading-none"
    >
      ×
    </button>
  </div>
);

// ─── composer content (shared between modal + drawer) ────────────────────────

export default ComposerContent = ({ onClose, onSuccess, user }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      desc: "",
      image: null,
      category: "other",
      startDateTime: "",
      endDateTime: "",
      location: null,
      eventType: "public",
      ticketType: "free",
      price: "",
      currency: "INR",
      totalTickets: "",
      requireApproval: false,
      tags: [],
    },
  });

  const imgRef = useRef();
  const titleRef = useRef();

  const [activePanel, setActivePanel] = useState(null); // "location" | "date" | "ticket" | "more"
  const [showCats, setShowCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const title = watch("title");
  const location = watch("location");
  const startDT = watch("startDateTime");
  const ticketType = watch("ticketType");
  const eventType = watch("eventType");
  const image = watch("image");
  const category = watch("category");

  const togglePanel = (name) =>
    setActivePanel((prev) => (prev === name ? null : name));

  const fmtDate = (v) =>
    v
      ? new Date(v).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setValue("image", { file, preview: ev.target.result });
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data, status = "active") => {
    status === "draft" ? setSavingDraft(true) : setSubmitting(true);
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("desc", data.desc || " ");
    fd.append("category", data.category);
    fd.append("startDateTime", data.startDateTime);
    fd.append("endDateTime", data.endDateTime);
    fd.append("eventType", data.eventType);
    fd.append("ticketType", data.ticketType);
    fd.append("price", data.price || 0);
    fd.append("currency", data.currency);
    fd.append("requireApproval", data.requireApproval);
    fd.append("status", status);
    if (data.image?.file) fd.append("image", data.image.file);
    if (data.location) {
      fd.append("location[address]", data.location.address);
      if (data.location.lat) fd.append("location[lat]", data.location.lat);
      if (data.location.lng) fd.append("location[lng]", data.location.lng);
      if (data.location.locationId)
        fd.append("locationId", data.location.locationId);
    }
    if (data.totalTickets) fd.append("totalTickets", data.totalTickets);
    data.tags.forEach((t) => fd.append("tags[]", t));
    try {
      // await dispatch(createEvent(fd)).unwrap();
      onSuccess?.();
      onClose?.();
    } finally {
      setSubmitting(false);
      setSavingDraft(false);
    }
  };

  const canPost = title?.trim().length >= 3;

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d, "active"))}>
      <div className="flex flex-col h-full">
        {/* ── header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.07] shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-[#1a1814] text-[#f2eee7] text-base font-medium">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[14px] font-medium text-[#1a1814] capitalize leading-tight">
                {user?.name ?? "You"}
              </p>
              {/* visibility toggle */}
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value === "public" ? "private" : "public"
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-medium text-[#9b9890] bg-[#f0ede6] border-none rounded-full px-2.5 py-0.5 cursor-pointer mt-0.5"
                  >
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {field.value === "public" ? (
                        <>
                          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                          <circle cx="8" cy="8" r="2" />
                        </>
                      ) : (
                        <>
                          <rect x="3" y="7" width="10" height="8" rx="1.5" />
                          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                        </>
                      )}
                    </svg>
                    {field.value === "public"
                      ? "Public event"
                      : "Private event"}
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6l5 5 5-5" />
                    </svg>
                  </button>
                )}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center border-none cursor-pointer text-[#9b9890] hover:text-[#1a1814] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {/* title */}
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
                ref={titleRef}
                rows={1}
                placeholder="What's your event called?"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="w-full border-none outline-none text-[18px] font-medium text-[#1a1814] bg-transparent resize-none placeholder:text-[#c0bdb8] font-[inherit] leading-snug"
              />
            )}
          />

          {/* desc */}
          <Controller
            name="desc"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder="Tell people what to expect…"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="w-full border-none outline-none text-[14px] text-[#6b6966] bg-transparent resize-none placeholder:text-[#c0bdb8] font-[inherit] leading-relaxed"
              />
            )}
          />

          {/* image preview */}
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={image.preview}
                  alt="cover"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue("image", null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center border-none cursor-pointer text-white"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* meta pills */}
          <div className="flex flex-wrap gap-2">
            {location && (
              <MetaPill
                icon={
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 2C5.2 2 3 4.2 3 7c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2.2-5-5-5z" />
                    <circle cx="8" cy="7" r="1.5" />
                  </svg>
                }
                label={location.address?.split(",")[0] ?? "Location"}
                onRemove={() => {
                  setValue("location", null);
                  setActivePanel(null);
                }}
              />
            )}
            {startDT && (
              <MetaPill
                icon={
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="12" height="11" rx="2" />
                    <path d="M2 7h12" />
                  </svg>
                }
                label={fmtDate(startDT)}
                onRemove={() => {
                  setValue("startDateTime", "");
                  setValue("endDateTime", "");
                  setActivePanel(null);
                }}
              />
            )}
          </div>

          {/* category chips */}
          <AnimatePresence>
            {showCats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <>
                        {CATEGORIES.map((cat) => (
                          <CategoryChip
                            key={cat}
                            label={cat}
                            active={field.value === cat}
                            onClick={() => field.onChange(cat)}
                          />
                        ))}
                      </>
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* location panel */}
          <Panel open={activePanel === "location"}>
            <FieldLabel>Location</FieldLabel>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <LocationInput value={field.value} onChange={field.onChange} />
              )}
            />
          </Panel>

          {/* date panel */}
          <Panel open={activePanel === "date"}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Start</FieldLabel>
                <Controller
                  name="startDateTime"
                  control={control}
                  render={({ field }) => (
                    <PanelInput type="datetime-local" {...field} />
                  )}
                />
              </div>
              <div>
                <FieldLabel>End</FieldLabel>
                <Controller
                  name="endDateTime"
                  control={control}
                  render={({ field }) => (
                    <PanelInput type="datetime-local" {...field} />
                  )}
                />
              </div>
            </div>
          </Panel>

          {/* ticket panel */}
          <Panel open={activePanel === "ticket"}>
            <FieldLabel>Ticket type</FieldLabel>
            <Controller
              name="ticketType"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2 mb-3">
                  <ToggleChip
                    label="Free"
                    active={field.value === "free"}
                    onClick={() => field.onChange("free")}
                  />
                  <ToggleChip
                    label="Paid"
                    active={field.value === "paid"}
                    onClick={() => field.onChange("paid")}
                  />
                </div>
              )}
            />
            <AnimatePresence>
              {ticketType === "paid" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden flex flex-col gap-3"
                >
                  <div>
                    <FieldLabel>Price</FieldLabel>
                    <div className="flex gap-2">
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="bg-white border border-black/12 rounded-xl px-3 py-2.5 text-[13px] text-[#1a1814] outline-none w-20 shrink-0 font-[inherit]"
                          >
                            {CURRENCIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <PanelInput
                            type="number"
                            placeholder="0"
                            min="0"
                            {...field}
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Total tickets</FieldLabel>
                    <Controller
                      name="totalTickets"
                      control={control}
                      render={({ field }) => (
                        <PanelInput
                          type="number"
                          placeholder="e.g. 100"
                          min="1"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>

          {/* more panel (tags + approval) */}
          <Panel open={activePanel === "more"}>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel>Tags</FieldLabel>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-[13px] font-medium text-[#1a1814]">
                    Require approval
                  </p>
                  <p className="text-[11px] text-[#9b9890]">
                    Manually approve each attendee
                  </p>
                </div>
                <Controller
                  name="requireApproval"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </Panel>
        </div>

        {/* ── footer ── */}
        <div className="border-t border-black/[0.07] px-4 py-3 shrink-0">
          {/* toolbar */}
          <div className="flex items-center gap-1 mb-3">
            {/* image */}
            <ToolBtn title="Add photo" onClick={() => imgRef.current.click()}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
                <circle cx="5.5" cy="6" r="1.2" />
                <path d="M14.5 10l-3.5-3.5L5 12.5" />
              </svg>
            </ToolBtn>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />

            {/* location */}
            <ToolBtn
              title="Location"
              active={activePanel === "location"}
              onClick={() => togglePanel("location")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2C5.2 2 3 4.2 3 7c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2.2-5-5-5z" />
                <circle cx="8" cy="7" r="1.5" />
              </svg>
            </ToolBtn>

            {/* date */}
            <ToolBtn
              title="Date & time"
              active={activePanel === "date"}
              onClick={() => togglePanel("date")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="12" height="11" rx="2" />
                <path d="M2 7h12M5 1v3M11 1v3" />
              </svg>
            </ToolBtn>

            {/* tickets */}
            <ToolBtn
              title="Tickets"
              active={activePanel === "ticket"}
              onClick={() => togglePanel("ticket")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1.5" y="4" width="13" height="9" rx="1.5" />
                <path d="M1.5 7.5h13" />
              </svg>
            </ToolBtn>

            {/* category */}
            <ToolBtn
              title="Category"
              active={showCats}
              onClick={() => setShowCats((p) => !p)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4h4v4H2zM10 4h4v4h-4zM2 10h4v4H2zM10 10h4v4h-4z" />
              </svg>
            </ToolBtn>

            {/* more (tags, approval) */}
            <ToolBtn
              title="More options"
              active={activePanel === "more"}
              onClick={() => togglePanel("more")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="4"
                  cy="8"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
                <circle
                  cx="12"
                  cy="8"
                  r="1.2"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </ToolBtn>

            {/* divider + char count */}
            <div className="w-px h-5 bg-black/10 mx-1" />
            <span className="text-[11px] text-[#9b9890] ml-1">
              {title?.length ?? 0}/300
            </span>

            {/* post button — pushed right */}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={savingDraft}
                onClick={handleSubmit((d) => onSubmit(d, "draft"))}
                className="text-[12px] font-medium text-[#9b9890] bg-transparent border-none cursor-pointer disabled:opacity-50"
              >
                {savingDraft ? "Saving…" : "Draft"}
              </button>
              <button
                type="submit"
                disabled={!canPost || submitting}
                className={cn(
                  "px-5 py-2 rounded-xl text-[13px] font-semibold border-none transition-all",
                  canPost
                    ? "bg-[#1a1814] text-[#f2eee7] cursor-pointer"
                    : "bg-[#e8e4dc] text-[#9b9890] cursor-not-allowed"
                )}
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

