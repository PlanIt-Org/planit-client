import React from "react";
import { Carousel } from "@mantine/carousel";
import { Card, Image, Box, Group, Text, Title } from "@mantine/core";
import { LoremIpsum } from "react-lorem-ipsum";
import {
  IconBubbleFilled,
  IconChevronCompactRight,
  IconChevronCompactLeft,
  IconShare,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TripLocationModal from "./TripLocationModal";
import { useState } from "react";
import RouteBetween from "./RouteBetween";

const LocationCarousel = ({ locations, comments, setEstimatedTime, estimatedTime }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [finalMode, setFinalMode] = useState(null);

  const handleCardClick = (location) => {
    setSelectedLocation(location);
    open();
  };

  return (
    <Carousel
      withIndicators
      slideGap={{ base: 0, sm: "md" }}
      slideSize="33.3333%"
      emblaOptions={{ loop: false, align: "start" }}
      nextControlIcon={<IconChevronCompactRight size={30} />}
      previousControlIcon={<IconChevronCompactLeft size={30} />}
    >
      {locations.map((loc, index) => (
        <React.Fragment key={loc.id || index}>
          {/* Location Card */}
          <Carousel.Slide>
            <Card
              withBorder
              radius="md"
              className="relative bg-gray-100 flex items-center justify-center"
              style={{
                overflow: "hidden",
                padding: 0,
                minWidth: 0,
                cursor: "pointer",
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
                  width="100%"
                  height={200}
                  fit="cover"
                />
              </Card.Section>
              <Box m="md">
                <Group justify="space-between" mt={4} mb={2}>
                  <Title fw={500} size="XL">
                    {loc.name}
                  </Title>
                </Group>
                <Text size="m" c="dimmed">
                  <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                    <li>{loc.formatted_address}</li>
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconBubbleFilled size={24} color="#333" />
              </div>
            </Card>
          </Carousel.Slide>
          {index < locations.length - 1 && (
       
              <Box
                style={{

                  width: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin:" 0 1rem 0.5rem 0.5rem",
                }}
              >
                <RouteBetween
                  finalMode={setFinalMode}
                  setFinalMode={setFinalMode}
                  setEstimatedTime={setEstimatedTime}
                  estimatedTime = {estimatedTime}
                  estimatedTi
                  origin={`${loc.geometry.location.lat},${loc.geometry.location.lng}`}
                  destination={`${locations[index + 1].geometry.location.lat},${
                    locations[index + 1].geometry.location.lng
                  }`}
                />
              </Box>
  
          )}
        </React.Fragment>
      ))}
      <TripLocationModal
        opened={opened}
        open={open}
        close={close}
        location={selectedLocation}
        comments={comments}
      />
      <Box mt="md"></Box>
    </Carousel>
  );
};

export default LocationCarousel;
