// src/hooks/useTripRSVPs.js

import { useState, useEffect } from "react";
import apiClient from "../api/axios";

// The hook is now simplified to only fetch and manage attendees.
const useTripRSVPs = (tripId, options = {}) => {
  // Renaming state to 'attendees' for clarity, as that's what we are fetching.
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { enabled = true, onSuccess, onError } = options;

  const fetchAttendees = async () => {
    if (!tripId) {
      setError("Trip ID is required");
      console.debug("[useTripRSVPs] fetchAttendees aborted: tripId missing");
      return;
    }

    setLoading(true);
    setError(null);
    console.debug("[useTripRSVPs] fetchAttendees started");

    try {
      console.log(`[useTripRSVPs] Fetching attendees for trip: ${tripId}`);
      // This API call correctly points to the /attendees endpoint.
      const response = await apiClient.get(`/trip/${tripId}/attendees`);

      // The backend returns a flat array of user objects, which we set directly.
      setAttendees(response.data);
      console.debug("[useTripRSVPs] Attendees set:", response.data);

      if (onSuccess) {
        onSuccess(response.data);
        console.debug("[useTripRSVPs] onSuccess callback called");
      }
    } catch (err) {
      console.error("[useTripRSVPs] Error fetching trip attendees:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch trip attendees";
      setError(errorMessage);
      console.debug("[useTripRSVPs] Error set:", errorMessage);

      if (onError) {
        onError(err);
        console.debug("[useTripRSVPs] onError callback called");
      }
    } finally {
      setLoading(false);
      console.debug("[useTripRSVPs] fetchAttendees finished");
    }
  };

  useEffect(() => {
    console.debug("[useTripRSVPs] useEffect triggered", { enabled, tripId });
    if (enabled && tripId) {
      fetchAttendees();
    }
  }, [tripId, enabled]);

  // The counts are now simpler as we only have attendee data.
  const counts = {
    going: attendees.length,
  };

  return {
    attendees, // The list of user objects.
    counts,
    loading,
    error,
    refetch: fetchAttendees, // The refetch function now calls the renamed fetchAttendees.
  };
};

export default useTripRSVPs;
