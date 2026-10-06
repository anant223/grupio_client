import { useState, useEffect } from "react";
import useLocationSearch from "@/hooks/useLocation";
import TextInput from "@/components/my-ui/TextInput"
import { AnimatePresence, motion } from "framer-motion";

const LocationInput = ({ value, onChange }) => {
  const [query, setQuery] = useState(value?.address ?? "");
  const [open, setOpen] = useState(false);
  const {recommendations, isLoading, err} = useLocationSearch({locationQuery: query})

  useEffect(() => {
    setQuery(value?.address)
  }, [value?.address])

  const handleChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
  };

 const select = (f) => {
    const coordinates = f.geometry.coordinates;
    
    const getContext = (prefix) =>
      f.context?.find((c) => c.id.startsWith(prefix));
      onChange({
        coordinates,
        address: f.place_name,
        placeId: f.id,
        city: getContext("place")?.text ?? null,
        state: getContext("region")?.text ?? null,
        country: getContext("country")?.text ?? null,
        countryCode: getContext("country")?.short_code?.toUpperCase() ?? null,
        postalCode: f.place_type?.includes("postcode") ? f.text : (getContext("postcode")?.text ?? null),
      });
      
    setQuery(f.place_name);
    setOpen(false);
};

  return (
    <div className="relative mt-2">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9890] pointer-events-none"
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
        <TextInput
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search address or 'Online'"
          className="pl-9"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-[#9b9890] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <AnimatePresence>
        {open && recommendations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-black/[0.09] rounded-xl overflow-hidden z-30 shadow-sm"
          >
            {recommendations?.map((recommend) => (
              <button
                key={recommend.id}
                type="button"
                onMouseDown={() => select(recommend)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#f8f7f5] transition-colors border-none bg-transparent cursor-pointer"
              >
                <p className="text-[13px] font-medium text-[#1a1814] truncate">
                  {recommend?.text}
                </p>
                <p className="text-[11px] text-[#9b9890] truncate">
                  {recommend?.place_name}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;