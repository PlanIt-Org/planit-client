import React, { useState } from "react";
import { Button, Stack, Paper, Group, Skeleton } from "@mantine/core";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function RSVPForm({ tripId, ownTrip, RSVPStatus, setRSVPStatus, tripStatus }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Don't render anything if the user is the host
  if (ownTrip || tripStatus === "COMPLETED") {
    return null;
  }

  const handleRSVP = async (status) => {
    if (!tripId) {
      console.error("Trip ID is missing.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(`/trip/${tripId}/rsvp`, { status });
      // Update the parent's state to reflect the change
      setRSVPStatus(status);

      if (status === "no") {
        navigate("/home");
      } else {
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
    } finally {
      setSubmitting(false);
    }
  };

  const renderButtons = () => {
    // If the status is still being fetched, show a loading skeleton.
    // We check for undefined because null means "user has not responded".
    if (RSVPStatus === undefined) {
      return <Skeleton height={36} radius="md" />;
    }

    // If status is 'yes', show ONLY the Leave Trip button
    if (RSVPStatus === "yes") {
      return (
        <Button
          color="red"
          onClick={() => handleRSVP("no")}
          loading={submitting}
          fullWidth
        >
          Leave Trip
        </Button>
      );
    }

    // For any other status ('maybe' or null), show the three RSVP options
    return (
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
    );
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
      <Stack>{renderButtons()}</Stack>
    </Paper>
  );
}

export default RSVPForm;
