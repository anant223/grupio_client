import EventBottomSheet from "./components/EventBottomSheet";
import EventListPanel from "./components/EventListPanel";

const GeoMap = memo(
  ({ events = [], location, user, loading, eventPreview, pageInfo }) => {
    const [showList, setShowList] = useState(false);
    const [markerEvents, setMarkerEvents] = useState(null);
    const coordinates = location?.coordinates;

    const [currentCenter, setCurrentCenter] = useState({
      lat: coordinates?.[1] || null,
      lng: coordinates?.[0] || null,
    })

    const [currentPage, setCurrentPage] = useState(0);

    const loaderRef = useRef(null);
    const isFetchingRef = useRef(false);



    const { mapContainerRef, mapRef, loadError, isMapReady } = useMapInstance({
      coordinates,
      onBoundsChange: ({ lat, lng }) => {
        setCurrentCenter({lng, lat})
        setCurrentPage(1)
        eventPreview({ lat, lng});
      },
    });

    const onMarkerClick = ({ events: groupEvents }) => {
      setMarkerEvents(groupEvents);
      setShowList(true);
    };
    useEventsMarkers({
      events,
      mapRef,
      isMapReady,
      onMarkerClick,
    });

    const isMobile = useIsMobile(768);
    const displayedEvents = markerEvents || events;

    useEffect(() => {
      if(!loaderRef.current) return;
      const hasMorePages = pageInfo?.number < pageInfo?.totalPages - 1
      const hasCenter = currentCenter.lat && currentCenter.lng;

      const observer = new IntersectionObserver((entries)=>{
        const first = entries[0]

        if (first.isIntersecting && !isFetchingRef.current && !loading && hasMorePages && hasCenter) {
          
          isFetchingRef.current = true;

          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          eventPreview({
            lat: currentCenter.lat,
            lng: currentCenter.lng,
            page: nextPage,
            radius: 50,
            size: 50,
          });
        }
        if (!first.isIntersecting) {
          isFetchingRef.current = false;
        }

      }, {threshold:0.1})

      observer.observe(loaderRef.current)
      return () => observer.disconnect(); 
    },[pageInfo, currentPage, currentCenter, isFetchingRef, loading])

    useEffect(() => {

      if (!mapRef.current) return;

      const timer = setTimeout(() => {
        mapRef.current?.resize();
        fitMapBounds({ map: mapRef.current, events: displayedEvents });
      }, 520);

      return () => clearTimeout(timer);
    }, [showList]);
    return (
      <div
        className="w-full h-screen flex p-1 md:pb-24 md:px-8 md:pt-6 gap-4
        bg-[#f0ede6] relative overflow-hidden"
      >
        {isMobile ? (
          <EventListPanel
            user={user}
            markerEvents={markerEvents}
            isOpen={showList}
            onClearMarker={setMarkerEvents}
            displayedEvents={displayedEvents}
          />
        ) : (
          <EventBottomSheet eventLength={events?.length}>
            {events?.map((event) => (
              <EventListCardMobile key={event._id} event={event} />
            ))}
          </EventBottomSheet>
        )}
        <div className="flex-1 relative overflow-hidden rounded-3xl">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full"
          />
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute z-30 bottom-1 left-2 hidden md:block transition-[left] duration-350 ease-in-out"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowList(!showList)}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-[rgba(242,238,231,0.95)] border border-white/80 rounded-full cursor-pointer shadow-lg backdrop-blur-xl"
              >
                {showList ? (
                  <Map size={14} className="text-[#1a1814]" />
                ) : (
                  <List size={14} className="text-[#1a1814]" />
                )}
                <span className="text-[12px] font-semibold text-[#1a1814]">
                  {showList ? "Show map" : "Show list"}
                </span>
                <span className="bg-[#1a1814] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {events?.length ?? 0} events
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

GeoMap.displayName = "GeoMap";

export default GeoMap;