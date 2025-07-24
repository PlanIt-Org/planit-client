import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const CityAutoCompleteSearchField = ({ onPlaceSelected, styles }) => {
  const { ref: autocompleteInputRef } = usePlacesWidget({
    onPlaceSelected: (place) => {
      console.log("City selected by react-google-autocomplete:", place);
      onPlaceSelected(place);

      if (autocompleteInputRef.current && place.formatted_address) {
        autocompleteInputRef.current.value = place.formatted_address;
      }
    },
    options: {
      types: ["(cities)"],
      fields: ["geometry", "name", "formatted_address", "place_id", "types"],
    },
  });

  return (
    <TextInput
      leftSection={<IconSearch size={24} stroke={1.5} />}
      placeholder="e.g. San Francisco, CA, USA"
      variant="filled"
      size="lg"
      styles={styles}
      ref={autocompleteInputRef}
    />
  );
};

export default CityAutoCompleteSearchField;
