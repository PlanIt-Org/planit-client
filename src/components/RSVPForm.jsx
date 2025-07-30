import React, { useState } from "react";
import { Button, Stack, Paper, Group } from "@mantine/core";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

// The component now requires a `userId` prop to add the user to the invited list
function RSVPForm({ tripId, ownTrip, RSVPStatus, setRSVPStatus, userId }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (ownTrip) {
    return null;
  }

  const handleRSVP = async (status) => {
    // Check for missing IDs
    if (!tripId || (status === 'yes' && !userId)) {
      console.error("Trip ID or User ID is missing for this action.");
      return;
    }

    setSubmitting(true);
    try {
      // First, submit the RSVP status update
      await apiClient.post(`/trip/${tripId}/rsvp`, { status });
      setRSVPStatus(status);

      if (status === "yes") {
        // If the RSVP is "yes", also call the endpoint to add the user to the invited list
        await apiClient.post(`/trips/${tripId}/add-invited`, { userId });
        
        notifications.show({
          title: "You're In!",
          message: "Your RSVP is confirmed and you've been added to the trip.",
          color: "green",
        });
      } else if (status === "no") {
        // If the status is "no" (from clicking "No" or "Leave Trip"), navigate away
        navigate("/");
      } else {
        // Handle the "maybe" case
        notifications.show({
          title: "RSVP Received!",
          message: `Your response of '${status}' has been recorded.`,
          color: "green",
        });
      }
    } catch (error) {
      console.error("Failed to process RSVP:", error);
      notifications.show({
        title: "Error",
        message: "There was a problem submitting your RSVP.",
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        background: "#f3f4f6",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        textAlign: "center",
      }}
    >
      <Stack>
        {RSVPStatus === "yes" ? (
          // If status is 'yes', show only the Leave Trip button
          <Button
            color="red"
            onClick={() => handleRSVP("no")}
            loading={submitting}
            fullWidth
          >
            Leave Trip
          </Button>
        ) : (
          // For any other status ('maybe' or null), show the three RSVP options
          <Group grow>
            <Button
              color="green"
              onClick={() => handleRSVP("yes")}
              loading={submitting}
              type="button"
            >
              Yes
            </Button>
            <Button
              color="yellow"
              onClick={() => handleRSVP("maybe")}
              loading={submitting}
              type="button"
            >
              Maybe
            </Button>
            <Button
              color="red"
              onClick={() => handleRSVP("no")}
              loading={submitting}
              type="button"
            >
              No
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}

export default RSVPForm;
