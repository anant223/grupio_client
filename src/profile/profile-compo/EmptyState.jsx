import { motion } from "framer-motion";
import { CalendarX2 } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="py-16 px-6 text-center"
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-[#fbe4d8] flex items-center justify-center">
        <CalendarX2 className="w-5 h-5 text-[#e8663c]" strokeWidth={1.8} />
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-[#1a1a1a]">{title}</h3>

      {description && (
        <p className="mt-1 text-sm text-[#6b6b6b] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
