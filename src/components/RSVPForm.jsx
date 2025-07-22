// src/components/RSVPForm.jsx
import React, { useState } from "react";
import { Button, Stack, Paper, Group } from "@mantine/core";
import apiClient from "../api/axios";

function RSVPForm({ tripId }) {
  const [submitting, setSubmitting] = useState(false);

  const handleRSVP = async (status) => {
    if (!tripId) {
      console.error("Trip ID is missing.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post(`/api/rsvps/trip/${tripId}/rsvp`, { status });
    } catch (error) {
      console.error("Failed to RSVP:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper withBorder shadow="sm" p="md" radius="md" maw={400} mx="auto">
      <Stack>
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
            color="red"
            onClick={() => handleRSVP("no")}
            loading={submitting}
            type="button"
          >
            No
          </Button>
          <Button
            color="yellow"
            onClick={() => handleRSVP("maybe")}
            loading={submitting}
            type="button"
          >
            Maybe
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export default RSVPForm;
