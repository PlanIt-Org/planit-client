import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_GEO_URL = import.meta.env.VITE_GEO_API_KEY;

import {
  IconBubbleFilled,
  IconChevronCompactRight,
  IconChevronCompactLeft,
  IconShare,
} from "@tabler/icons-react";

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
import NoCarouselLocation from "../components/NoCarouselLocation";
import RSVPForm from "../components/RSVPForm";
import TripTimes from "../components/TripTimes";
import apiClient from "../api/axios";

const TripSummaryPage = ({
  selectedCity,
  locations,
  selectedPlace,
  setLocations,
  userId,
}) => {
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [filterValue, setFilterValue] = React.useState(null);
  const combobox = useCombobox({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [currTripId, setCurrTripId] = useState(null);
  const [tripStatus, setTripStatus] = useState(null);
  const [ownTrip, setOwnTrip] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isTimeLoading, setIsTimeLoading] = useState(true);
  const [RSVPStatus, setRSVPStatus] = useState(null);
  const [comments, setComments] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Debug log for estimatedTime
  useEffect(() => {
    console.log("Estimated time updated:", estimatedTime);
  }, [estimatedTime]);

  useEffect(() => {
    if (id) {
      setCurrTripId(id);
    }
    console.log("This is the ID:", id);
  }, [id]);

  useEffect(() => {
    // If there's no trip ID, do nothing.
    if (ownTrip) {
      return;
    }
    if (!currTripId) {
      setIsTimeLoading(false);
      return;
    }

    const fetchLocationsAndStatus = async () => {
      try {
        const response = await apiClient.get(`/trips/${currTripId}/locations`);
        const dbLocations = response.data.locations;

        if (!Array.isArray(dbLocations)) {
          console.error("Invalid response format:", response.data);
          setLocations([]);
          return;
        }

        const transformed = dbLocations.map((loc) => ({
          name: loc.name,
          formatted_address: loc.address,
          place_id: loc.googlePlaceId,
          imageUrl: loc.image,
          types: loc.types,
          geometry: {
            location: {
              lat: loc.latitude,
              lng: loc.longitude,
            },
          },
        }));

        setLocations(transformed);

        const hostRes = await apiClient.get(`/trips/${currTripId}/host`);
        const { hostId } = hostRes.data;

        setOwnTrip(String(hostId) === String(userId));

        console.log("hostId:", hostId);
        console.log("userId:", userId);
        console.log("ownTrip?", String(hostId) === String(userId));

        const tripRes = await apiClient.get(`/trips/${currTripId}/status`);
        setTripStatus(tripRes.data?.data?.status);
        console.log("Trip status is:", tripRes.data?.data?.status);
      } catch (err) {
        console.error("Failed to fetch locations or trip status:", err);
      }
    };

    fetchLocationsAndStatus();
  }, [currTripId, setLocations, userId, ownTrip]);

  useEffect(() => {
    // Add a log to see if the hook is being skipped
    if (ownTrip) {
      console.log("RSVP fetch skipped: User owns the trip.");
      // If the user is the owner, they can't RSVP. Set status to a final state.
      setRSVPStatus(null);
      return;
    }
    if (!currTripId || !userId) {
      console.log("RSVP fetch skipped: Missing tripId or userId.");
      return;
    }

    const fetchRsvpStatus = async () => {
      // Reset status to loading every time the tripId changes
      setRSVPStatus(undefined);
      console.log(
        `Requesting RSVP status for trip: /trip/${currTripId}/my-rsvp`
      );

      try {
        const response = await apiClient.get(`/trip/${currTripId}/my-rsvp`);

        // CRITICAL STEP: Log the entire response from the server
        console.log("✅ Full API Response for my-rsvp:", response);

        // Check if the data and status property exist before trying to access them
        if (response && response.data && response.data.status) {
          const status = response.data.status.toLowerCase();
          console.log("✅ SUCCESS: Setting RSVPStatus to:", status);
          setRSVPStatus(status);
        } else {
          // This will catch cases where the API response has an unexpected format
          console.error("❌ API response format is unexpected:", response.data);
          setRSVPStatus(null); // Set to a non-loading state
        }
      } catch (error) {
        if (error.response) {
          // Log the full error response if the API call fails
          console.error("❌ API Error fetching RSVP status:", error.response);
          if (error.response.status === 404) {
            console.log(
              "User has not RSVP'd yet (404). Setting status to null."
            );
            setRSVPStatus(null);
          } else {
            // For other errors (like 500), set to null to stop the loading state
            setRSVPStatus(null);
          }
        } else {
          // Handle network errors where there's no response object
          console.error(
            "❌ Network error fetching RSVP status:",
            error.message
          );
        }
      }
    };

    fetchRsvpStatus();
  }, [currTripId, userId, ownTrip]);

  ////Commentss

  /**
   * Fetches all comments for a specific trip ID.
   * @param {string} tripId - The ID of the trip.
   * @returns {Promise<Array>} An array of comment objects.
   */
  async function fetchAllCommentsForTrip(tripId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}comments/trips/${tripId}`
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments for trip:", error);
      throw error;
    }
  }

  useEffect(() => {
    // Create a new async function inside the useEffect
    const loadComments = async () => {
      if (currTripId) {
        // 3. Now you can safely use 'await' here
        const allCommentsFromDB = await fetchAllCommentsForTrip(currTripId);
        console.log("all commentsx", allCommentsFromDB);

        const newFormatedComments = allCommentsFromDB.map((comment) => ({
          // <-- Note the parentheses for implicit return
          id: comment.id, // <-- Use the original comment's ID
          author: {
            // Use a fallback in case the name is null
            name: comment.author.name || comment.author.email,
            avatar: "https://i.pravatar.cc/150?img=5", // Or a real avatar URL if you have one
          },
          text: comment.text, // <-- Use the original comment's text
          // Assuming location is a nested object, otherwise use comment.locationId
          location: comment.location.name || "General Comment",
        }));
        setComments(newFormatedComments);
      }
    };

    loadComments(); // Call the new async function
  }, [currTripId]); // The effect runs whenever tripId changes

  useEffect(() => {
    console.log(
      `%cRSVPStatus changed to: %c${RSVPStatus}`,
      "color: blue; font-weight: bold;",
      "color: green; font-weight: bold;"
    );
  }, [RSVPStatus]);

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

  const handlePublish = async (tripId) => {
    const newStatus = tripStatus === "ACTIVE" ? "PLANNING" : "ACTIVE";

    try {
      await apiClient.put(`/trips/${tripId}/status`, {
        status: newStatus,
      });

      setTripStatus(newStatus);

      notifications.show({
        title: `Trip ${newStatus === "ACTIVE" ? "Published" : "Unpublished"}`,
        message:
          newStatus === "ACTIVE"
            ? "Your trip is now live!"
            : "Your trip is back to draft mode.",
        color: "green",
      });
    } catch (err) {
      console.error("Failed to update trip status:", err);
      notifications.show({
        title: "Error",
        message: `Could not ${
          newStatus === "ACTIVE" ? "publish" : "unpublish"
        } the trip.`,
        color: "red",
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
        <NavBar setLocations={setLocations} />
        {/* main content */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <Grid gutter="xl" className="p-4" m="xl">
            {/* Left Column */}
            <Grid.Col span={7}>
              <Stack spacing="xl">
                <Group style={{ width: "100%" }}>
                  {ownTrip && tripStatus === "PLANNING" && (
                    <Button
                      size="md"
                      radius="md"
                      onClick={() => {
                        navigate(`/tripplanner/${id}`);
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {/* Time Information */}
                  <Paper
                    withBorder
                    radius="md"
                    p="sm"
                    className="bg-white"
                    flex={1}
                  >
                    <TripTimes
                      currTripId={currTripId}
                      tripStatus={tripStatus}
                      locations={locations}
                      estimatedTime={estimatedTime}
                      setEstimatedTime={setEstimatedTime}
                    />
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
                      tripId={id}
                    ></TripPlannerMap>
                  </div>
                </Paper>
                <Group justify="center">
                  {/* <Button
                    variant="light"
                    leftSection={<IconShare size={18} />}
                    mt="md"
                    fullWidth
                    onClick={handleOpenGoogleMaps}
                  >
                    Open In Google Maps
                  </Button> */}
                </Group>
                {/* Bottom Image Placeholders / location cards */}

                {locations.length < 3 ? (
                  <NoCarouselLocation
                    locations={locations}
                    comments={comments}
                    setEstimatedTime={setEstimatedTime}
                  />
                ) : (
                  <LocationCarousel
                    locations={locations}
                    comments={comments}
                    setEstimatedTime={setEstimatedTime}
                    estimatedTime = {estimatedTime}
                  />
                )}
              </Stack>
            </Grid.Col>
            {/* Right Column */}
            <Grid.Col span={5}>
              <Stack spacing="xl">
                {/* Trip Details Card */}
                <TripDetails
                  tripId={id}
                  ownTrip={ownTrip}
                  tripStatus={tripStatus}
                  isPrivate={isPrivate}
                  setIsPrivate={setIsPrivate}
                ></TripDetails>
                <RSVPForm
                  tripId={id}
                  ownTrip={ownTrip}
                  RSVPStatus={RSVPStatus}
                  setRSVPStatus={setRSVPStatus}
                  userId={userId}
                ></RSVPForm>
                {/* <TripGuestList tripId={id}></TripGuestList> */}
                {/* Comments Section */}
                <CommentGrid
                  tripId={id}
                  locations={locations}
                  userId={userId}
                  comments={comments}
                  setComments={setComments}
                >
                  {" "}
                </CommentGrid>
                <Group justify="flex-end">
                  {ownTrip && tripStatus && (
                    <Button
                      color={tripStatus === "ACTIVE" ? "red" : "green"}
                      onClick={() => handlePublish(currTripId)}
                    >
                      {tripStatus === "ACTIVE" ? "Edit" : "Publish"}
                    </Button>
                  )}
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      </Flex>
    </>
  );
};

export default TripSummaryPage;
