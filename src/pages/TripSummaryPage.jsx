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
  MultiSelect,
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
import CommentGrid from "../components/CommentGrid";
// https://pravatar.cc is a random avatar generator btw

const TripSummaryPage = ({ selectedCity, locations, selectedPlace }) => {
  const [opened, { open, close }] = useDisclosure(false);
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
        {/* Location Modal */}
        <Modal opened={opened} onClose={close} title="MODAL" centered>
          <Container>
            <Card
              withBorder
              radius="md"
              className="relative bg-gray-100 flex items-center justify-center"
              style={{
                overflow: "hidden",
                padding: 0,
                minWidth: 0,
              }}
              onClick={open}
            >
              <Card.Section>
                <Image
                  src={`https://picsum.photos/300/200?random=`}
                  alt={`Trip image `}
                  width="100%"
                  fit="cover"
                />
              </Card.Section>
              <Box m="md">
                <Group justify="space-between" mt={4} mb={2}>
                  <Title fw={500} size="XL">
                    Title
                  </Title>
                </Group>
                <Text size="m" c="dimmed" component="div">
                  <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                    <li>
                      <LoremIpsum avgWordsPerSentence={1} p={1} />
                    </li>
                    <li>
                      <LoremIpsum avgWordsPerSentence={1} p={1} />
                    </li>
                  </ul>
                </Text>
              </Box>
            </Card>
          </Container>
        </Modal>
        <Grid gutter="xl" className="p-4" m="xl">
          {/* Left Column */}
          <Grid.Col span={7}>
            <Stack spacing="xl">
              <Group  style={{ width: "100%" }}>
                <Button size="md" radius="md" onClick={()=> {
                   navigate("/tripplanner");
                }}>Back</Button>
                {/* Time Information */}
                <Paper withBorder radius="md" p="sm" className="bg-white" flex={1}>
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
              <Carousel
                withIndicators
                slideGap={{ base: 0, sm: "md" }}
                slideSize="33.3333%"
                emblaOptions={{ loop: true, align: "start" }}
                nextControlIcon={<IconChevronCompactRight size={30} />}
                previousControlIcon={<IconChevronCompactLeft size={30} />}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <Carousel.Slide key={item}>
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
                      onClick={open}
                    >
                      <Card.Section>
                        <Image
                          src={`https://picsum.photos/300/200?random=${item}`}
                          alt={`Trip image ${item}`}
                          width="100%"
                          fit="cover"
                        />
                      </Card.Section>
                      <Box m="md">
                        <Group justify="space-between" mt={4} mb={2}>
                          <Title fw={500} size="XL">
                            Title
                          </Title>
                        </Group>
                        <Text size="m" c="dimmed" component="div">
                          <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                            <li>
                              <LoremIpsum avgWordsPerSentence={1} p={1} />
                            </li>
                            <li>
                              <LoremIpsum avgWordsPerSentence={1} p={1} />
                            </li>
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
                ))}
              </Carousel>
            </Stack>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={5}>
            <Stack spacing="xl">
              {/* Trip Details Card */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Group justify="space-between">
                    <Button variant="light">Add Hosts</Button>
                    <Button variant="filled" color="dark">
                      Leave Trip
                    </Button>
                  </Group>
                  <Stack
                    className="text-center py-4"
                    style={{ textAlign: "center" }}
                  >
                    <Box
                      p="md"
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                      }}
                    >
                      <Title size="xl" weight={700} mb={4}>
                        Title: THIS WHOLE SECTION WILL BE POPULATED FROM BACKEND
                      </Title>
                    </Box>
                    <Box
                      p="sm"
                      style={{
                        background: "#f3f4f6",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Text size="md" color="dimmed">
                        Trip description: All these boxes are placeholders for
                        later
                      </Text>
                    </Box>
                    <Group grow spacing="sm">
                      <Box
                        p="sm"
                        style={{
                          background: "#f9fafb",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Text size="sm" color="gray">
                          Day of the week, Date
                        </Text>
                      </Box>
                    </Group>
                    <Box
                      p="sm"
                      style={{
                        background: "#f3f4f6",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Text size="sm" color="gray" weight={500}>
                        HOSTED BY: NAME
                      </Text>
                    </Box>
                  </Stack>
                  <Button variant="light" fullWidth mt="md">
                    Copy Link
                  </Button>
                </Stack>
              </Card>

              {/* Guest List Section */}
              <Card
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                style={{
                  background: "#f3f4f6",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <Stack>
                  <Text>GUEST LIST: list of Invitees (PLACEHOLDER)</Text>
                  <Paper p="xs" withBorder>
                    <Group justify="center">
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=1`}
                        alt={"User 1"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=2`}
                        alt={"User 2"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=3`}
                        alt={"User 3"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=4`}
                        alt={"User 4"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=5`}
                        alt={"User 5"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=6`}
                        alt={"User 6"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=7`}
                        alt={"User 7"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=8`}
                        alt={"User 8"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=9`}
                        alt={"User 9"}
                      />
                    </Group>
                  </Paper>
                </Stack>
              </Card>

           <CommentGrid> </CommentGrid>
            </Stack>
          </Grid.Col>
        </Grid>
      </Flex>
    </>
  );
};

export default TripSummaryPage;
