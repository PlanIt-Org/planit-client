// src/hooks/useTripRSVPs.js
import { useState, useEffect } from "react";
import apiClient from "../api/axios";

const useTripRSVPs = (tripId, options = {}) => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { enabled = true, onSuccess, onError } = options;

  const fetchRSVPs = async () => {
    console.debug("[useTripRSVPs] fetchRSVPs called with tripId:", tripId);
    if (!tripId) {
      setError("Trip ID is required");
      console.warn("[useTripRSVPs] No tripId provided.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`[useTripRSVPs] Fetching RSVPs for trip: ${tripId}`);
      const response = await apiClient.get(`/trip/${tripId}/attendees`);
      console.log("[useTripRSVPs] RSVPs fetched successfully:", response.data);
      setRsvps(response.data);

      if (onSuccess) {
        console.debug("[useTripRSVPs] onSuccess callback fired.");
        onSuccess(response.data);
      }
    } catch (err) {
      console.error("[useTripRSVPs] Error fetching trip RSVPs:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch trip RSVPs";
      setError(errorMessage);

      if (onError) {
        console.debug("[useTripRSVPs] onError callback fired.");
        onError(err);
      }
    } finally {
      setLoading(false);
      console.debug(
        "[useTripRSVPs] fetchRSVPs finished. Loading set to false."
      );
    }
  };

  useEffect(() => {
    console.debug(
      "[useTripRSVPs] useEffect triggered. enabled:",
      enabled,
      "tripId:",
      tripId
    );
    if (enabled && tripId) {
      fetchRSVPs();
    }
  }, [tripId, enabled]);

  const refetch = () => {
    console.debug("[useTripRSVPs] refetch called.");
    fetchRSVPs();
  };

  const getAttendees = () => {
    const attendees = rsvps.filter((rsvp) => rsvp.status === "YES");
    console.debug("[useTripRSVPs] getAttendees:", attendees);
    return attendees;
  };
  const getDeclined = () => {
    const declined = rsvps.filter((rsvp) => rsvp.status === "NO");
    console.debug("[useTripRSVPs] getDeclined:", declined);
    return declined;
  };
  const getPending = () => {
    const pending = rsvps.filter((rsvp) => rsvp.status === "MAYBE");
    console.debug("[useTripRSVPs] getPending:", pending);
    return pending;
  };

  const getCounts = () => {
    const counts = {
      total: rsvps.length,
      going: getAttendees().length,
      declined: getDeclined().length,
      pending: getPending().length,
    };
    console.debug("[useTripRSVPs] getCounts:", counts);
    return counts;
  };

  console.debug("[useTripRSVPs] Returning values:", {
    rsvps,
    attendees: getAttendees(),
    declined: getDeclined(),
    pending: getPending(),
    counts: getCounts(),
    loading,
    error,
  });

  return {
    rsvps,
    attendees: getAttendees(),
    declined: getDeclined(),
    pending: getPending(),
    counts: getCounts(),
    loading,
    error,
    refetch,
    fetchRSVPs,
  };
};

export default useTripRSVPs;
