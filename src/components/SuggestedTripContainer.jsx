import React from "react";
import SuggestedTrip from "./SuggestedTrip";
import { Box, Stack } from "@mantine/core";

const SuggestedTripContainer = () => {
  return (
    <Stack spacing="md">
      <SuggestedTrip></SuggestedTrip>
      <SuggestedTrip></SuggestedTrip>
      <SuggestedTrip></SuggestedTrip>
      <SuggestedTrip></SuggestedTrip>
      <SuggestedTrip></SuggestedTrip>
    </Stack>
  );
};

export default SuggestedTripContainer;
