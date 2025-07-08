import React from 'react';
import { TextField } from '@mui/material';
import { usePlacesWidget } from 'react-google-autocomplete';

// This component will only be mounted when the Google Maps API is ready
const AutocompleteSearchField = ({ onPlaceSelected }) => {
  // usePlacesWidget hook is called unconditionally within THIS component
  const { ref: autocompleteInputRef } = usePlacesWidget({
    onPlaceSelected: (place) => {
      console.log("Place selected by react-google-autocomplete:", place);
      onPlaceSelected(place); // Pass the selected place up

      if (autocompleteInputRef.current && place.name) {
        autocompleteInputRef.current.value = place.name; // auto fill name
      }
    },
    options: {
      types: ["geocode", "establishment"],
      // TODO: add "photos" field later
      fields: ["geometry", "name", "formatted_address", "place_id", "types"],
    },
  });

  return (
    <TextField
      id="map-autocomplete-search"
      label="Search for a place"
      variant="outlined" // Use 'outlined' as in your TripPlanning.jsx now
      fullWidth
      sx={{
        backgroundColor: 'white',
        margin: '10px', // Adjust margin as needed for right panel
        width: '300px', // Adjust width for right panel
        boxShadow: 'none', // Remove box shadow for standard TextField
        borderRadius: '4px',
      }}
      inputRef={autocompleteInputRef} // Assign the ref from usePlacesWidget here
    />
  );
};

export default AutocompleteSearchField;