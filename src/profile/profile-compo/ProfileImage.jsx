import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfileImage({ avatar, name }) {
  const [imgError, setImgError] = useState(false);

  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";
  const showFallback = !avatar || imgError;

  return (
    <div className="w-full min-w-0 flex flex-col gap-3">
      {/* Main image */}
      <div className="w-28 h-28 md:h-full md:w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#e8e4dc] shrink-0">
        <AnimatePresence mode="wait">
          {showFallback ? (
            <motion.div
              key="fallback"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center text-3xl md:text-6xl font-medium text-[#f2eee7] bg-[#695a56]"
            >
              {initial}
            </motion.div>
          ) : (
            <motion.img
              key={avatar}
              src={avatar}
              alt={name ? `${name}'s profile photo` : "Profile photo"}
              onError={() => setImgError(true)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
