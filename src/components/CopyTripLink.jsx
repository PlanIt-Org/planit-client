import React from "react";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const CopyTripLink = ({ tripId, goto, tripStatus }) => {
  const inviteLink = `${window.location.origin}/tripsummary/${tripId}`;

  const handleTripCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      notifications.show({
        title: "Link Copied!",
        message: "Your invite link has been copied to the clipboard.",
        color: "green",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error copying invite link:", err);
      notifications.show({
        title: "Error",
        message: "Could not copy invite link. Please try again.",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleOpenNewTab = () => {
    window.open(inviteLink, "_blank");
  };

  return (
    <Group grow>
      {tripStatus !== "PLANNING" && (
        <Button variant="light" onClick={handleTripCopyLink}>
          Copy Trip Link
        </Button>
      )}
      {goto && (
        <Button variant="outline" onClick={handleOpenNewTab}>
          Go to This Trip
        </Button>
      )}
    </Group>
  );
};

export default CopyTripLink;
