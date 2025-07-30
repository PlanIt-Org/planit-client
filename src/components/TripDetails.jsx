import React from "react";
import {
  Card,
  Stack,
  Group,
  Button,
  Box,
  Title,
  Text,
  Modal,
  ActionIcon,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CopyTripLink from "./CopyTripLink";
import { IconCalendarWeek, IconPencil, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import apiClient from "../api/axios";

const TripDetails = ({ tripId, ownTrip, tripStatus, isPrivate, setIsPrivate }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [hostName, setHostName] = useState("Loading...");
  const { deleteTrip } = useDeleteTrip();

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (tripId) {
        try {
          const response = await apiClient.get(`/trips/${tripId}`);

          const { title, description, host, private: tripIsPrivate } = response.data.trip;
          setHostName(host?.name || "Loading...");
          setInputTitle(title || "");
          setInputDesc(description || "");
          setIsPrivate(tripIsPrivate);
        } catch (err) {
          console.error("Failed to fetch trip details:", err);
          notifications.show({
            title: "Error",
            message: "Could not load trip details.",
            color: "red",
          });
        }
      }
    };

    // Call the async function
    fetchTripDetails();
  }, [tripId]);



  const handleTogglePrivacy = async () => {
    const newPrivacyState = !isPrivate;
    try {
      await apiClient.put(`/trips/${tripId}/privacy`, { private: newPrivacyState });
      setIsPrivate(newPrivacyState); 
      notifications.show({
        title: "Success!",
        message: `Trip is now ${newPrivacyState ? 'private' : 'public'}.`,
        color: "green",
      });
    } catch (error) {
      console.error("Failed to update privacy:", error);
      notifications.show({
        title: "Error",
        message: "Could not update trip privacy.",
        color: "red",
      });
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    await deleteTrip({
      id: tripId,
      onSuccess: () => {
        notifications.show({
          title: "Trip deleted",
          message: `"${inputTitle || "Your trip"}" was deleted successfully.`,
          color: "green",
        });
        close();
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to delete the trip.",
          color: "red",
        });
      },
    });
  };

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

  const handleSaveTitle = async () => {
    try {
      await apiClient.put(`/trips/${tripId}`, { title: inputTitle });
      setIsEditingTitle(false);
      notifications.show({
        title: "Success",
        message: "Trip title updated!",
        color: "green",
      });
    } catch (error) {
      console.error("Failed to update title:", error);
      notifications.show({
        title: "Error",
        message: "Could not save title.",
        color: "red",
      });
    }
  };

  const handleSaveDesc = async () => {
    try {
      await apiClient.put(`/trips/${tripId}`, { description: inputDesc });
      setIsEditingDesc(false);
      notifications.show({
        title: "Success",
        message: "Trip description updated!",
        color: "green",
      });
    } catch (error) {
      console.error("Failed to update description:", error);
      notifications.show({
        title: "Error",
        message: "Could not save description.",
        color: "red",
      });
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Group justify="space-between">
          {ownTrip && <Button variant="light">Add Hosts</Button>}
          {ownTrip && (
              <Button
                color={isPrivate ? "red" : "green"}
                onClick={handleTogglePrivacy}
              >
                {isPrivate ? 'Make Public' : 'Make Private'}
              </Button>
            )}
          {ownTrip && (
            <Button
              variant="filled"
              color="red"
              onClick={open} // Opens the confirmation modal
              disabled={tripStatus === "COMPLETED"}
            >
              Delete Trip
            </Button>
          )}
        </Group>
        <Stack className="text-center py-4" style={{ textAlign: "center" }}>
          {/* ---------------THIS IS FOR THE Title-----------  */}
          <Group>
            {ownTrip && isEditingTitle ? (
              <TextInput
                value={inputTitle}
                onChange={(event) => setInputTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSaveTitle();
                  }
                }}
                style={{ flexGrow: 1 }}
              />
            ) : (
              <Text style={{ flexGrow: 1 }} size="lg">
                {inputTitle || "No title provided."}
              </Text>
            )}

            {ownTrip && (
              <ActionIcon
                onClick={() => {
                  if (isEditingTitle) {
                    handleSaveTitle();
                  } else {
                    setIsEditingTitle(true);
                  }
                }}
                variant="subtle"
                color="gray"
              >
                {isEditingTitle ? (
                  <IconCheck style={{ width: rem(18) }} />
                ) : (
                  <IconPencil style={{ width: rem(18) }} />
                )}
              </ActionIcon>
            )}
          </Group>

          {/* ---------------THIS IS FOR THE DESC-----------  */}
          <Group wrap="nowrap" align="flex-start">
            {ownTrip && isEditingDesc ? (
              <Textarea
                value={inputDesc}
                onChange={(event) => setInputDesc(event.currentTarget.value)}
                placeholder="Enter a trip description..."
                style={{ flexGrow: 1 }}
                autosize
                minRows={3}
              />
            ) : (
              <Text
                c="dimmed"
                style={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
                size="sm"
              >
                {inputDesc || "No description provided."}
              </Text>
            )}

            {ownTrip && (
              <ActionIcon
                onClick={() => {
                  if (isEditingDesc) {
                    handleSaveDesc();
                  } else {
                    setIsEditingDesc(true);
                  }
                }}
                variant="subtle"
                color="gray"
              >
                {isEditingDesc ? (
                  <IconCheck style={{ width: rem(18) }} />
                ) : (
                  <IconPencil style={{ width: rem(18) }} />
                )}
              </ActionIcon>
            )}
          </Group>

          <Box
            p="sm"
            style={{
              background: "#f3f4f6",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <Text size="sm" color="gray" weight={500}>
              HOSTED BY: {hostName}
            </Text>
          </Box>
        </Stack>
        <CopyTripLink tripId={tripId} tripStatus={tripStatus} />
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Delete Trip"
        centered
      >
        <Text>
          Are you sure you want to delete this trip? This action cannot be undone.
        </Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>
            No
          </Button>
          <Button
            color="red"
            onClick={handleDeleteTrip} // Always calls the delete handler
          >
            Yes, Delete Trip
          </Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default TripDetails;
