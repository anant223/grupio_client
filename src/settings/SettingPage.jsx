import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {StripeSheet, ChangePasswordSheet, EmailSheet, DeleteAccountSheet, EditProfileSheet} from "./sheets/index.js";
import useAuth from "@/hooks/useAuth.js";
import useCategory from "@/hooks/useCategory.js";
import SectionLabel from "@/components/ui/sectionLabel.jsx";
import Row from "@/components/ui/row.jsx";
import { Card } from "@/components/ui/card.jsx";
import LocationSheet from "./sheets/LocationSheet.jsx";
import { toast } from "sonner";
import { MoveLeft } from "lucide-react";
import LocationInput from "@/components/common/LocationInput.jsx";
import { clearRegisteredEvents } from "@/app/slices/registerSlice.js";
// import icons from "@/utils/icons.js";



const colors = {
  bg:      "#f0ede6",
  dark:    "#1a1814",
  cream:   "#f2eee7",
  muted:   "#9b9890",
  faint:   "#c0bdb8",
  surface: "#f8f7f5",
  border:  "rgba(0,0,0,0.09)",
  divider: "rgba(0,0,0,0.07)",
};

// back button
const BackBtn = ({ label = "Settings", onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 13, color: colors.muted, background: "none",
      border: "none", cursor: "pointer", padding: 0, marginBottom: 20,
    }}
  >
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L5 8l5 5" />
    </svg>
    {label}
  </button>
);

// page title
const PageTitle = ({ children }) => (
  <p style={{ fontSize: 20, fontWeight: 500, color: colors.dark, marginBottom: 24 }}>
    {children}
  </p>
);



// field wrapper
const Field = ({ label, required, hint, children, style }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && (
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: colors.muted, marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#D85A30" }}>*</span>}
      </label>
    )}
    {children}
    {hint && <p style={{ fontSize: 11, color: colors.muted, marginTop: 5 }}>{hint}</p>}
  </div>
);

// text input
const Input = ({ style, ...props }) => (
  <input
    {...props}
    style={{
      width: "100%", background: colors.surface,
      border: `0.5px solid rgba(0,0,0,0.12)`, borderRadius: 10,
      padding: "10px 12px", fontSize: 13, color: colors.dark,
      fontFamily: "inherit", outline: "none", ...style,
    }}
    onFocus={e => { e.target.style.borderColor = "rgba(26,24,20,.4)"; e.target.style.background = "#fff"; }}
    onBlur={e  => { e.target.style.borderColor = "rgba(0,0,0,.12)";   e.target.style.background = colors.surface; }}
  />
);

// textarea
export const Textarea = ({ style, ...props }) => (
  <textarea
    {...props}
    style={{
      width: "100%", background: colors.surface,
      border: `0.5px solid rgba(0,0,0,0.12)`, borderRadius: 10,
      padding: "10px 12px", fontSize: 13, color: colors.dark,
      fontFamily: "inherit", outline: "none", resize: "vertical",
      minHeight: 88, lineHeight: 1.55, ...style,
    }}
    onFocus={e => { e.target.style.borderColor = "rgba(26,24,20,.4)"; e.target.style.background = "#fff"; }}
    onBlur={e  => { e.target.style.borderColor = "rgba(0,0,0,.12)";   e.target.style.background = colors.surface; }}
  />
);

// primary save button
export const SaveBtn = ({ children, onClick, loading, success, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: 13, borderRadius: 10, fontSize: 13,
      fontWeight: 500, border: "none", cursor: "pointer",
      background: success ? "#1D9E75" : danger ? "#D85A30" : colors.dark,
      color: "#fff", transition: "background 0.2s", marginTop: 4,
    }}
  >
    {loading ? "Saving…" : success ? "Saved!" : children}
  </button>
);

// ghost cancel button
export const CancelBtn = ({ children = "Cancel", onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: 13, borderRadius: 10, fontSize: 13,
      fontWeight: 500, background: "transparent",
      border: `0.5px solid rgba(0,0,0,0.15)`, color: colors.dark,
      cursor: "pointer", marginTop: 10,
    }}
  >
    {children}
  </button>
);






// page shell
const Shell = ({ children }) => (
  <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "inherit" }}>
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 80px" }}>
      {children}
    </div>
  </div>
);

// ─── primitives ───────────────────────────────────────────────────────────────

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      width: 40,
      height: 24,
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      padding: 0,
      flexShrink: 0,
      position: "relative",
      background: value ? "#1a1814" : "#d1cfc9",
      transition: "background 0.2s",
    }}
  >
    <span
      style={{
        position: "absolute",
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        top: 3,
        left: 3,
        transform: value ? "translateX(16px)" : "translateX(0)",
        transition: "transform 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
      }}
    />
  </button>
);

const Divider = () => (
  <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)", marginLeft: 52 }} />
);






const Chevron = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#c0bdb8"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3l5 5-5 5" />
  </svg>
);

// ─── icons ────────────────────────────────────────────────────────────────────

const icons = {
  bell: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 2.5.8 3.5 1.3 4H2.2c.5-.5 1.3-1.5 1.3-4A4.5 4.5 0 0 1 8 1.5z" />
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  ),
  email: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="10" rx="2" />
      <path d="M2 6l6 4 6-4" />
    </svg>
  ),
  cohost: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="2.5" />
      <path d="M1.5 14c0-2.5 2-4.5 4.5-4.5" />
      <circle cx="12" cy="6" r="2.5" />
      <path d="M9.5 10a4.5 4.5 0 0 1 5 4" />
    </svg>
  ),
  reminder: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" />
    </svg>
  ),
  cancelled: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
    </svg>
  ),
  pin: (
    <svg
      width="14"
      height="14"
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
  ),
  lock: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="10" height="8" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  ),
  link: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 9a3 3 0 0 0 4.5.3l1.5-1.5a3 3 0 0 0-4.2-4.2L7.5 4.8" />
      <path d="M9 7a3 3 0 0 0-4.5-.3L3 8.2a3 3 0 0 0 4.2 4.2l1.3-1.2" />
    </svg>
  ),
  stripe: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1.5" y="4" width="13" height="9" rx="1.5" />
      <path d="M1.5 7h13" />
    </svg>
  ),
  logout: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#D85A30"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 3H13.5v10H11M6.5 10.5L11 8 6.5 5.5M11 8H2" />
    </svg>
  ),
  trash: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#D85A30"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 4 14 12 14 13 6" />
      <path d="M1 6h14M6 6V3h4v3" />
    </svg>
  ),
};

// ─── category chip ────────────────────────────────────────────────────────────

const Chip = ({ label, emoji, color, active, onClick }) => {
  return <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-150 flex-shrink-0 capitalize`}
    style={{
      border: active ? `1.5px solid ${color}` : "0.5px solid rgba(0,0,0,0.15)",
      background: active ? `${color}18` : "transparent",
      color: active ? color : "#9b9890",
    }}
  >
    <span className="text-[14px] leading-none">{emoji}</span>
    {label}
  </button>
};


const Feature = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <path d="M3 8l3.5 3.5L13 4"/>
    </svg>
    <span style={{ fontSize: 13, color: "#1a1814" }}>{children}</span>
  </div>
);



const getStrength = (val) => {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
};

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "#D85A30", "#BA7517", "#1D9E75", "#0F6E56"];

const FieldInput = ({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}) => (
  <div style={{ marginBottom: 14 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 500,
        color: "#9b9890",
        marginBottom: 6,
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#f8f7f5",
          border: "0.5px solid rgba(0,0,0,.12)",
          borderRadius: 10,
          padding: "10px 40px 10px 12px",
          fontSize: 13,
          color: "#1a1814",
          fontFamily: "inherit",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(26,24,20,.4)";
          e.target.style.background = "#fff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(0,0,0,.12)";
          e.target.style.background = "#f8f7f5";
        }}
      />
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9b9890",
            padding: 0,
            display: "flex",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {show ? (
              <>
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
                <circle cx="8" cy="8" r="2" />
              </>
            ) : (
              <>
                <path d="M2 2l12 12M6.7 6.8A2 2 0 0 0 8 10a2 2 0 0 0 1.3-.5M4 4.2C2.4 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.6-1M9.9 4.4A7 7 0 0 1 15 8s-2.5 5-7 5" />
              </>
            )}
          </svg>
        </button>
      )}
    </div>
  </div>
);

const SHEET = {
  EDIT: "edit",
  EMAIL: "email",
  LOCATION: "location",
  PASSWORD: "password",
  STRIPE: "stripe",
  DELETE: "danger",
};

const SettingPage = () => {
  const [activeSheet, setActiveSheet] = useState(null);
  const [showSocial, setShowSocial] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    settingUserNotificationPreferences,
    updateUserCategory,
    logout,
    loading,
    error: errorType,
  } = useAuth();
  const { categories, error, reFetchCategory, isCategoryLoading } =
    useCategory();



  const openSheet = (name) => setActiveSheet(name);
  const closeSheet = () => setActiveSheet(null);

  const toggleCategory = async (categoryId) => {
    const isAdded = user.preferredCategories.includes(categoryId);
    
    if (isAdded && user.preferredCategories.length <= 2) {
      toast.error("You must have at least 2 categories");
      return;
    }

    try {
      await updateUserCategory(categoryId);
      toast.success("Category updated!");
    } catch (error) {
      dispatch(localCategoryPreferance({ key, value: !value }));
      toast.error("Failed to update preference");
    }
  };

  const handleToggleNotification = async ({ key, value }) => {
    try {
      await settingUserNotificationPreferences({ key, value });
      toast.success("Preference updated");
    } catch {
      toast.error("Failed to update preference");
    }
  };

  // socialLinks — platform enum from schema
  const platforms = [
    "twitter",
    "linkedin",
    "instagram",
    "youtube",
    "discord",
    "other",
  ];


  const setSocialUrl = (platform, url) =>{
    console.log("fromsoclai rul")
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-[#9b9890] bg-transparent border-none cursor-pointer p-0 mb-6"
        >
          <MoveLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <h1 className="text-[22px] font-semibold text-[#1a1814] mb-8">
          Settings
        </h1>
        <SectionLabel>Profile</SectionLabel>
        <Card className="bg-white mb-6 overflow-hidden">
          <div className="flex items-center gap-3.5 p-4 border-b border-black/[0.07]">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-[52px] h-[52px] rounded-full shrink-0 flex items-center justify-center text-xl font-medium text-[#f2eee7] bg-[#1a1814]">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-[#1a1814] capitalize m-0 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[#9b9890] mt-0.5">@{user?.username}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSheet(SHEET.EDIT)}
              className="text-xs font-medium text-[#1a1814] bg-transparent border border-black/15 rounded-lg px-3 py-1.5 cursor-pointer shrink-0"
            >
              Edit
            </button>
          </div>

          <Row
            icon={icons.email}
            iconBg="#E1F5EE"
            iconColor="#0F6E56"
            title="Email"
            subtitle={user?.email}
            right={<Chevron />}
            onClick={() => setActiveSheet(SHEET.EMAIL)}
          />
          <Divider />

          <Row
            icon={icons.pin}
            iconBg="#FAECE7"
            iconColor="#993C1D"
            title="Location"
            subtitle={
              user?.location?.city && user?.location?.country
                ? `${user.location.city}, ${user.location.country}`
                : (user?.location?.city ?? "Not set")
            }
            right={<Chevron />}
            onClick={() => setActiveSheet(SHEET.LOCATION)}
          />
        </Card>
        <SectionLabel>Notifications</SectionLabel>
        <Card className="bg-white mb-6 overflow-hidden">
          {[
            {
              key: "eventCreated",
              label: "New event created",
              sub: "From people you follow",
              icon: icons.bell,
              bg: "#FAEEDA",
              color: "#BA7517",
            },
            {
              key: "eventInvite",
              label: "Event invite",
              sub: "When someone invites you",
              icon: icons.email,
              bg: "#E6F1FB",
              color: "#185FA5",
            },
            {
              key: "coHostAdded",
              label: "Co-host added",
              sub: "When you're added as co-host",
              icon: icons.cohost,
              bg: "#EEEDFE",
              color: "#534AB7",
            },
            {
              key: "eventReminder",
              label: "Event reminder",
              sub: "Before events you're attending",
              icon: icons.reminder,
              bg: "#E1F5EE",
              color: "#0F6E56",
            },
            {
              key: "notification",
              label: "Notification",
              sub: "Other notifcation",
              icon: icons.cancelled,
              bg: "#FCEBEB",
              color: "#A32D2D",
            },
          ].map(({ key, label, sub, icon, bg, color }, i, arr) => (
            <div key={key}>
              <Row
                icon={icon}
                iconBg={bg}
                iconColor={color}
                title={label}
                subtitle={sub}
                right={
                  <Toggle
                    value={Boolean(user?.notificationPreferences?.[key])}
                    onChange={(value) =>
                      handleToggleNotification({ key, value })
                    }
                  />
                }
              />
              {i < arr.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
        <SectionLabel>Preferred categories</SectionLabel>
        <Card className="mb-6 overflow-hidden bg-white">
          <div className="p-5">
            <div>
              <p className="mb-3 text-xs text-[#9b9890]">
                Surfaces events you'll love nearby
              </p>

              <div className="flex flex-wrap gap-2">
                {isCategoryLoading ? (
                  <span className="text-xs text-[#9b9890]">Loading...</span>
                ) : (
                  categories?.map((cat) => (
                    <Chip
                      key={cat._id}
                      label={cat.name}
                      color={cat.color}
                      emoji={cat.emoji}
                      active={user?.preferredCategories?.includes(cat._id)}
                      onClick={() => toggleCategory(cat._id)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs text-[#9b9890]">Your interests</p>

              <div className="flex flex-wrap gap-2">
                {user?.interests?.length ? (
                  user.interests.map((interest, i) => (
                    <Chip key={i} label={interest} />
                  ))
                ) : (
                  <span className="text-xs text-[#9b9890]">
                    No interests added
                  </span>
                )}

                <Chip emoji="+" />
              </div>
            </div>
          </div>
        </Card>
        <SectionLabel>Social links</SectionLabel>
        <Card className="bg-white overflow-hidden mb-6">
          <Row
            icon={icons.link}
            iconBg="#f0ede6"
            iconColor="#9b9890"
            title="Connected accounts"
            subtitle={`${user?.socialLinks?.filter((l) => l.url).length ?? 0} of ${user?.socialLinks?.length ?? 0} linked`}
            right={
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSocial((p) => !p);
                }}
                className="text-xs text-[#9b9890] bg-transparent border-none cursor-pointer p-0"
              >
                {showSocial ? "Done" : "Manage"}
              </button>
            }
            onClick={() => setShowSocial((p) => !p)}
          />
          {showSocial && (
            <div className="border-t border-black/[0.07]">
              {user?.socialLinks?.map((platform, i) => (
                <div key={platform?._id}>
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <p className="text-[13px] font-medium text-[#1a1814] w-[88px] shrink-0 capitalize m-0">
                      {platform?.platform}
                    </p>
                    <input
                      type="url"
                      placeholder="https://..."
                      defaultValue={platform?.url}
                      onChange={(e) => setSocialUrl(platform, e.target.value)}
                      className="flex-1 text-xs text-[#1a1814] bg-transparent border-none outline-none"
                    />
                  </div>
                  {i < user.socialLinks.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </Card>
        {/* ── Payments ── */}
        <SectionLabel>Payments</SectionLabel>
        <Card className="bg-white overflow-hidden mb-6">
          <Row
            icon={icons.stripe}
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            title="Stripe payouts"
            subtitle={
              user?.stripeOnboardingCompleted
                ? "Payout account connected"
                : "Set up to receive payments"
            }
            right={
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  user?.stripeOnboardingCompleted
                    ? "bg-[#EAF3DE] text-[#3B6D11]"
                    : "bg-[#FAEEDA] text-[#BA7517]"
                }`}
              >
                {user?.stripeOnboardingCompleted ? "Active" : "Pending"}
              </span>
            }
            onClick={() => setActiveSheet(SHEET.STRIPE)}
          />
        </Card>
        <SectionLabel>Account</SectionLabel>
        <Card className="bg-white overflow-hidden mb-6">
          <Row
            icon={icons.lock}
            iconBg="#f0ede6"
            iconColor="#9b9890"
            title="Change password"
            right={<Chevron />}
            onClick={() => setActiveSheet(SHEET.PASSWORD)}
          />
          <Divider />
          <Row
            danger
            icon={icons.logout}
            title="Sign out"
            onClick={() => logout()}
          />
          <Divider />
          <Row
            danger
            icon={icons.trash}
            title="Delete account"
            subtitle="This cannot be undone"
            onClick={() => setActiveSheet(SHEET.DELETE)}
          />
        </Card>
        <p className="text-[11px] text-[#c0bdb8] text-center mt-2">
          Grupio v1.0.0
        </p>
      </div>

      {/* ── sheets ── */}
      <EditProfileSheet
        open={activeSheet === SHEET.EDIT}
        onClose={closeSheet}
      />
      <EmailSheet open={activeSheet === SHEET.EMAIL} onClose={closeSheet} />
      <LocationSheet
        open={activeSheet === SHEET.LOCATION}
        onClose={closeSheet}
      />
      <ChangePasswordSheet
        open={activeSheet === SHEET.PASSWORD}
        onClose={closeSheet}
      />

      <StripeSheet open={activeSheet === SHEET.STRIPE} onClose={closeSheet} />

      <DeleteAccountSheet
        open={activeSheet === SHEET.DELETE}
        onClose={closeSheet}
      />
    </>
  );
};

export default SettingPage;
