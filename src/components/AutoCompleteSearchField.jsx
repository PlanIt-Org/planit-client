import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { TextInput, useMantineTheme } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";

const AutocompleteSearchField = ({ onPlaceSelected }) => {
  const theme = useMantineTheme();
  const { ref: autocompleteInputRef } = usePlacesWidget({
    onPlaceSelected: (place) => {
      const imageUrl =
        place.photos && place.photos.length > 0
          ? place.photos[0].getUrl({ maxWidth: 400 })
          : null;

      const placeWithImage = {
        ...place,
        imageUrl,
      };

      console.log("Place selected with image URL:", placeWithImage);
      onPlaceSelected(placeWithImage);

      if (autocompleteInputRef.current && place.name) {
        autocompleteInputRef.current.value = place.name;
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
        // "photos",
      ],
    },
  });

  return (
    <TextInput
      leftSection={<IconSearch size={18} stroke={1.5} />}
      label="Search for a place"
      placeholder="e.g., Eiffel Tower, Paris"
      variant="filled"
      styles={{
        input: {
          background: theme.colors["custom-palette"][8],
          color: theme.colors["custom-palette"][1],
          borderRadius: theme.radius.md,
        },
        root: {
          margin: "10px",
        },
      }}
      ref={autocompleteInputRef}
    />
  );
};

export default AutocompleteSearchField;
