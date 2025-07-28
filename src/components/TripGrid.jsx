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
} from "@mantine/core";
import TripCard from "./TripCard";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import CopyTripLink from "./CopyTripLink";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 6;

const TripGrid = ({ userId, tripId, active }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [allTrips, setAllTrips] = useState([]);
  const [visibleTrips, setVisibleTrips] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}trips/user/${userId}`);

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setAllTrips(data.trips || []);
        setVisibleTrips(data.trips.slice(0, PAGE_SIZE)); // Show first page
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteTrip = (tripId) => {
    setAllTrips((prev) => prev.filter((t) => t.id !== tripId));
    setVisibleTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  // reset stuff when changing categories
  useEffect(() => {
    if (!allTrips.length) return;

    const now = new Date();

    let filtered = [];

    switch (active) {
      case "Drafts":
        filtered = allTrips.filter((trip) => trip.status === "PLANNING");
        break;
      case "Upcoming":
        filtered = allTrips.filter(
          (trip) => trip.status === "ACTIVE" && new Date(trip.endTime) >= now
        );
        break;
      case "Past Events":
        filtered = allTrips.filter(
          (trip) => trip.status === "COMPLETED" || new Date(trip.endTime) < now
        );
        break;
      case "Invited Trips":
        filtered = allTrips.filter((trip) =>
          trip.invitedUsers?.some((user) => user.id === userId)
        );
        break;
      case "Hosting":
        filtered = allTrips.filter((trip) => trip.hostId === userId);
        break;
      default:
        filtered = allTrips;
    }

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

  const loadMore = () => {
    const nextPage = page + 1;
    const filtered = getFilteredTrips();
    const nextTrips = filtered.slice(0, nextPage * PAGE_SIZE);
    setVisibleTrips(nextTrips);
    setPage(nextPage);
  };

  if (loading) {
    return (
      <Container size="xl" py="lg" className="relative">
        <LoadingOverlay
          visible={true}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {/* skeleton loaders */}
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
        <Text color="red" ta="center">
          Error loading trips: {error}
        </Text>
        <Text ta="center">
          Please ensure your backend server is running and accessible at `
          {API_BASE_URL}trips`.
        </Text>
      </Container>
    );
  }

  if (allTrips.length === 0) {
    return (
      <Container size="xl" py="lg">
        <Text ta="center">
          No trips found. Start by creating some trips in your database!
        </Text>
      </Container>
    );
  }

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

      {visibleTrips.length < getFilteredTrips().length && (
        <Group justify="center" mt="lg">
          <Button onClick={loadMore}>Load More</Button>
        </Group>
      )}

      <Modal opened={opened} onClose={close} centered size="lg">
        {/* Changed size to "lg" for larger horizontal */}
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
                height: "40%", // or whatever height you want
                objectFit: "fill", // 🔥 this will stretch the image to fill both width and height
                display: "block", // removes any inline spacing
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
            <CopyTripLink text={"View this Trip"} tripId={selectedTrip.id} />
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default TripGrid;
