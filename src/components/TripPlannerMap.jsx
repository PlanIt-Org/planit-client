import  { useEffect } from "react";
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

const TripPlannerMap = ({ selectedPlace, marker, markerRef, onApiLoaded, locations}) => {

  return (

     <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log("Maps API has loaded.");
          if (onApiLoaded) {
            onApiLoaded(); // call the callback when API is loaded
          }
        }}
        libraries={['places']} // loads Place API library
      >
      <Map
        mapId={GOOGLE_MAPS_STYLING_ID}
        defaultZoom={13}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        style={{ width: "100%", height: "50%" }}
        disableDefaultUI={true} // hide default UI for custom controls
      >
        {/* added multiple pins on map */}
       {locations.map((loc, index) => (
          loc.geometry?.location && ( 
            <AdvancedMarker
              key={loc.place_id || index} 
              position={loc.geometry.location}
              title={loc.name}
              
            />
          )
        ))}
      </Map>

      <MapHandler selectedPlace={selectedPlace} locations={locations} />
    </APIProvider>
  );
};

const MapHandler = ({ selectedPlace, locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // focus on current selected place
    if (selectedPlace && selectedPlace.geometry?.location) {
      if (selectedPlace.geometry?.viewport) {
        map.fitBounds(selectedPlace.geometry.viewport);
      } else {
        map.setCenter(selectedPlace.geometry.location);
        map.setZoom(13); 
      }
      return; 
    }

    // if no current location, set zoom to fit all
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(loc => {
        if (loc.geometry?.location) {
          bounds.extend(loc.geometry.location);
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    }
  }, [map, selectedPlace, locations]); 

  return null;
};

export default TripPlannerMap;
