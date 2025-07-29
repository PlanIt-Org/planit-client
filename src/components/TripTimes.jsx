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

// 1. Make sure to accept all necessary props
const TripTimes = ({ currTripId, tripStatus, locations }) => {
  const [tripData, setTripData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currTripId) {
      setLoading(false);
      return;
    }

    let intervalId = null;

    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/trips/${currTripId}/estimated-time`);
        const newData = response.data.data || {};
        setTripData(newData);
      } catch (err) {
        setError(err.message || "Failed to fetch trip data.");
        if (intervalId) clearInterval(intervalId); // Stop polling on error
      }
    };

    // --- Simplified and Corrected Logic ---

    // 1. Always fetch data once when the effect runs
    fetchData().finally(() => {
      setLoading(false);
    });

    // 2. Decide whether to poll based on the CURRENT props
    const shouldPoll = tripStatus === "ACTIVE" && locations && locations.length > 1;

    if (shouldPoll) {
      intervalId = setInterval(fetchData, 1000); // Poll every second
    }

    // 3. The cleanup function clears the interval from THIS specific effect run
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

    // 4. CRITICAL FIX: The dependency array MUST include all props/state
    // that the effect uses to make decisions.
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
      <Text size="sm" c="dimmed">
        Estimated Travel Time:{" "}
        <strong>{tripData?.estimatedTime || "Not set"}</strong>
      </Text>
    </Group>
  );
};

export default TripTimes;