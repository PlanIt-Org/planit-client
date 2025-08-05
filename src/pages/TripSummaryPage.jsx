import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Stack,
  Paper,
  Text,
  Group,
  Button,
  Avatar,
  Box,
  Flex,
  useMantineTheme,
  Card,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import TripPlannerMap from "../components/TripPlannerMap";
import NavBar from "../components/NavBar";
import LocationCarousel from "../components/LocationCarousel";
import TripDetails from "../components/TripDetails";
import TripGuestList from "../components/TripGuestList";
import CommentGrid from "../components/CommentGrid";
import NoCarouselLocation from "../components/NoCarouselLocation";
import RSVPForm from "../components/RSVPForm";
import TripTimes from "../components/TripTimes";
import apiClient from "../api/axios";
import { useProfilePicture } from "../hooks/useProfilePicture";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const AnimatedFlex = styled(Flex)`
  width: 100%;
  min-height: 100vh;
  align-items: stretch;
  flex-direction: ${({ ismobile }) => (ismobile === "true" ? "column" : "row")};
  background: ${({ theme }) => theme.colors["custom-palette"][9]};
  animation: ${fadeIn} 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const AnimatedBox = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: ${({ ismobile, theme }) =>
    ismobile === "true" ? theme.spacing.md : theme.spacing.lg};
  box-sizing: border-box;
  padding-bottom: ${({ ismobile }) => (ismobile === "true" ? "80px" : "20px")};
  background: ${({ theme }) => theme.colors["custom-palette"][9]};
  animation: ${fadeIn} 0.9s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Helper function outside the component
async function fetchAllCommentsForTrip(tripId) {
    try {
      const response = await apiClient.get(`/comments/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments for trip:", error);
      throw error;
    }
}


const TripSummaryPage = ({ selectedCity, userId, userObj }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [locations, setLocations] = useState([]);
  const [tripData, setTripData] = useState(null); // Use a single object for trip data
  const [comments, setComments] = useState([]);
  const [RSVPStatus, setRSVPStatus] = useState(null);
  const [isTimeLoading, setIsTimeLoading] = useState(true);

  const { generateAvatarUrl } = useProfilePicture(userObj);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Derived state - no need for separate useState
  const ownTrip = tripData ? String(tripData.hostId) === String(userId) : false;
  const tripStatus = tripData ? tripData.status : null;

  useEffect(() => {
    if (!id) return;
  
    const fetchAllPageData = async () => {
      try {
        setIsTimeLoading(true);
  
        // 1. Fetch all data concurrently
        const [tripRes, commentsRes] = await Promise.all([
          apiClient.get(`/trips/${id}`), // Fetch the main trip object which includes locations, host, etc.
          fetchAllCommentsForTrip(id),
        ]);
        
        const fetchedTrip = tripRes.data.trip;
        setTripData(fetchedTrip);

        // --- Process Locations ---
        const dbLocations = fetchedTrip.locations || [];
        const transformedLocations = dbLocations.map((loc) => ({
            name: loc.name, 
            address: loc.address, 
            googlePlaceId: loc.googlePlaceId, 
            imageUrl: loc.image, 
            types: loc.types,
            geometry: { location: { lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) } },
        }));
        setLocations(transformedLocations);
        
        // --- Process Comments (with safety check) ---
        const formattedComments = commentsRes.map((comment) => ({
          id: comment.id,
          // THE FIX for the crash: Use optional chaining
          author: { name: comment.author?.name || "Unknown User", avatar: generateAvatarUrl(comment.author?.email) },
          text: comment.text,
          location: comment.location?.name || "",
        }));
        setComments(formattedComments);
        
        // --- Process RSVP Status (with race condition fix) ---
        const isOwner = String(fetchedTrip.hostId) === String(userId);
        if (isOwner) {
          setRSVPStatus(null); // Hosts can't RSVP
        } else {
          try {
            const rsvpRes = await apiClient.get(`/trip/${id}/my-rsvp`);
            setRSVPStatus(rsvpRes.data?.status?.toLowerCase() || null);
          } catch (error) {
            if (error.response?.status === 404) {
              setRSVPStatus(null); // Not RSVP'd yet
            }
          }
        }
  
      } catch (err) {
        console.error("Failed to fetch page data:", err);
        notifications.show({ title: "Error", message: "Could not load trip details.", color: "red" });
      } finally {
        setIsTimeLoading(false);
      }
    };
  
    fetchAllPageData();
  }, [id, userId]); // Removed userObj as generateAvatarUrl can be passed down


  const handlePublish = async () => {
    if (!tripData) return;
    const newStatus = tripStatus === "ACTIVE" ? "PLANNING" : "ACTIVE";
    try {
      await apiClient.put(`/trips/${id}/status`, { status: newStatus });
      setTripData(prev => ({...prev, status: newStatus})); // Update local state immediately
      notifications.show({
        title: `Trip ${newStatus === "ACTIVE" ? "Published" : "Unpublished"}`,
        message: newStatus === "ACTIVE" ? "Your trip is now live!" : "Your trip is back to draft mode.",
        color: "green",
      });
    } catch (err) {
      console.error("Failed to update trip status:", err);
      notifications.show({ title: "Error", message: `Could not update trip status.`, color: "red" });
    }
  };

  // The rest of your component's JSX will now use the derived state
  // (ownTrip, tripStatus) and the fetched state (locations, comments, etc.)
  // For brevity, the JSX is omitted but should remain structurally the same.
  // Just ensure it uses `tripData` where appropriate, e.g., `tripData.isPrivate`.

  return (
    <>
      <AnimatedFlex theme={theme} ismobile={isMobile ? "true" : "false"}>
        {!isMobile && <NavBar />}
        <AnimatedBox theme={theme} ismobile={isMobile ? "true" : "false"}>
          {isMobile ? (
            //----------------------------------------------------------> Mobile layout - vertical stack <---------------------------------------------------------
            <Stack spacing="lg">
              <Group style={{ width: "100%" }}>
                {ownTrip && tripStatus === "PLANNING" && (
                  <Button
                    size="sm"
                    radius="md"
                    onClick={() => {
                      navigate(`/tripplanner/${id}`);
                    }}
                  >
                    Back
                  </Button>
                )}
                <Paper
                  withBorder
                  radius="md"
                  p="sm"
                  className="bg-white"
                  flex={1}
                >
                  <TripTimes
                    currTripId={id}
                    tripStatus={tripStatus}
                    locations={locations}
                  />
                </Paper>
              </Group>

              <TripDetails
                tripId={id}
                ownTrip={ownTrip}
                tripStatus={tripStatus}
                isPrivate={tripData?.isPrivate}
                setIsPrivate={(isPrivate) => setTripData(prev => ({...prev, isPrivate}))}
              />

              <RSVPForm
                tripId={id}
                ownTrip={ownTrip}
                RSVPStatus={RSVPStatus}
                setRSVPStatus={setRSVPStatus}
                userId={userId}
              />

              <Paper
                withBorder
                radius="md"
                className="bg-gray-100"
                style={{
                  height: "300px",
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
                    locations={locations}
                    selectedCity={selectedCity}
                    showRoutes={true}
                    mapHeight="300px"
                    tripId={id}
                  />
                </div>
              </Paper>

              {locations.length < 3 ? (
                <NoCarouselLocation
                  locations={locations}
                  comments={comments}
                />
              ) : (
                <LocationCarousel
                  locations={locations}
                  comments={comments}
                />
              )}

              <TripGuestList tripId={id} />

              <CommentGrid
                tripId={id}
                locations={locations}
                userId={userId}
                comments={comments}
                setComments={setComments}
                userObj={userObj}
              />

              {ownTrip && tripStatus && (
                <Group justify="center">
                  <Button
                    color={tripStatus === "ACTIVE" ? "red" : "green"}
                    onClick={handlePublish}
                    size="lg"
                    fullWidth
                  >
                    {tripStatus === "ACTIVE" ? "Edit" : "Publish"}
                  </Button>
                </Group>
              )}
            </Stack>
          ) : (
            //----------------------------------------------------------> Desktop layout - vertical stack <---------------------------------------------------------
            <Grid gutter="xl" className="p-4" m="xl">
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

                    <Paper
                      withBorder
                      radius="md"
                      p="sm"
                      className="bg-white"
                      flex={1}
                    >
                      <TripTimes
                        currTripId={id}
                        tripStatus={tripStatus}
                        locations={locations}
                      />
                    </Paper>
                  </Group>

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
                        locations={locations}
                        selectedCity={selectedCity}
                        showRoutes={true}
                        mapHeight="100%"
                        tripId={id}
                      />
                    </div>
                  </Paper>

                  {locations.length < 3 ? (
                    <NoCarouselLocation
                      locations={locations}
                      comments={comments}
                    />
                  ) : (
                    <LocationCarousel
                      locations={locations}
                      comments={comments}
                    />
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={5}>
                <Stack spacing="xl">
                  <TripDetails
                    tripId={id}
                    ownTrip={ownTrip}
                    tripStatus={tripStatus}
                    isPrivate={tripData?.isPrivate}
                    setIsPrivate={(isPrivate) => setTripData(prev => ({...prev, isPrivate}))}
                  />
                  <RSVPForm
                    tripId={id}
                    ownTrip={ownTrip}
                    RSVPStatus={RSVPStatus}
                    setRSVPStatus={setRSVPStatus}
                    userId={userId}
                    tripStatus={tripStatus}
                  />
                  <TripGuestList tripId={id} />
                  <CommentGrid
                    tripId={id}
                    locations={locations}
                    userId={userId}
                    comments={comments}
                    setComments={setComments}
                    userObj={userObj}
                  />
                  <Group justify="flex-end">
                    {ownTrip && tripStatus && (
                      <Button
                        color={tripStatus === "ACTIVE" ? "red" : "green"}
                        onClick={handlePublish}
                      >
                        {tripStatus === "ACTIVE" ? "Edit" : "Publish"}
                      </Button>
                    )}
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          )}
        </AnimatedBox>
        {isMobile && (
          <Box
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              zIndex: 1000,
              backgroundColor: theme.colors["custom-palette"][8],
              borderTop: `1px solid ${theme.colors["custom-palette"][6]}`,
            }}
          >
            <NavBar />
          </Box>
        )}
      </AnimatedFlex>
    </>
  );
};

export default TripSummaryPage;
