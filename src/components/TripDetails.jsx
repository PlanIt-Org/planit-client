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
import { useState } from "react";

const TripDetails = ({ tripId }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");

  const handleLeaveTrip = () => {
    console.log("Leaving trip (yes option was clicked)");
    close();
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

  const handleSaveTitle = (newTitle) => {
    setInputTitle(newTitle);
    setIsEditingTitle(false);
  };

  const handleSaveDesc = (newDesc) => {
    setInputDesc(newDesc);
    setIsEditingDesc(false);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Group justify="space-between">
          <Button variant="light">Add Hosts</Button>
          <Button variant="filled" color="dark" onClick={open}>
            Leave Trip
          </Button>
        </Group>
        <Stack className="text-center py-4" style={{ textAlign: "center" }}>
          {/* ---------------THIS IS FOR THE Title-----------  */}
          <Group>
            {isEditingTitle ? (
              // --- EDIT MODE ---

              <TextInput
                value={inputTitle}
                onChange={(event) => setInputTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSaveTitle(inputTitle);
                  }
                }}
                style={{ flexGrow: 1 }}
              />
            ) : (
              // --- VIEW MODE ---

              <Text style={{ flexGrow: 1 }} size="lg">
                {inputTitle || "No title provided."}
              </Text>
            )}

            {/* This icon also switches based on the isEditing state */}
            <ActionIcon
              onClick={() => {
                if (isEditingTitle) {
                  handleSaveTitle(inputTitle);
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
          </Group>

          {/* ---------------THIS IS FOR THE DESC-----------  */}
          <Group wrap="nowrap" align="flex-start">
            {isEditingDesc ? (
              // --- EDIT MODE ---
              <Textarea
                value={inputDesc}
                onChange={(event) => setInputDesc(event.currentTarget.value)}
                placeholder="Enter a trip description..."
                style={{ flexGrow: 1 }}
                autosize
                minRows={3}
              />
            ) : (
              // --- VIEW MODE ---
              <Text
                c="dimmed"
                style={{ flexGrow: 1, whiteSpace: "pre-wrap" }}
                size="sm"
              >
                {inputDesc || "No description provided."}
              </Text>
            )}

            <ActionIcon
              onClick={() => {
                if (isEditingDesc) {
                  handleSaveDesc(inputDesc);
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
              HOSTED BY: THOMAS
            </Text>
          </Box>
        </Stack>
        <CopyTripLink tripId={tripId} />
      </Stack>
      {/* Leave Trip Confirmation Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Leave Trip"
        centered
      >
        <Text>Are you sure you want to leave this trip?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>
            No
          </Button>
          <Button color="red" onClick={handleLeaveTrip}>
            Yes, Leave Trip
          </Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default TripDetails;
