import React, { useState, useRef, useEffect } from "react";
import TripPlannerMap from "../components/TripPlannerMap";

import { useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import AutocompleteSearchField from "../components/AutoCompleteSearchField";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TripPlannerPage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // State to track API loading
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Container
        sx={{
          bgcolor: "gray",
          width: "70%",
          height: "70%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Box sx={{ flex: 1, height: "80%" }}>
          <TripPlannerMap
            selectedPlace={selectedPlace}
            marker={marker}
            markerRef={markerRef}
            onApiLoaded={() => setIsMapsApiLoaded(true)} // when api loaded notify
          />
        </Box>
        {/* section next to map w/ search bar, ai suggested trips, and button*/}
        <Container
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "lightGray",
            height: "80%",
          }}
        >
          {/* only reneder when api is loaded */}
          {isMapsApiLoaded ? (
            <AutocompleteSearchField onPlaceSelected={setSelectedPlace} />
          ) : (
            <TextField 
              id="search-place-autocomplete-loading"
              label="Loading map and search..."
              variant="outlined"
              fullWidth
              disabled
              sx={{ mb: 3, width: "80%" }}
            />
          )}

          <Box sx={{ bgcolor: "darkGray", height: "80%", width: "80%" }}></Box>
          <Button variant="contained" fullWidth sx={{ width: "80%" }} onClick={()=> { navigate('/tripsummary');}}>
            Let's Go!
          </Button>
        </Container>
      </Container>
    </Box>
  );
};

export default TripPlannerPage;
