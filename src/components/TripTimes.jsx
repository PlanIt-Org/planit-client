import React, { useState, useEffect } from "react";
import { Text, Group, Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import apiClient from "../api/axios";

/**
 * Formats an ISO date string into a more readable format.
 * @param {string} isoString - The date string to format.
 * @returns {string} The formatted date and time.
 */
const formatDateTime = (isoString) => {
  if (!isoString) return "Not set";
  // Example: "Jul 25, 2025, 11:40 AM"
  return new Date(isoString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const TripTimes = ({ currTripId }) => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currTripId) {
      setLoading(false);
      return;
    }

    let intervalId;

    const fetchTripTimes = async () => {
      try {
        const response = await apiClient.get(`/trips/${currTripId}/estimated-time`);
        const result = response.data;
        setTripData(result.data);

        const locationsCount = result.data?.locations?.length || 0;

        // Stop polling if only 1 or 0 locations
        if (locationsCount <= 1) {
          clearInterval(intervalId);
        } else if (result.data.estimatedTime) {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch trip data.");
        clearInterval(intervalId); // Optional: stop polling on error
      } finally {
        setLoading(false);
      }
    };

    fetchTripTimes();
    intervalId = setInterval(fetchTripTimes, 1000); // Poll every 1s

    return () => clearInterval(intervalId);
  }, [currTripId]);

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

  if (!tripData) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Trip Info Not Available"
        color="yellow"
        variant="light"
      >
        No trip time data found. Please check back later.
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
      <Text size="sm" c="dimmed">
        Estimated Travel Time:
        <strong>
          {tripData?.estimatedTime ? tripData.estimatedTime : "Not set"}
        </strong>
      </Text>
    </Group>
  );
};

export default TripTimes;
