import React from "react";
import {
  Container,
  Grid,
  Button,
  Group,
  Text,
  Modal,
  LoadingOverlay,
  Skeleton,
  Loader,
  Center,
  Stack,
  Divider,
} from "@mantine/core";
import TripCard from "./TripCard";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, useCallback, useRef } from "react";
import CopyTripLink from "./CopyTripLink";
import { useNavigate } from "react-router-dom";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 6;

const TripGrid = ({
  userId,
  active,
  savedOnly = false,
  discoverMode = false,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [allTrips, setAllTrips] = useState([]);
  const [visibleTrips, setVisibleTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();
  const { deleteTrip } = useDeleteTrip();
  const { session, loading: authLoading } = useAuth();
  const tripDetailsRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (tripDetailsRef.current) {
      navigator.clipboard.writeText(tripDetailsRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [tripDetailsRef]);

  const getFilteredTrips = useCallback(
    (trips = allTrips) => {
      if (discoverMode) {
        return trips;
      }
      const now = new Date(); // Current time is August 5, 2025, 4:32 PM PDT

      switch (active) {
        case "Drafts":
          return trips.filter(
            (trip) => trip.status === "PLANNING" && trip.hostId === userId
          );
        // --- UPDATED LOGIC IS HERE ---
        case "Upcoming":
          return trips.filter((trip) => {
            const isFutureDate = new Date(trip.endTime) >= now;
            const isHost = trip.hostId === userId;
            const isInvited = trip.invitedUsers?.some(
              (user) => user.id === userId
            );

    
            return (
              trip.status === "ACTIVE" && isFutureDate && (isHost || isInvited)
            );
          });
        // --- END OF UPDATED LOGIC ---

        case "Past Events":
          return trips.filter(
            (trip) =>
              trip.status === "COMPLETED" || new Date(trip.endTime) < now
          );

        case "Invited Trips":
          return trips.filter((trip) =>
            trip.invitedUsers?.some((user) => user.id === userId)
          );

        case "Hosting":
          return trips.filter((trip) => trip.hostId === userId);

        default:
          return trips;
      }
    },
    [allTrips, active, userId, discoverMode]
  );

  const fetchTrips = useCallback(async () => {
    let endpoint = "";

    if (discoverMode) {
      endpoint = "/trips/discover";
    } else if (savedOnly) {
      endpoint = "/trips/saved";
    } else if (userId) {
      endpoint = `/trips/user/${userId}`;
    } else {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoint);
      const data = response.data;
      setAllTrips(data.trips || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [discoverMode, savedOnly, userId]);

  const handleSaveToggle = (toggledTripId) => {
    if (savedOnly) {
      setAllTrips((prevTrips) =>
        prevTrips.filter((trip) => trip.id !== toggledTripId)
      );
      return;
    }

    setAllTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id === toggledTripId) {
          const isSaved = trip.savers?.some((saver) => saver.id === userId);
          let newSavers;

          if (isSaved) {
            newSavers = trip.savers.filter((saver) => saver.id !== userId);
          } else {
            const currentUser = {
              id: session.user.id,
              name: session.user.user_metadata.name || "User",
            };
            newSavers = [...(trip.savers || []), currentUser];
          }
          return { ...trip, savers: newSavers };
        }
        return trip;
      })
    );
  };

  useEffect(() => {
    if (!allTrips) return;
    const filtered = getFilteredTrips();
    setVisibleTrips(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  }, [active, allTrips]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (session) {
      fetchTrips();
    } else {
      setLoading(false);
      setAllTrips([]);
    }
  }, [authLoading, session, fetchTrips]);

  const handleDeleteTrip = async (tripId) => {
    const trip = allTrips.find((t) => t.id === tripId);
    if (!trip) return;

    await deleteTrip({
      id: tripId,
      onSuccess: () => {
        const updatedTrips = allTrips.filter((t) => t.id !== tripId);
        setAllTrips(updatedTrips);
        setPage(1);
      },
      onError: (err) => {
        console.error("Error deleting trip:", err);
      },
    });
  };

  useEffect(() => {
    const filtered = getFilteredTrips();
    setVisibleTrips(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  }, [allTrips, getFilteredTrips]);

  const handleCardClick = (trip) => {
    setSelectedTrip(trip);
    open();
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const nextPage = page + 1;
    const filtered = getFilteredTrips();
    const nextTrips = filtered.slice(0, nextPage * PAGE_SIZE);
    setVisibleTrips(nextTrips);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // The loading, error, and empty states remain the same...

  if (authLoading) {
    return (
      <Container size="xl" py="lg">
        <Center style={{ minHeight: 200 }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Authenticating...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container size="xl" py="lg">
        <Center style={{ minHeight: 200 }}>
          <Text>Please log in to view your trips</Text>
        </Center>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="xl" py="lg" className="relative">
        <LoadingOverlay
          visible={true}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ size: "lg" }}
        />
        <Grid gutter="md" rowgap="xl" columngap="xl">
          {[...Array(6)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <Skeleton height={160} radius="md" mb="md" />
              <Skeleton height={20} width="70%" mb="xs" />
              <Skeleton height={16} width="50%" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="lg">
        <Center style={{ minHeight: 200 }}>
          <Stack align="center" gap="md">
            <Text color="red" ta="center" size="lg">
              Error loading trips: {error}
            </Text>
            <Text ta="center" color="dimmed">
              Please ensure your backend server is running and accessible at{" "}
              <code>{API_BASE_URL}trips</code>
            </Text>
            <Button
              onClick={() => {
                setAllTrips([]);
                fetchTrips();
              }}
              variant="outline"
            >
              Try Again
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (allTrips.length === 0) {
    return (
      <Container size="xl" py="lg">
        <Center style={{ minHeight: 200 }}>
          <Stack align="center" gap="md">
            {!discoverMode && (
              <Text ta="center" size="lg" color="dimmed">
                No trips found
              </Text>
            )}
            <Text ta="center" color="dimmed">
              {discoverMode
                ? "No trips in your area"
                : savedOnly
                ? "Start by liking some trips"
                : "Start by creating some trips!"}
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  const filteredTrips = getFilteredTrips();
  const hasMoreTrips = visibleTrips.length < filteredTrips.length;

  return (
    <Container size="xl" py="lg">
      <Grid gutter="md" rowgap="xl" columngap="xl">
        {visibleTrips.map((trip) => (
          <Grid.Col key={trip.id} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <TripCard
              trip={trip}
              onCardClick={() => handleCardClick(trip)}
              onDelete={() => handleDeleteTrip(trip.id)}
              canDelete={!discoverMode && trip.hostId === userId}
              onSaveToggle={() => handleSaveToggle(trip.id)}
              userId={userId}
            />
          </Grid.Col>
        ))}
      </Grid>

      {hasMoreTrips && (
        <Group justify="center" mt="xl">
          <Button
            onClick={loadMore}
            loading={loadingMore}
            variant="outline"
            size="md"
          >
            {loadingMore
              ? "Loading..."
              : `Load More (${
                  filteredTrips.length - visibleTrips.length
                } remaining)`}
          </Button>
        </Group>
      )}

      {visibleTrips.length === 0 && allTrips.length > 0 && (
        <Center style={{ minHeight: 100 }}>
          <Text ta="center" color="dimmed">
            No trips found in "{active}" category
          </Text>
        </Center>
      )}

      {/* ---MODERNIZED MODAL STARTS HERE--- */}
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="lg"
        radius="md"
        padding={0}
        withCloseButton={true} // Display the default close button
        closeButtonProps={{ color: "red", "aria-label": "Close modal" }} // Style the close button
        overlayProps={{ blur: 3 }}
      >
        {selectedTrip &&
          (() => {
            const hasSpecialAccess =
              selectedTrip.hostId === userId ||
              selectedTrip.invitedUsers?.some((user) => user.id === userId);

            const shouldHideDetails = discoverMode && !hasSpecialAccess;

            return (
              <Stack gap={0}>
                <img
                  src={
                    selectedTrip.locations?.[0]?.image ||
                    `https://placehold.co/800x400/E0E0E0/333333?text=No+Image`
                  }
                  alt={selectedTrip.title || "Trip Image"}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderTopLeftRadius: "var(--mantine-radius-md)",
                    borderTopRightRadius: "var(--mantine-radius-md)",
                  }}
                />

                <Stack p="lg" gap="md" ref={tripDetailsRef}>
                  <Text fz="xl" fw={700}>
                    {selectedTrip.title}
                  </Text>

                  <Text c="dimmed" fz="sm" lh={1.6}>
                    {selectedTrip.description || "No description provided."}
                  </Text>

                  <Grid gutter="md" mt="sm">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text fz="sm">
                        <strong>City:</strong> {selectedTrip.city || "N/A"}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text fz="sm">
                        <strong>Host:</strong>{" "}
                        {selectedTrip.host?.name || "Unknown"}
                      </Text>
                    </Grid.Col>
                  </Grid>

                  {!shouldHideDetails && selectedTrip.startTime && (
                    <Text fz="sm" c="dimmed">
                      <strong>Time:</strong>{" "}
                      {new Date(selectedTrip.startTime).toLocaleString()} -{" "}
                      {new Date(selectedTrip.endTime).toLocaleString()}
                    </Text>
                  )}

                  {selectedTrip.locations &&
                    selectedTrip.locations.length > 0 && (
                      <div>
                        <Text fw={600} fz="sm" mb={4}>
                          Locations:
                        </Text>
                        <ul style={{ paddingLeft: 18, margin: 0 }}>
                          {selectedTrip.locations.map((loc) => (
                            <li
                              key={loc.id}
                              style={{ fontSize: 14, marginBottom: 4 }}
                            >
                              <Text component="span" fz="sm" fw={500}>
                                {loc.name}
                              </Text>
                              {loc.address && (
                                <Text
                                  component="span"
                                  c="dimmed"
                                  fz="xs"
                                  ml={6}
                                >
                                  ({loc.address})
                                </Text>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </Stack>

                <Divider />

                {/* All buttons are now aligned to the right */}
                <Group justify="flex-end" p="md">
                  {!shouldHideDetails && (
                    <>
                      <CopyTripLink goto={true} tripId={selectedTrip.id} />
                      <Button onClick={handleCopy} variant="light">
                        {copied ? "Copied!" : "Copy Details"}
                      </Button>
                    </>
                  )}
                </Group>
              </Stack>
            );
          })()}
      </Modal>
      {/* ---MODERNIZED MODAL ENDS HERE--- */}
    </Container>
  );
};

export default TripGrid;
