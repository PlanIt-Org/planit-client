import React from 'react'
import { Button } from "@mantine/core";
import { useState } from 'react'
import { notifications } from "@mantine/notifications";

const CopyTripLink = ({tripId, text}) => {
    const handleTripCopyLink = async () => {
        try {
          const inviteLink = `${window.location.origin}/tripsummary/${tripId}`;
      
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


  return (
    <Button variant="light" fullWidth mt="md" onClick={handleTripCopyLink}>
    {text || "Copy Link"}
  </Button>
  )
}

export default CopyTripLink