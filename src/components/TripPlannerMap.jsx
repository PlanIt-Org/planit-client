import { useEffect, useState, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_STYLING_ID = import.meta.env.VITE_GOOGLE_MAPS_STYLING_ID;

const TripPlannerMap = ({
  selectedPlace,
  locations,
  selectedCity,
  showRoutes = false,
  mapHeight,
  setGoogleMapsLink,
}) => {
  return (
    <>
      <Map
        mapId={GOOGLE_MAPS_STYLING_ID}
        defaultZoom={13}
        defaultCenter={
          selectedCity?.geometry?.location || { lat: 37.7749, lng: -122.4194 }
        }
        style={{ width: "100%", height: mapHeight }}
        disableDefaultUI={true} // hide default UI for custom controls
        zoomControl={true}
      >
        {/* added multiple pins on map */}
        {locations.map(
          (loc, index) =>
            loc.geometry?.location && (
              <AdvancedMarker
                key={loc.place_id || index}
                position={loc.geometry.location}
                title={loc.name}
              />
            )
        )}
      </Map>

      <MapHandler
        selectedPlace={selectedPlace}
        locations={locations}
        selectedCity={selectedCity}
        showRoutes={showRoutes}
        setGoogleMapsLink={setGoogleMapsLink}
      />
    </>
  );
};

const MapHandler = ({
  selectedPlace,
  locations,
  selectedCity,
  showRoutes,
  setGoogleMapsLink,
}) => {
  const map = useMap();
  const directionsRendererRef = useRef(null);

  // initialize DirectionsRenderer once when map is available
  useEffect(() => {
    if (map && !directionsRendererRef.current) {
      const renderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true, // This prevents the default A, B, C markers
      });
      renderer.setMap(map);
      directionsRendererRef.current = renderer;
    }
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [map]);

  //  map updates pins, routes, focus
  useEffect(() => {
    if (!map || !directionsRendererRef.current) return;

    const directionsRenderer = directionsRendererRef.current;

    // clear routes
    directionsRenderer.setDirections({ routes: [] });

    // show the route if conditions met
    if (showRoutes && locations.length >= 2) {
      // Need at least 2 locations for a route
      const directionsService = new window.google.maps.DirectionsService();

      // origin is first location
      const origin = locations[0]?.geometry?.location;
      // destionation in last location
      const destination = locations[locations.length - 1]?.geometry?.location;

      if (!origin || !destination) {
        console.error(
          "Cannot calculate route: Origin or Destination location data is missing."
        );
        if (setGoogleMapsLink) {
          setGoogleMapsLink("");
        }
        return;
      }

      // all locations in between origin and destionation are waypoints
      const waypoints = locations
        .slice(1, -1)
        .filter((loc) => loc.geometry?.location)
        .map((loc) => ({
          location: loc.geometry.location,
          stopover: true,
        }));

      // console.log("Route Calculation Inputs:");
      // console.log("Origin:", origin);
      // console.log("Destination:", destination);
      // console.log("Waypoints:", waypoints);

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
            // calculate trip duration
            let totalDurationSeconds = 0;
            if (response.routes && response.routes.length > 0) {
              response.routes[0].legs.forEach((leg) => {
                if (leg.duration && leg.duration.value) {
                  totalDurationSeconds += leg.duration.value;
                }
              });
              const totalDurationText = formatDuration(totalDurationSeconds);
              console.log("Total Trip Duration:", totalDurationText);

              const getPointStringForUrl = (locObj) => {
                if (locObj.place_id) {
                    return `place_id:${locObj.place_id}`;
                }
                // Prefer name if available, otherwise formatted_address
                const nameOrAddress = locObj.name || locObj.formatted_address;
                return nameOrAddress ? encodeURIComponent(nameOrAddress) : '';
              };

              // Use the original locations array to build the URL strings
              const routeOriginString = getPointStringForUrl(locations[0]);
              const routeDestinationString = getPointStringForUrl(locations[locations.length - 1]);
              
              const routeWaypointsStrings = locations.slice(1, -1)
                .map(loc => getPointStringForUrl(loc))
                .filter(str => str !== ''); // Filter out empty strings

              let directionsUrl = `https://www.google.com/maps/dir/${routeOriginString}`;
              if (routeWaypointsStrings.length > 0) {
                directionsUrl += `/${routeWaypointsStrings.join("/")}`;
              }
              directionsUrl += `/${routeDestinationString}`;
              directionsUrl += `?api=1&travelmode=${response.request.travelMode.toLowerCase()}`; // Add api=1 parameter

              if (setGoogleMapsLink) {
                setGoogleMapsLink(directionsUrl);
              }
            }
          } else {
            console.error("Directions request failed due to " + status);
            if (setGoogleMapsLink) {
              setGoogleMapsLink("");
            }
          }
        }
      );
    }
    // If not showing routes, or conditions for route are not met, handle selectedPlace or fit bounds
    else {
      if (setGoogleMapsLink) {
        setGoogleMapsLink("");
      }

      // focus on current selected place if available
      if (selectedPlace && selectedPlace.geometry?.location) {
        if (selectedPlace.geometry?.viewport) {
          map.fitBounds(selectedPlace.geometry.viewport);
        } else {
          map.setCenter(selectedPlace.geometry.location);
          map.setZoom(13);
        }
      }
      // if no current location, set zoom to fit all pins
      else if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((loc) => {
          if (loc.geometry?.location) {
            bounds.extend(loc.geometry.location);
          }
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
        }
      }
    }
  }, [
    map,
    selectedPlace,
    locations,
    selectedCity,
    showRoutes,
    setGoogleMapsLink,
  ]);

  return null;
};

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let durationString = "";
  if (hours > 0) {
    durationString += `${hours} hr `;
  }
  if (minutes > 0 || hours === 0) {
    durationString += `${minutes} min`;
  }
  return durationString.trim();
};

export default TripPlannerMap;
