import React from "react";
import { Box, Image, Title, Text, Group, Stack } from "@mantine/core";
const TripCard = () => {
  const randomId = Math.floor(Math.random() * 10) + 10;
  return (
    <Stack
      justify="center"
      p="md"
      style={{ border: "1px solid #dee2e6", height: "100%" }}
    >
      <Image
        h={200}

        fit="cover"
        src={`https://picsum.photos/id/${randomId}/200/300`}
      />
      <Title> Title</Title>
      <Text component="p"> Host By User</Text>
      <Text component="p"> Date</Text>
    </Stack>
  );
};

export default TripCard;
