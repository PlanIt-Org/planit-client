import React from "react";
import { Card, Image, Box, Group, Text, Title } from "@mantine/core";
import { IconBubbleFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TripLocationModal from "./TripLocationModal";
import { useState } from "react";
import RouteBetween from "./RouteBetween";

// Helper function to safely get coordinates from a location object
const getCoords = (loc) => {
  // Check for the most common structure first: geometry.location with lat/lng properties
  if (loc?.geometry?.location?.lat && loc?.geometry?.location?.lng) {
    const lat = typeof loc.geometry.location.lat === 'function' ? loc.geometry.location.lat() : loc.geometry.location.lat;
    const lng = typeof loc.geometry.location.lng === 'function' ? loc.geometry.location.lng() : loc.geometry.location.lng;
    return { lat, lng };
  }
  // Fallback for other possible structures (e.g., direct latitude/longitude properties)
  if (loc?.latitude && loc?.longitude) {
    return { lat: loc.latitude, lng: loc.longitude };
  }
  // If no valid coordinates are found, return null
  return null;
};

const NoCarouselLocation = ({ locations, comments, setEstimatedTime, estimatedTime }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [finalMode, setFinalMode] = useState(null);

  const handleCardClick = (location) => {
    setSelectedLocation(location);
    open();
  };

  return (
    <Box w="100%">
      <Group grow align="stretch" spacing="md">
        {locations.map((loc, index) => {
          // Use the helper function to safely get coordinates
          const originCoords = getCoords(loc);
          const destinationCoords = index < locations.length - 1 ? getCoords(locations[index + 1]) : null;

          return (
            <React.Fragment key={loc.place_id || index}>
              <Card
                withBorder
                radius="md"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(loc)}
              >
                <Card.Section>
                  <Image
                    src={
                      loc.imageUrl ||
                      `https://picsum.photos/300/200?random=${index}`
                    }
                    alt={loc.name}
                    height={200}
                    fit="cover"
                  />
                </Card.Section>

                <Box p="md" style={{ flexGrow: 1 }}>
                  <Group justify="space-between" mt={4} mb={2}>
                    <Title fw={500} size="xl">
                      {loc.name}
                    </Title>
                  </Group>
                  <Text size="sm" c="dimmed" component="div">
                    <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                      <li>{loc.address}</li>
                    </ul>
                  </Text>
                </Box>

                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "white",
                    borderRadius: "50%",
                    padding: 4,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 2,
                  }}
                >
                  <IconBubbleFilled size={24} color="#333" />
                </div>
              </Card>

              {/* Only render RouteBetween if both origin and destination coordinates are valid */}
              {index < locations.length - 1 && originCoords && destinationCoords && (
                <Box
                  style={{
                    flex: "0 0 auto",
                    width: "140px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RouteBetween
                    finalMode={finalMode}
                    setFinalMode={setFinalMode}
                    setEstimatedTime={setEstimatedTime}
                    estimatedTime={estimatedTime}
                    origin={`${originCoords.lat},${originCoords.lng}`}
                    destination={`${destinationCoords.lat},${destinationCoords.lng}`}
                  />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Group>

      <TripLocationModal
        opened={opened}
        open={open}
        close={close}
        location={selectedLocation}
        comments={comments}
      />
    </Box>
  );
};

export default NoCarouselLocation;
