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
} from "@mantine/core";
import TripCard from "./TripCard";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect, useRef } from "react";
import CopyTripLink from "./CopyTripLink";
import { useNavigate } from "react-router-dom";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import apiClient from "../api/axios";
import { useAuth } from "../hooks/useAuth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 6;

const TripGrid = ({ userId, tripId, active }) => {
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

  console.log("🔍 TripGrid Debug:", {
    authLoading,
    session: !!session,
    userId,
    allTripsLength: allTrips.length,
    loading,
    error,
  });

  const fetchTrips = async () => {
    console.log("🚀 Starting fetchTrips...");
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/trips/user/${userId}`);
      const data = response.data;
      console.log("✅ Trips fetched successfully:", data.trips?.length || 0);

      setAllTrips(data.trips || []);
      setVisibleTrips(data.trips.slice(0, PAGE_SIZE));
      setPage(1);
    } catch (err) {
      console.error("❌ Failed to fetch trips:", err);
      setError(err.message);
    } finally {
      console.log("🏁 Setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📡 useEffect triggered:", {
      authLoading,
      session: !!session,
      userId,
      allTripsLength: allTrips.length,
      loading,
      willFetch: !authLoading && !!session && !!userId && allTrips.length === 0,
    });

    if (authLoading || !session || !userId) {
      console.log("⏸️ Skipping fetch - auth not ready");
      return;
    }

    if (allTrips.length > 0) {
      console.log("⏸️ Skipping fetch - already have trips");
      return;
    }

    console.log("🎯 Conditions met - fetching trips");
    fetchTrips();
  }, [authLoading, session, userId, allTrips.length]);

  useEffect(() => {
    console.log("👤 UserId changed, clearing trips:", {
      userId,
      prevLength: allTrips.length,
    });
    if (userId) {
      setAllTrips([]);
      setLoading(true);
    }
  }, [userId]);

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
    if (!allTrips.length) return;

    const filtered = getFilteredTrips();
    setVisibleTrips(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  }, [active, allTrips]);

  const getFilteredTrips = (trips = allTrips) => {
    const now = new Date();
    switch (active) {
      case "Drafts":
        return trips.filter((trip) => trip.status === "PLANNING");
      case "Upcoming":
        return trips.filter(
          (trip) => trip.status === "ACTIVE" && new Date(trip.endTime) >= now
        );
      case "Past Events":
        return trips.filter(
          (trip) => trip.status === "COMPLETED" || new Date(trip.endTime) < now
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
  };

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

  if (authLoading) {
    console.log("🔄 Showing auth loading state");
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
    console.log("🚫 No session found");
    return (
      <Container size="xl" py="lg">
        <Center style={{ minHeight: 200 }}>
          <Text>Please log in to view your trips</Text>
        </Center>
      </Container>
    );
  }

  if (loading) {
    console.log(
      "⏳ Showing loading state - loading:",
      loading,
      "allTrips.length:",
      allTrips.length
    );
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
            <Text ta="center" size="lg" color="dimmed">
              No trips found
            </Text>
            <Text ta="center" color="dimmed">
              Start by creating some trips!
            </Text>
            <Button
              onClick={() => navigate("/tripplanner/new")}
              variant="filled"
            >
              Create Your First Trip
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  const filteredTrips = getFilteredTrips();
  const hasMoreTrips = visibleTrips.length < filteredTrips.length;

  console.log(
    "🎨 Rendering trip grid with",
    visibleTrips.length,
    "visible trips"
  );

  return (
    <Container size="xl" py="lg">
      <Grid gutter="md" rowgap="xl" columngap="xl">
        {visibleTrips.map((trip) => (
          <Grid.Col key={trip.id} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <TripCard
              trip={trip}
              onCardClick={() => handleCardClick(trip)}
              onDelete={() => handleDeleteTrip(trip.id)}
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

      <Modal opened={opened} onClose={close} centered size="lg">
        {selectedTrip && (
          <div className="space-y-4">
            <img
              src={
                selectedTrip.locations?.[0]?.image ||
                `https://placehold.co/800x400/E0E0E0/333333?text=No+Image`
              }
              alt={selectedTrip.title || "Trip Image"}
              style={{
                width: "100%",
                height: "40%",
                objectFit: "fill",
                display: "block",
              }}
            />

            <Text className="text-xl font-bold text-gray-800">
              {selectedTrip.title}
            </Text>
            <Text className="text-gray-700">
              <strong>Host:</strong> {selectedTrip.host?.name || "Unknown"}
            </Text>
            <Text className="text-gray-700">
              <strong>City:</strong> {selectedTrip.city || "N/A"}
            </Text>
            <Text className="text-gray-700">
              <strong>Time:</strong>{" "}
              {selectedTrip.startTime
                ? new Date(selectedTrip.startTime).toLocaleString()
                : "N/A"}{" "}
              -{" "}
              {selectedTrip.endTime
                ? new Date(selectedTrip.endTime).toLocaleString()
                : "N/A"}
            </Text>
            <Text className="text-gray-700">
              <strong>Description:</strong>{" "}
              {selectedTrip.description || "No description provided."}
            </Text>
            {selectedTrip.locations && selectedTrip.locations.length > 0 && (
              <div className="mt-4">
                <Text className="font-semibold text-gray-800">Locations:</Text>
                <ul className="list-disc list-inside">
                  {selectedTrip.locations.map((loc) => (
                    <li key={loc.id} className="text-gray-600">
                      {loc.name} ({loc.address})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <CopyTripLink goto={true} tripId={selectedTrip.id} />
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default TripGrid;
