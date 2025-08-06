import { useEffect, useRef } from "react";
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import apiClient from "../api/axios";

const GOOGLE_MAPS_STYLING_ID = import.meta.env.VITE_GOOGLE_MAPS_STYLING_ID;

const TripPlannerMap = ({
  tripId,
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
        disableDefaultUI={true}
        zoomControl={true}
      >
        {/* added multiple pins on map */}
        {locations.map((loc, index) => {
          const position = loc.geometry?.location || {
            lat: loc.latitude,
            lng: loc.longitude,
          };
          return position.lat && position.lng ? (
            <AdvancedMarker
              key={loc.id || loc.place_id || index}
              position={position}
              title={loc.name}
            />
          ) : null;
        })}
      </Map>

      <MapHandler
        tripId={tripId}
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
  tripId,
  selectedPlace,
  locations,
  selectedCity,
  showRoutes,
  setGoogleMapsLink,
}) => {
  const map = useMap();
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (map && !directionsRendererRef.current) {
      const renderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
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

  useEffect(() => {
    if (!map || !directionsRendererRef.current) return;

    const directionsRenderer = directionsRendererRef.current;

    directionsRenderer.setDirections({ routes: [] });

    if (showRoutes && locations.length >= 2) {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = locations[0]?.geometry?.location;
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

      const waypoints = locations
        .slice(1, -1)
        .filter((loc) => loc.geometry?.location)
        .map((loc) => ({
          location: loc.geometry.location,
          stopover: true,
        }));

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
            let totalDurationSeconds = 0;
            if (response.routes && response.routes.length > 0) {
              response.routes[0].legs.forEach((leg) => {
                if (leg.duration && leg.duration.value) {
                  totalDurationSeconds += leg.duration.value;
                }
              });
              const totalDurationText = formatDuration(totalDurationSeconds);
              console.log("Total Trip Duration:", totalDurationText);

              async function updateTripEstimatedTime(
                currentTripId,
                estimatedTimeString
              ) {
                if (!currentTripId) {
                  console.warn("No tripId provided, skipping time update.");
                  return;
                }

                try {
                  const payload = {
                    estimatedTime: estimatedTimeString,
                  };

                  const response = await apiClient.post(
                    `/trips/${currentTripId}/estimated-time`,
                    payload
                  );

                  console.log(
                    "Successfully updated estimated time:",
                    response.data
                  );
                  return response.data;
                } catch (error) {
                  console.error(
                    "Failed to update estimated time:",
                    error.response?.data || error.message
                  );
                }
              }
              updateTripEstimatedTime(tripId, totalDurationText);

              const getPointStringForUrl = (locObj) => {
                if (locObj.place_id) return `place_id:${locObj.place_id}`;
                const lat = locObj.latitude || locObj.geometry?.location?.lat;
                const lng = locObj.longitude || locObj.geometry?.location?.lng;
                if (lat && lng) return `${lat},${lng}`;
                return encodeURIComponent(
                  locObj.name || locObj.formatted_address || ""
                );
              };

              const allPoints = locations
                .map(getPointStringForUrl)
                .filter(Boolean);

              const directionsUrl = `http://googleusercontent.com/maps/dir/${allPoints.join(
                "/"
              )}`;

              if (setGoogleMapsLink) {
                setGoogleMapsLink(directionsUrl);
              }
            }
          } else {
            console.error("Directions request failed due to " + status);
            if (setGoogleMapsLink) setGoogleMapsLink("");
          }
        }
      );
    } else {
      if (setGoogleMapsLink) {
        setGoogleMapsLink("");
      }

      if (selectedPlace && selectedPlace.geometry?.location) {
        if (selectedPlace.geometry?.viewport) {
          map.fitBounds(selectedPlace.geometry.viewport);
        } else {
          map.setCenter(selectedPlace.geometry.location);
          map.setZoom(13);
        }
      } else if (locations.length > 0) {
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
