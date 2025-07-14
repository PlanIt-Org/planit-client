import react, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_STYLING_ID = import.meta.env.VITE_GOOGLE_MAPS_STYLING_ID;

const TripPlannerMap = ({ selectedPlace, marker, markerRef, onApiLoaded }) => {

  return (
     <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log("Maps API has loaded.");
          if (onApiLoaded) {
            onApiLoaded(); // Call the callback when API is loaded
          }
        }}
        libraries={['places']} // loads Place API library
      >
      <Map
        mapId={GOOGLE_MAPS_STYLING_ID}
        defaultZoom={13}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        style={{ width: "100%", height: "100%" }}
        disableDefaultUI={true} // Hide default UI for custom controls
      >
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>

      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

const MapHandler = ({ place, marker }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    } else if (place.geometry?.location) {
      map.setCenter(place.geometry.location);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);
  return null;
};

export default TripPlannerMap;
