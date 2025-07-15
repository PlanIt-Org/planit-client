import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { TextInput, } from "@mantine/core";
import { IconPlus, IconSearch } from '@tabler/icons-react';


const AutocompleteSearchField = ({ onPlaceSelected }) => {

  const { ref: autocompleteInputRef } = usePlacesWidget({
    onPlaceSelected: (place) => {
      console.log("Place selected by react-google-autocomplete:", place);
      onPlaceSelected(place); // pass selected place up

      if (autocompleteInputRef.current && place.name) {
        autocompleteInputRef.current.value = place.name; // auto fill name
      }
    },
    options: {
      types: ["geocode", "establishment"],
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
      leftSection={<IconSearch size={18} stroke={1.5} />}
      label="Search for a place"
      placeholder="e.g., Eiffel Tower, Paris"
      variant="filled"
      style={{
        backgroundColor: "white",
        margin: "10px", 
        borderRadius: "4px", 
      }}
      ref={autocompleteInputRef}
    />
  );
};

export default AutocompleteSearchField;
