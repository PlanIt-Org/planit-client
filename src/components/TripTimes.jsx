import React, { useState, useEffect } from "react";
import { Text, Group, Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import apiClient from "../api/axios";

const formatDateTime = (isoString) => {
  if (!isoString) return "Not set";
  return new Date(isoString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const TripTimes = ({ currTripId, tripStatus, locations, estimatedTime }) => {
  const [tripData, setTripData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currTripId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `/trips/${currTripId}/estimated-time`
        );
        const newData = response.data.data || {};
        setTripData(newData);
      } catch (err) {
        setError(err.message || "Failed to fetch trip data.");
      }
    };

    // --- Logic Change ---
    // Fetch data once and then stop. The loading state is handled by finally().
    fetchData().finally(() => {
      setLoading(false);
    });
  }, [currTripId, tripStatus, locations]);

  if (loading) {
    return (
      <Group justify="center">
        <Loader size="sm" />
      </Group>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Error"
        color="red"
        variant="light"
      >
        {error}
      </Alert>
    );
  }

  return (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        Start Time: <strong>{formatDateTime(tripData?.startTime)}</strong>
      </Text>
      <Text size="sm" c="dimmed">
        End Time: <strong>{formatDateTime(tripData?.endTime)}</strong>
      </Text>
      {/* <Text size="sm" c="dimmed">
        Estimated Travel Time:{" "}
        <strong>
          {estimatedTime && estimatedTime > 0
            ? estimatedTime >= 60
              ? `${Math.floor(estimatedTime / 60)} hr ${Math.round(
                  estimatedTime % 60
                )} min`
              : `${Math.round(estimatedTime)} min`
            : "Calculating..."}
        </strong>
      </Text> */}
    </Group>
  );
};

export default TripTimes;
