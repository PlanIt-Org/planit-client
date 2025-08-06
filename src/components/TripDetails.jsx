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
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CopyTripLink from "./CopyTripLink";
import { IconCalendarWeek, IconPencil, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import apiClient from "../api/axios";

const TripDetails = ({
  tripId,
  ownTrip,
  tripStatus,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [hostName, setHostName] = useState("Loading...");
  const [isPrivate, setIsPrivate] = useState(null);
  const { deleteTrip } = useDeleteTrip();
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchTripAndHostDetails = async () => {
      if (!tripId) return;

      try {
        const tripResponse = await apiClient.get(`/trips/${tripId}`);
        const tripData = tripResponse.data.trip;

        // Set trip details from the first response
        setInputTitle(tripData.title || "");
        setInputDesc(tripData.description || "");
        setIsPrivate(tripData.private);

        if (tripData.hostId) {
          try {
            const hostResponse = await apiClient.get(`/users/${tripData.hostId}`);
            setHostName(hostResponse.data.name || "Unknown Host");
          } catch (hostError) {
            console.error("Failed to fetch host details:", hostError);
            setHostName("Unknown Host");
          }
        } else {
          setHostName("No host assigned");
        }

      } catch (tripError) {
        console.error("Failed to fetch trip details:", tripError);
        notifications.show({
          title: "Error",
          message: "Could not load trip details.",
          color: "red",
        });
      }
    };

    fetchTripAndHostDetails();
}, [tripId]); 
  const handleTogglePrivacy = async () => {
    const newPrivacyState = !isPrivate;
    try {
      await apiClient.put(`/trips/${tripId}/privacy`, {
        private: newPrivacyState,
      });
      setIsPrivate(newPrivacyState);
      notifications.show({
        title: "Success!",
        message: `Trip is now ${newPrivacyState ? "private" : "public"}.`,
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
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        background: theme.colors["custom-palette"][8],
        color: theme.colors["custom-palette"][1],
      }}
    >
      <Stack spacing="md">
        <Group justify="space-between">
          {ownTrip && (
            <Button
              color={
                isPrivate
                  ? theme.colors["custom-palette"][2]
                  : theme.colors["custom-palette"][6]
              }
              style={{
                backgroundColor: isPrivate
                  ? theme.colors["custom-palette"][2]
                  : theme.colors["custom-palette"][6],
                color: theme.colors["custom-palette"][isPrivate ? 8 : 0],
              }}
              onClick={handleTogglePrivacy}
            >
              {isPrivate ? "Make Public" : "Make Private"}
            </Button>
          )}
          {ownTrip && (
            <Button
              variant="filled"
              color="red"
              onClick={open}
              disabled={tripStatus === "COMPLETED"}
            >
              Delete Trip
            </Button>
          )}
        </Group>
        <Stack className="text-center py-4" style={{ textAlign: "center" }}>
          {/* ---------------THIS IS FOR THE Title-----------  */}
          <Group align="center" wrap="nowrap" style={{ width: "100%" }}>
            {ownTrip && isEditingTitle ? (
              <>
                <TextInput
                  value={inputTitle}
                  onChange={(event) => setInputTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSaveTitle();
                    }
                  }}
                  style={{ flexGrow: 1, textAlign: "center" }}
                />
                <ActionIcon
                  onClick={handleSaveTitle}
                  variant="subtle"
                  color="gray"
                  ml={4}
                >
                  <IconCheck style={{ width: rem(18) }} />
                </ActionIcon>
              </>
            ) : (
              <>
                <Text
                  size="lg"
                  fw={900}
                  c={theme.colors["custom-palette"][0]}
                  style={{
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    background: `linear-gradient(90deg, ${theme.colors["custom-palette"][2]}, ${theme.colors["custom-palette"][4]})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  {inputTitle || "No title provided."}
                </Text>
                {ownTrip && (
                  <ActionIcon
                    onClick={() => setIsEditingTitle(true)}
                    variant="subtle"
                    color="gray"
                    ml={4}
                  >
                    <IconPencil style={{ width: rem(18) }} />
                  </ActionIcon>
                )}
              </>
            )}
          </Group>

          {/* ---------------THIS IS FOR THE DESC-----------  */}
          <Group wrap="nowrap" align="flex-start">
            {ownTrip && isEditingDesc ? (
              <Textarea
                value={inputDesc}
                onChange={(event) => setInputDesc(event.currentTarget.value)}
                placeholder="Enter a trip description..."
                style={{ flexGrow: 1, textAlign: "center" }} // MODIFIED
                autosize
                minRows={3}
              />
            ) : (
              <Text
                c={theme.colors["custom-palette"][3]}
                style={{
                  flexGrow: 1,
                  whiteSpace: "pre-wrap",
                  textAlign: "center",
                }} // MODIFIED
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
            p="md"
            style={{
              background: theme.colors["custom-palette"][7],
              borderRadius: 8,
              border: `1px solid ${theme.colors["custom-palette"][6]}`,
            }}
          >
            <Group justify="center">
              <Text
                size="lg"
                fw={700}
                c={theme.colors["custom-palette"][1]}
                ta="center"
                style={{
                  letterSpacing: 0.5,
                  textShadow: `0 1px 8px ${theme.colors["custom-palette"][8]}33`,
                }}
              >
                Hosted By:{" "}
                <span style={{ color: theme.colors["custom-palette"][0] }}>
                  {hostName}
                </span>
              </Text>
            </Group>
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
          Are you sure you want to delete this trip? This action cannot be
          undone.
        </Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>
            No
          </Button>
          <Button color="red" onClick={handleDeleteTrip}>
            Yes, Delete Trip
          </Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default TripDetails;
