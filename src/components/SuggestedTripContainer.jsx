// src/components/SuggestedTripContainer.jsx
import React, { useState, useEffect } from "react";
import SuggestedTrip from "./SuggestedTrip";
import { Stack, Loader, Alert, Title, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";

const SuggestedTripContainer = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/trips/suggestions/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.locations && Array.isArray(data.locations)) {
          setLocations(data.locations);
        } else {
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch trip suggestions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Generating personalized trip ideas...</Text>
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
      {locations.length > 0 ? (
        locations.map((location, index) => (
          <SuggestedTrip key={index} location={location} />
        ))
      ) : (
        <Text>No suggestions could be generated at this time.</Text>
      )}
    </Stack>
  );
};

export default SuggestedTripContainer;
