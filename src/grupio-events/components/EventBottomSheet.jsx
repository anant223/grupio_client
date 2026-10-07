import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const EventBottomSheet = ({ eventLength, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => setIsExpanded(false);

  return (
    <AnimatePresence>
      {eventLength > 0 && (
        <>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
              onClick={handleClose}
            />
          )}

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute font-roboto capitalize bottom-0 left-0 right-0 z-30 flex flex-col bg-[rgba(242,238,231,0.98)] rounded-t-[20px] shadow-[0_-4px_32px_rgba(0,0,0,0.12)] overflow-hidden"
            style={{
              height: isExpanded ? "95vh" : "90px",
              transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="px-4 pt-3 flex-shrink-0">
              <div
                className="flex justify-center mb-2.5 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="w-9 h-1 bg-black/15 rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#1a1814]">
                    Events nearby
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {eventLength} event{eventLength === 1 ? "" : "s"} in your
                    area
                  </p>
                </div>

                {isExpanded && (
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 rounded-full bg-black/[0.07] border-none flex items-center justify-center cursor-pointer"
                  >
                    <X size={13} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-y-auto flex-1 px-4 pt-3 pb-6">
                {children}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventBottomSheet;
