import React from "react";
import SuggestedTrip from "./SuggestedTrip";
import { Stack } from "@mantine/core";

const SuggestedTripGrid = () => {
  return (
    <Stack spacing="md">
      <SuggestedTrip />
      <SuggestedTrip />
      <SuggestedTrip />
      <SuggestedTrip />
      <SuggestedTrip />
    </Stack>
  );
};

export default SuggestedTripGrid;
