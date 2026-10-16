import { MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";

const StepConfirm = () => {
  const { watch } = useFormContext();
  const location = watch("location");
  const selectedCategories = watch("categories") || [];
  const interests = watch("interests") || [];

  return (
    <div>
      <h2 className="text-[22px] font-extrabold text-[#1a1814] tracking-[-0.04em] leading-tight mb-1.5">
        Looks good?
      </h2>
      <p className="text-[13.5px] text-[#6b6966] mb-5 leading-relaxed">
        Confirm your choices — you can always update them in settings.
      </p>

      <div className="bg-[#faf9f7] rounded-[14px] border border-black/[0.07] divide-y divide-black/[0.05] overflow-hidden">
        {/* Location */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[11.5px] font-semibold text-[#9a9590] uppercase tracking-wider">
            Location
          </span>
          <span className="text-[13.5px] font-semibold text-[#1a1814] flex items-center">
            <MapPin className=" text-[#D85A30] w-3.4 h-3.5" />
            {location?.address}
          </span>
        </div>

        {/* Preferences */}
        <div className="px-4 py-3.5">
          <span className="text-[11.5px] font-semibold text-[#9a9590] uppercase tracking-wider block mb-2.5">
            Preferences
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((slug) => (
              <span
                key={slug}
                className="px-2.5 py-1 bg-[#D85A30] text-white text-[12px] font-semibold rounded-full capitalize"
              >
                {slug}
              </span>
            ))}
            {interests.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-[#D85A30]/10 text-[#D85A30] text-[12px] font-semibold rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default StepConfirm;