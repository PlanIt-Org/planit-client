import React from "react";
import { TextInput } from "@mantine/core";
import { usePlacesWidget } from "react-google-autocomplete";

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
      fields: [
        "geometry",
        "name",
        "formatted_address",
        "place_id",
        "types",
        "photos",
      ],
    },
  });

  return (
    <TextInput
      id="map-autocomplete-search"
      label="Search for a place"
      placeholder="Type a place..."
      ref={autocompleteInputRef} // Assign the ref from usePlacesWidget here
      style={{
        backgroundColor: "white",
        margin: "10px",
        width: "300px",
        boxShadow: "none",
        borderRadius: "4px",
      }}
      inputRef={autocompleteInputRef} // Assign the ref from usePlacesWidget here
    />
  );
};

export default AutocompleteSearchField;
