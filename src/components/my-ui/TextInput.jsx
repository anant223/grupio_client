import { cn } from "@/lib/utils";

const TextInput = ({ className, ...props }) => (
  <input
    {...props}
    className={cn(
      "w-full bg-[#f8f7f5] border border-black/[0.12] rounded-xl px-3 py-2.5",
      "text-[13px] text-[#1a1814] placeholder:text-[#9b9890]",
      "outline-none focus:border-black/40 focus:bg-white transition-colors font-[inherit]",
      className
    )}
  />
);
export default TextInput