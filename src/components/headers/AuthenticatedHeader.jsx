import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, User, Bookmark, Bell, ChevronDown, Plus, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";
import { transformNotification } from "@/utils/constant";
import { useMemo } from "react";
import Logo from "@/components/Logo"
import { BodyContainer, WrapperContainer } from "../containers/Container";

// ─── Bell ────────────────────────────────────────────────────────────────────
const NotificationBell = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const { notifications, unReadCount, markAsRead, markAllAsRead, fetchLoading } = useNotifications();

    const latest = useMemo(
        () => notifications.slice(0, 5).map((n) => transformNotification(n)),
        [notifications]
    );

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleClick = (notif) => {
        markAsRead(notif.id);
        if (notif.link) navigate(notif.link);
        setOpen(false);
    };

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* trigger */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.65)",
                    border: "0.5px solid rgba(0,0,0,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", position: "relative",
                    transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
            >
                <Bell size={15} color="#3d3a34" />
                {unReadCount > 0 && (
                    <span style={{
                        position: "absolute", top: -1, right: -1,
                        width: 9, height: 9,
                        background: "#E24B4A",
                        borderRadius: "50%",
                        border: "1.5px solid rgba(242,238,231,0.95)",
                    }} />
                )}
            </button>

            {/* dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="w-96 top-14"
                        style={{
                            position: "absolute", right: 0,
                            background: "rgba(242,238,231,0.97)",
                            border: "0.5px solid rgba(0,0,0,0.08)",
                            borderRadius: 16,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                            overflow: "hidden",
                            zIndex: 100,
                        }}
                    >
                        {/* header */}
                        <div style={{ padding: "10px 14px", borderBottom: "0.5px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1814" }}>Notifications</span>
                            {unReadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    style={{ fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* list */}
                        <div style={{ maxHeight: 280, overflowY: "auto" }}>
                            {fetchLoading ? (
                                <div style={{ padding: "24px 0", textAlign: "center", fontSize: 12, color: "#999" }}>Loading...</div>
                            ) : latest.length === 0 ? (
                                <div style={{ padding: "28px 0", textAlign: "center" }}>
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>🔔</div>
                                    <p style={{ fontSize: 12, color: "#999", margin: 0 }}>No notifications</p>
                                </div>
                            ) : latest.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleClick(notif)}
                                    style={{
                                        padding: "10px 14px",
                                        borderBottom: "0.5px solid rgba(0,0,0,0.05)",
                                        cursor: "pointer",
                                        background: notif.read ? "transparent" : "rgba(226,75,74,0.04)",
                                        display: "flex", gap: 10, alignItems: "flex-start",
                                        transition: "background 0.12s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                                    onMouseLeave={e => e.currentTarget.style.background = notif.read ? "transparent" : "rgba(226,75,74,0.04)"}
                                >
                                    {/* avatar */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                        background: `${notif.color}18`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 14, overflow: "hidden",
                                    }}>
                                        {notif.avatar?.startsWith("http")
                                            ? <img src={notif.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : notif.avatar
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: "#1a1814", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notif.title}</p>
                                        <p style={{ fontSize: 11, color: "#888", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notif.message}</p>
                                        <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>{notif.time}</p>
                                    </div>
                                    {!notif.read && (
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: notif.color, flexShrink: 0, marginTop: 4 }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* footer */}
                        <div style={{ padding: "8px 10px", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
                            <button
                                onClick={() => { navigate("/main/notifications"); setOpen(false); }}
                                style={{
                                    width: "100%", padding: "7px 0",
                                    background: "rgba(255,255,255,0.5)", border: "0.5px solid rgba(0,0,0,0.07)",
                                    borderRadius: 10, cursor: "pointer",
                                    fontSize: 12, fontWeight: 500, color: "#555",
                                    transition: "background 0.12s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.5)"}
                            >
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── User Menu ────────────────────────────────────────────────────────────────
const UserMenu = ({ user }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleNavigate = (path) => { navigate(path); setOpen(false); };
    const handleLogout = () => { logout(); setTimeout(() => navigate("/"), 900); };

    const initials = user?.name?.charAt(0).toUpperCase() || "U";

    const quickActions = [
        { label: "Profile", color: "#378ADD", bg: "rgba(55,138,221,0.1)", icon: <User size={13} color="#378ADD" />, path: `/main/user-profile/${user?._id}` },
        { label: "Saved", color: "#BA7517", bg: "rgba(186,117,23,0.1)", icon: <Bookmark size={13} color="#BA7517" />, path: "/main" },
        { label: "Settings", color: "#5F5E5A", bg: "rgba(95,94,90,0.1)", icon: <Settings size={13} color="#5F5E5A" />, path: "/main" },
    ];

    return (
        <div ref={ref} style={{ position: "relative" }}>
            {/* trigger */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: open ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
                    border: "0.5px solid rgba(0,0,0,0.07)",
                    borderRadius: 100,
                    padding: "4px 10px 4px 4px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
                onMouseLeave={e => e.currentTarget.style.background = open ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)"}
            >
                {/* avatar */}
                <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #378ADD 0%, #534AB7 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600, color: "white", overflow: "hidden", flexShrink: 0,
                }}>
                    {user?.avatar
                        ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : initials
                    }
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#3d3a34", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name?.split(" ")[0] || "User"}
                </span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={12} color="#888" />
                </motion.div>
            </button>

            {/* dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: "absolute", top: 44, right: 0,
                            width: 220,
                            background: "rgba(242,238,231,0.97)",
                            border: "0.5px solid rgba(0,0,0,0.08)",
                            borderRadius: 16,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                            overflow: "hidden",
                            zIndex: 100,
                        }}
                    >
                        {/* user info */}
                        <div  style={{ padding: "12px 14px", borderBottom: "0.5px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: "linear-gradient(135deg, #378ADD, #534AB7)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden",
                            }}>
                                {user?.avatar
                                    ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : initials
                                }
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1814", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "capitalize" }}>{user?.name}</p>
                                <p style={{ fontSize: 11, color: "#999", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                            </div>
                        </div>

                        {/* quick actions */}
                        <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
                            {quickActions.map((a, i) => (
                                <motion.button
                                    key={a.label}
                                    onClick={() => handleNavigate(a.path)}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        background: a.bg, borderRadius: 10,
                                        padding: "8px 4px",
                                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                                        border: "none", cursor: "pointer",
                                    }}
                                >
                                    {a.icon}
                                    <span style={{ fontSize: 10, fontWeight: 500, color: a.color }}>{a.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* sign out */}
                        <div style={{ padding: 6 }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 10px", borderRadius: 10,
                                    background: "transparent", border: "none",
                                    color: "#A32D2D", fontSize: 12, fontWeight: 500, cursor: "pointer",
                                    transition: "background 0.12s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(163,45,45,0.07)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <LogOut size={13} color="#A32D2D" />
                                Sign out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
const MobileMenu = ({ open, onClose, user }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleNavigate = (path) => { navigate(path); onClose(); };
    const handleLogout = () => { logout(); setTimeout(() => navigate("/"), 900); onClose(); };

    const items = [
        { label: "Create Event", icon: <Plus size={16} />, path: "/main/create-event", accent: true },
        { label: "Notifications", icon: <Bell size={16} />, path: "/main" },
        { label: "Bookmarks", icon: <Bookmark size={16} />, path: "/main" },
        { label: "Profile", icon: <User size={16} />, path: `/main/user-profile/${user?._id}` },
        { label: "Settings", icon: <Settings size={16} />, path: "/main" },
    ];

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(3px)", zIndex: 60 }}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                        style={{
                            position: "fixed", top: 0, right: 0, bottom: 0, width: 280,
                            background: "rgba(242,238,231,0.98)",
                            borderLeft: "0.5px solid rgba(0,0,0,0.08)",
                            backdropFilter: "blur(20px)",
                            zIndex: 70, overflowY: "auto",
                        }}
                    >
                        <div style={{ padding: 20 }}>
                            {/* close + user */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 20, borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                        background: "linear-gradient(135deg, #378ADD, #534AB7)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 14, fontWeight: 600, color: "white", overflow: "hidden",
                                    }}>
                                        {user?.avatar
                                            ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            : user?.name?.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1814", margin: 0, textTransform: "capitalize" }}>{user?.name}</p>
                                        <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <X size={14} color="#666" />
                                </button>
                            </div>

                            {/* menu items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
                                {items.map((item, i) => (
                                    <motion.button
                                        key={item.label}
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => handleNavigate(item.path)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            padding: "11px 14px", borderRadius: 12,
                                            background: item.accent ? "linear-gradient(135deg, #E24B4A, #c73b3a)" : "rgba(255,255,255,0.5)",
                                            border: item.accent ? "none" : "0.5px solid rgba(0,0,0,0.06)",
                                            color: item.accent ? "white" : "#3d3a34",
                                            fontSize: 13, fontWeight: 500, cursor: "pointer",
                                            width: "100%", textAlign: "left",
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </motion.button>
                                ))}
                            </div>

                            {/* sign out */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    padding: "11px 14px", borderRadius: 12,
                                    background: "transparent", border: "0.5px solid rgba(163,45,45,0.25)",
                                    color: "#A32D2D", fontSize: 13, fontWeight: 500, cursor: "pointer",
                                }}
                            >
                                <LogOut size={14} />
                                Sign out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};



export default function AuthenticatedHeader() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

   return (
     <>
       <motion.header
         key="split"
         initial={{ opacity: 0, y: -8 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
         className="relative flex-shrink-0 top-0 z-50 bg-[#f0ede6]/90 backdrop-blur-sm border-b border-black/[0.06] h-14 sm:h-[60px]"
         style={{ paddingTop: "env(safe-area-inset-top)" }}
       >
         <div className=" container mx-auto h-full px-2 sm:px-4">
           <div className="flex items-center justify-between h-full">
             <Link
               to="/main/all-events"
               aria-label="Grupio home"
               className="flex items-center gap-2 no-underline shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E24B4A]"
             >
               <Logo className="h-6 sm:h-7 w-auto" />
             </Link>

             {/* Controls */}
             <div className="flex items-center gap-1.5 sm:gap-3">
               <div className="hidden md:block">
                 <UserMenu user={user} />
               </div>

               <motion.button
                 whileHover={{ scale: 1.04 }}
                 whileTap={{ scale: 0.96 }}
                 onClick={() => navigate("/main/create-form")}
                 aria-label="Create event"
                 className="hidden md:flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#E24B4A] hover:bg-[#d03f3e] active:bg-[#b8352f] transition-colors cursor-pointer flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E24B4A]"
               >
                 <Plus size={15} className="text-white" strokeWidth={2.5} />
               </motion.button>

               <motion.button
                 type="button"
                 whileTap={{ scale: 0.94 }}
                 aria-label="Open menu"
                 aria-expanded={mobileOpen}
                 className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-black/10 transition-colors cursor-pointer flex-shrink-0"
                 onClick={() => setMobileOpen(true)}
               >
                 <Menu size={15} className="text-[#3d3a34]" />
               </motion.button>
             </div>
           </div>
         </div>
       </motion.header>
       <MobileMenu
         open={mobileOpen}
         onClose={() => setMobileOpen(false)}
         user={user}
       />
     </>
   );
}
