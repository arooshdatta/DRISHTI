import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const DEFAULT_HOSPITAL_IMAGE = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800";

const getImageUrl = (place) => {
  if (place.photos && place.photos.length > 0) {
    return place.photos[0].getUrl({ maxWidth: 400 });
  }
  return DEFAULT_HOSPITAL_IMAGE;
};

const getCurrentDayStatus = (place) => {
  if (place.opening_hours) {
    const isOpen = place.opening_hours.isOpen();
    const status = isOpen ? 'Open now' : 'Closed';
    let formattedTime = '';

    if (isOpen && place.opening_hours.weekday_text && place.opening_hours.weekday_text.length > 0) {
      const currentDay = new Date().getDay();
      const index = currentDay === 0 ? 6 : currentDay - 1;
      const todayText = place.opening_hours.weekday_text[index];
      if (todayText) {
        const splitText = todayText.split(': ');
        formattedTime = splitText.length > 1 ? splitText.slice(1).join(': ') : todayText;
      }
    }
    return { status, formattedTime };
  }
  return { status: 'Hours not available', formattedTime: '' };
};

const mockCenters = [
  {
    name: "Dr. Agarwal's Eye Hospital",
    distance: "2.4",
    status: "Open now",
    formattedTime: "9:00 AM - 7:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80",
    lat: 12.9715987,
    lng: 77.5945627
  },
  {
    name: "Narayana Nethralaya",
    distance: "4.1",
    status: "Open now",
    formattedTime: "8:00 AM - 8:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&q=80",
    lat: 12.969115,
    lng: 77.604921
  },
  {
    name: "Sankara Eye Hospital",
    distance: "6.5",
    status: "Closed",
    formattedTime: "Opens 9:00 AM Mon",
    photoUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80",
    lat: 12.96495,
    lng: 77.71616
  },
  {
    name: "Vasan Eye Care",
    distance: "3.2",
    status: "Open now",
    formattedTime: "10:00 AM - 9:00 PM",
    photoUrl: "https://images.unsplash.com/photo-1538108149393-cebb47acddb2?auto=format&fit=crop&w=400&q=80",
    lat: 12.925007,
    lng: 77.593803
  },
  {
    name: "Aravind Eye Hospital",
    distance: "8.7",
    status: "Open now",
    formattedTime: "24 Hours",
    photoUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80",
    lat: 12.981881,
    lng: 77.568101
  }
];

// Helper to calculate distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

export default function EyeCareCenters() {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Dynamic Script Loading
    if (apiKey && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          if (apiKey) {
            // Wait for script to load if it hasn't already
            const checkGoogle = setInterval(() => {
              if (window.google && window.google.maps && window.google.maps.places) {
                clearInterval(checkGoogle);
                fetchNearbyCenters(lat, lng);
              }
            }, 100);
            
            // Timeout to prevent infinite loading if script fails
            setTimeout(() => {
              clearInterval(checkGoogle);
              if (!window.google || !window.google.maps) {
                setError("Failed to load Google Maps API. Showing fallback centers.");
                setCenters(mockCenters);
                setLoading(false);
              }
            }, 10000);
          } else {
            console.log("No Google Maps API key found, using mock data.");
            setCenters(mockCenters);
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied or unavailable. Showing default nearby centers.");
          setCenters(mockCenters);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Showing default nearby centers.");
      setCenters(mockCenters);
      setLoading(false);
    }
  }, []);

  const fetchNearbyCenters = (lat, lng) => {
    try {
      const userLocation = new window.google.maps.LatLng(lat, lng);
      // Instantiate the PlacesService
      const mapDiv = document.createElement('div');
      const service = new window.google.maps.places.PlacesService(mapDiv);

      const request = {
        location: userLocation,
        radius: '10000', // 10km radius
        keyword: 'eye hospital OR eye clinic OR ophthalmologist'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const mappedCenters = results.slice(0, 6).map(place => {
            const placeLat = place.geometry.location.lat();
            const placeLng = place.geometry.location.lng();
            
            // Distance Calculation
            const distanceKm = getDistanceFromLatLonInKm(lat, lng, placeLat, placeLng).toFixed(1);
            
            // Photo Parsing
            const photoUrl = getImageUrl(place);
            
            // Status Parsing
            let status = "Hours not available";
            let formattedTime = "";
            
            if (place.business_status === "OPERATIONAL") {
              const currentStatus = getCurrentDayStatus(place);
              status = currentStatus.status;
              formattedTime = currentStatus.formattedTime;
            } else if (place.business_status === "CLOSED_TEMPORARILY") {
              status = "Temporarily closed";
            } else if (place.business_status === "CLOSED_PERMANENTLY") {
              status = "Permanently closed";
            }

            return {
              name: place.name,
              distance: distanceKm,
              status: status,
              formattedTime: formattedTime,
              photoUrl: photoUrl,
              lat: placeLat,
              lng: placeLng
            };
          });
          
          setCenters(mappedCenters);
        } else {
          console.error("Places API returned no results or failed:", status);
          setError("Could not find live centers nearby. Showing fallback centers.");
          setCenters(mockCenters);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error("Error fetching centers:", err);
      setError("Failed to fetch live data. Showing fallback centers.");
      setCenters(mockCenters);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Dashboard Summary Header */}
      <div className="mb-8 glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-emerald-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-onSurface tracking-tight mb-2">
            {t('eyeCareCenters.title')}
          </h1>
          <p className="text-onSurfaceVariant flex items-center gap-2">
            <MapPin size={16} className="text-emerald-400" />
            {t('eyeCareCenters.subtitle')}
            {location && <span className="text-xs opacity-50 ml-2">{t('eyeCareCenters.liveLocation')}</span>}
          </p>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 bg-surfaceContainer rounded-full">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-onSurfaceVariant">{t('eyeCareCenters.locating')}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm flex items-start gap-3">
          <Activity size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!loading && centers.map((center, idx) => {
          const mapsUrl = center.lat && center.lng 
            ? `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name)}`;

          return (
            <motion.div 
              key={idx}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all group flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              {/* Thumbnail Image */}
              <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 shrink-0">
                <img 
                  src={center.photoUrl} 
                  onError={(e) => { e.target.src = DEFAULT_HOSPITAL_IMAGE; }} 
                  alt={center.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">{center.distance} km</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{center.name}</h3>
                
                <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
                  <Clock size={14} className={center.status === 'Open now' ? "text-emerald-400" : "text-slate-400"} />
                  <span className="text-slate-300">
                    <span className={center.status === 'Open now' ? 'text-emerald-400' : (center.status === 'Hours not available' ? 'text-gray-400' : 'text-rose-400')}>
                      {center.status === 'Open now' ? t('eyeCareCenters.openNow') : 
                       center.status === 'Closed' ? t('eyeCareCenters.closed') : 
                       center.status === 'Temporarily closed' ? t('eyeCareCenters.temporarilyClosed') : 
                       center.status === 'Permanently closed' ? t('eyeCareCenters.permanentlyClosed') : 
                       t('eyeCareCenters.hoursNotAvailable')}
                    </span>
                    {center.formattedTime ? ` • ${center.formattedTime}` : ''}
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-lg border border-emerald-500/20 transition-colors"
              >
                {t('eyeCareCenters.navigate')}
                <Navigation size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
