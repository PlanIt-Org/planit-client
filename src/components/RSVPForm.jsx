import React, { useState } from "react";
import { Button, Stack, Paper, Group } from "@mantine/core";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function RSVPForm({ tripId, ownTrip, RSVPStatus, setRSVPStatus }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (ownTrip) {
    return null;
  }

  const handleRSVP = async (status) => {
    if (!tripId) {
      console.error("Trip ID is missing.");
      return;
    }

    setSubmitting(true);
    // Update the parent's state immediately for a responsive UI

    try {
      await apiClient.post(`/trip/${tripId}/rsvp`, { status });
      setRSVPStatus(status);
      
      if (status === "no") {
        // Navigate home only after the API call for 'no' is successful
        navigate("/");
      } else {
        // Show notification for "yes" or "maybe"
        notifications.show({
          title: "RSVP Received!",
          message: `Your response of '${status}' has been recorded.`,
          color: "green",
        });
      }
    } catch (error) {
      console.error("Failed to RSVP:", error);
      notifications.show({
        title: "Error",
        message: "There was a problem submitting your RSVP.",
        color: "red",
      });
      // Optional: Revert state on error if needed
      // setRSVPStatus(initialStatus); 
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
        {/* The UI is now directly controlled by the RSVPStatus prop */}
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
          // For any other status ('maybe' or null), show all three options
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
