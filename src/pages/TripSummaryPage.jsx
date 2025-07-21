import React, { useState } from "react";
import {
  Grid,
  Stack,
  Paper,
  Text,
  Group,
  Button,
  Avatar,
  Card,
  Image,
  Box,
  Title,
  Modal,
  Container,
  Combobox,
  useCombobox,
  InputBase,
  Input,
  Flex,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import {
  IconBubbleFilled,
  IconChevronCompactRight,
  IconChevronCompactLeft,
  IconShare,
} from "@tabler/icons-react";
// TODO: DELETE THIS AFTER BACKEND  IS CONNECTED
import { LoremIpsum } from "react-lorem-ipsum";
import { useDisclosure } from "@mantine/hooks";
import TripPlannerMap from "../components/TripPlannerMap";
import { notifications } from "@mantine/notifications";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import LocationCarousel from "../components/LocationCarousel";
import TripDetails from "../components/TripDetails";
import TripGuestList from "../components/TripGuestList";
import TripLocationModal from "../components/TripLocationModal";
import CommentGrid from "../components/CommentGrid";
// https://pravatar.cc is a random avatar generator btw

const TripSummaryPage = ({ selectedCity, locations, selectedPlace }) => {
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [filterValue, setFilterValue] = React.useState(null);
  const combobox = useCombobox({});
  const navigate = useNavigate();

  const handleOpenGoogleMaps = () => {
    if (googleMapsLink) {
      window.open(googleMapsLink, "_blank"); // open link in new tab
    } else {
      notifications.show({
        title: "No Directions Available",
        message:
          "Please ensure a valid trip route is displayed to open in Google Maps.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <Flex
        style={{
          width: "100%",
          minHeight: "100vh",
          alignItems: "stretch",
        }}
      >
        <NavBar />
        {/* main content */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            padding: 20,
            boxSizing: "border-box",
          }}
        ></Box>

        <Grid gutter="xl" className="p-4" m="xl">
          {/* Left Column */}
          <Grid.Col span={7}>
            <Stack spacing="xl">
              <Group style={{ width: "100%" }}>
                <Button
                  size="md"
                  radius="md"
                  onClick={() => {
                    navigate("/tripplanner");
                  }}
                >
                  Back
                </Button>
                {/* Time Information */}
                <Paper
                  withBorder
                  radius="md"
                  p="sm"
                  className="bg-white"
                  flex={1}
                >
                  <Group position="apart" justify="space-between">
                    <Text size="sm" color="dimmed">
                      Start Time:
                    </Text>
                    <Text size="sm" color="dimmed">
                      End Time:
                    </Text>
                    <Text size="sm" color="dimmed">
                      Estimated Total Time:
                    </Text>
                  </Group>
                </Paper>
              </Group>

              {/* Main Image/Map */}
              <Paper
                withBorder
                radius="md"
                className="bg-gray-100"
                style={{
                  height: "350px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <TripPlannerMap
                    selectedPlace={selectedPlace}
                    locations={locations}
                    selectedCity={selectedCity}
                    showRoutes={true}
                    mapHeight="100%"
                    setGoogleMapsLink={setGoogleMapsLink}
                  ></TripPlannerMap>
                </div>
              </Paper>
              <Group justify="center">
                <Button
                  variant="light"
                  leftSection={<IconShare size={18} />}
                  mt="md"
                  fullWidth
                  onClick={handleOpenGoogleMaps}
                >
                  Open In Google Maps
                </Button>
              </Group>
              {/* Bottom Image Placeholders / location cards */}
              <LocationCarousel></LocationCarousel>
            </Stack>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={5}>
            <Stack spacing="xl">
              {/* Trip Details Card */}
              <TripDetails></TripDetails>
              <TripGuestList></TripGuestList>
              {/* Guest List Section */}
              {/* Comments Section */}
              <CommentGrid> </CommentGrid>
              <Group justify="flex-end">
                <Button>Edit</Button>
                <Button>Publish</Button>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Flex>
    </>
  );
};

export default TripSummaryPage;
