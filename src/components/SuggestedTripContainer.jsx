// src/components/SuggestedTripContainer.jsx
import React, { useState, useEffect } from "react";
import SuggestedTrip from "./SuggestedTrip";
import { Stack, Loader, Alert, Title, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/axios";

const SuggestedTripContainer = () => {
  const { session } = useAuth();
  const { id: tripId } = useParams(); // Rename to tripId for clarity
  const userId = session?.user?.id;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log(
        "fetchSuggestions called. userId:",
        userId,
        "tripId:",
        tripId
      );

      try {
        setLoading(true);
        setError(null);

        let tripPreferences = null;
        try {
          // Attempt to fetch group preferences. A 404 is okay here.
          const preferenceResponse = await apiClient.get(
            `/${tripId}/TripPreference`
          );
          tripPreferences = preferenceResponse.data;
          console.log("Fetched Group Preferences:", tripPreferences);
        } catch (prefError) {
          if (prefError.response && prefError.response.status === 404) {
            console.log(
              "No group preferences found for this trip. Proceeding without them."
            );
            // tripPreferences remains null, which is handled by the backend.
          } else {
            // For other errors (like 500 or network issues), we should stop.
            throw prefError;
          }
        }

        // Always proceed to get suggestions, passing the tripId in the body
        // so the backend can fetch the correct destination.
        console.log("Sending POST request to /trips/suggestions/" + userId);
        const response = await apiClient.post(
          `/trips/suggestions/${userId}`,
          { tripId, tripPreferences } // Pass tripId and preferences
        );

        console.log("Received response from /trips/suggestions:", response);
        const data = response.data;
        console.log("Response data:", data);

        if (data.locations && Array.isArray(data.locations)) {
          console.log("Setting locations state with:", data.locations);
          setLocations(data.locations);
        } else {
          console.error("Invalid data format received from server.", data);
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch trip suggestions:", err);

        // Handle specific error messages from the main suggestion request
        if (err.response?.status === 404) {
          setError(
            "User or Trip data not found. Please ensure the trip exists and your preferences are set."
          );
        } else if (err.response?.status === 502) {
          setError(
            "AI service temporarily unavailable. Please try again later."
          );
        } else {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch trip suggestions"
          );
        }
      } finally {
        setLoading(false);
        console.log("fetchSuggestions finished. Loading set to false.");
      }
    };

    // Only fetch if we have the required IDs.
    if (tripId && userId) {
      fetchSuggestions();
    } else {
      setLoading(false);
    }
  }, [userId, tripId]);

  if (!userId) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Authentication Required"
        color="blue"
        radius="md"
      >
        Please log in to see personalized trip suggestions.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Generating personalized trip ideas for your destination...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Something went wrong!"
        color="red"
        radius="md"
      >
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing="lg">
      {locations.length > 0
        ? locations.map((location, index) => (
            <SuggestedTrip key={index} location={location} />
          ))
        : // Avoid showing this message if there was an error.
          !error && (
            <Text>No suggestions could be generated at this time.</Text>
          )}
    </Stack>
  );
};

export default SuggestedTripContainer;
