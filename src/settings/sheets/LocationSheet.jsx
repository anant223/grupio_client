import LocationInput from "@/components/common/LocationInput";
import ResponsiveModal from "@/components/my-ui/Sheet";
import useAuth from "@/hooks/useAuth";
import useLocationSearch from "@/hooks/useLocation";
import { MapPin, Search, X } from "lucide-react";
import { useState } from "react";

const LocationSheet = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const { user, changeLocation, updateLocationError } = useAuth();

  
  const handleClose = () => {
    setQuery("");
    setSelected(null);
    setLoading(false);
    setSaved(false);
    setError(null);
    onClose();
  };

  const handleSelect = (place) => {
    setSelected(place);
    setQuery(place.formattedAddress);
    setError(null);
  };

  // submit selected location to backend
  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      await changeLocation({location: {
        city: selected.city,
        country: selected.country,
        formattedAddress: selected.formattedAddress,
        placeId: selected.placeId,
        coordinates: selected.coordinates,
        type: "Point",
    }});
      setSaved(true);
      setTimeout(() => handleClose(), 1200);
    } catch (err){
      console.log(err.response.data)
      setError(
        updateLocationError || "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#f8f7f5",
    border: "0.5px solid rgba(0,0,0,.12)",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
    color: "#1a1814",
    fontFamily: "inherit",
    outline: "none",
    lineHeight: 1.55,
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(26,24,20,.4)";
    e.target.style.background = "#fff";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(0,0,0,.12)";
    e.target.style.background = "#f8f7f5";
  };

  return (
    <ResponsiveModal open={open} onClose={handleClose}>
      <div className="px-5 pt-5 pb-2">
        {/* ── Icon ───────────────────────────────────────────────── */}
        <div className="w-[52px] h-[52px] rounded-full bg-[#FAECE7] flex items-center justify-center mx-auto mt-2 mb-3.5">
          <MapPin className="w-6 h-6 text-[#993C1D]" />
        </div>

        <p className="text-[17px] font-medium text-[#1a1814] text-center mb-4">
          Update location
        </p>

        <LocationInput/>

        <button
          type="button"
          onClick={handleSave}
          // disabled={!selected || loading || saved}
          className={`w-full p-3.5 rounded-[10px] text-[13px] font-medium text-white border-none mt-3 mb-2.5 transition-colors duration-300 ${
            saved
              ? "bg-[#1D9E75] cursor-default"
              : selected || loading
                ? "bg-[#1a1814]/40 cursor-not-allowed"
                : "bg-[#1a1814] cursor-pointer"
          }`}
        >
          {saved ? "Saved!" : loading ? "Saving…" : "Save location"}
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="w-full p-3.5 rounded-[10px] text-[13px] font-medium text-[#1a1814] cursor-pointer mb-2 bg-transparent"
          style={{ border: "0.5px solid rgba(0,0,0,.15)" }}
        >
          Cancel
        </button>
      </div>
    </ResponsiveModal>
  );
};

export default LocationSheet;
