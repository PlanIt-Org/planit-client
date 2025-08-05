import React from "react";
import { Carousel } from "@mantine/carousel";
import { Card, Image, Box, Group, Text, Title, useMantineTheme } from "@mantine/core";
import {
  IconBubbleFilled,
  IconChevronCompactRight,
  IconChevronCompactLeft,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import TripLocationModal from "./TripLocationModal";
import { useState } from "react";
import RouteBetween from "./RouteBetween";

const LocationCarousel = ({ locations, comments,  }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [estimatedTime, setEstimatedTime] = useState();
  const [finalMode, setFinalMode] = useState(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleCardClick = (location) => {
    setSelectedLocation(location);
    open();
  };

  const carouselSlides = [];

  locations.forEach((loc, index) => {
    // Add the location card slide
    carouselSlides.push(
      <Carousel.Slide
        key={loc.id || `loc-${index}`}
        // --- THIS IS THE CHANGE ---
        // On desktop, we give the location card a flexible base width.
        // It will grow to fill space but has a substantial minimum size.
        style={!isMobile ? { flex: '1 0 320px', minWidth: 0 } : {}}
      >
        <Card
          withBorder
          radius="md"
          style={{ overflow: 'hidden', padding: 0, cursor: 'pointer', height: '100%' }}
          onClick={() => handleCardClick(loc)}
        >
          <Card.Section>
            <Image src={loc.imageUrl || `https://picsum.photos/300/200?random=${index}`} alt={loc.name} height={200} fit="cover" />
          </Card.Section>
          <Box m="md">
            <Group justify="space-between" mt={4} mb={2}>
              <Title fw={500} size="xl">{loc.name}</Title>
            </Group>
            <Text size="sm" c="dimmed">
              {loc.address}
            </Text>
          </Box>
  
        </Card>
      </Carousel.Slide>
    );

    // If it's not the last location, add the route info as its own slide
    if (index < locations.length - 1) {
      carouselSlides.push(
        <Carousel.Slide
          key={`route-${index}`}
          // --- THIS IS THE CHANGE ---
          // On desktop, the route slide has a smaller, fixed width.
          // It will not grow or shrink.
          style={!isMobile ? { flex: '0 0 150px' } : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}
        >
          <RouteBetween
            finalMode={finalMode}
            setFinalMode={setFinalMode}
            // setEstimatedTime={setEstimatedTime}
            // estimatedTime={estimatedTime}
            origin={`${loc.geometry.location.lat},${loc.geometry.location.lng}`}
            destination={`${locations[index + 1].geometry.location.lat},${locations[index + 1].geometry.location.lng}`}
          />
        </Carousel.Slide>
      );
    }
  });


  return (
    <>
      <Carousel
        withIndicators
        slideGap="md"
        slideSize={isMobile ? "100%" : undefined}
        align="start"
        emblaOptions={{ loop: false, containScroll: 'trimSnaps' }}
        nextControlIcon={<IconChevronCompactRight size={30} />}
        previousControlIcon={<IconChevronCompactLeft size={30} />}
      >
        {carouselSlides}
      </Carousel>

      {/* Move the modal here, outside the Carousel */}
      <TripLocationModal
        opened={opened}
        open={open}
        close={close}
        location={selectedLocation}
        comments={comments}
      />
    </>
  );
};

export default LocationCarousel;
