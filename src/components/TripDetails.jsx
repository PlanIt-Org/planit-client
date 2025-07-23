import React from "react";
import { Card, Stack, Group, Button, Box, Title, Text, Modal, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DateSelector from "./DateSelector";
import { IconCalendarWeek } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";



const TripDetails = ({currTripId}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const handleLeaveTrip = () => {
        console.log("Leaving trip (yes option was clicked)");
        close();
      };

      const handleTripCopyLink = async () => {
        try {
          const inviteLink = `${window.location.origin}/tripsummary/${currTripId}`;
      
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
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Group justify="space-between">
          <Button variant="light" >Add Hosts</Button>
          <Button variant="filled" color="dark" onClick={open}>
            Leave Trip
          </Button>
        </Group>
        <Stack className="text-center py-4" style={{ textAlign: "center" }}>
          <Box
            p="md"
            style={{
              background: "#f8fafc",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            <Title size="xl" weight={700} mb={4}>
              Title: THIS WHOLE SECTION WILL BE POPULATED FROM BACKEND
            </Title>
          </Box>
          <Box
            p="sm"
            style={{
              background: "#f3f4f6",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <Text size="md" color="dimmed">
              Trip description: All these boxes are placeholders for later
            </Text>
          </Box>
          <Group grow spacing="sm">
            <Box
              p="sm"
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            >
            <Group>
              <Text size="sm" flex={1}>
                Day of the week, Date
              </Text>
              <ActionIcon
                variant="default"
                size="lg" 
                radius="md" 
                onClick={()=> {
                }} 
                aria-label="Open calendar" 
              >
                <IconCalendarWeek size={20}></IconCalendarWeek> 
              </ActionIcon>
              {/* <DateSelector></DateSelector> */}
              </Group>

            </Box>
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
              HOSTED BY: NAME
            </Text>
          </Box>
        </Stack>
        <Button variant="light" fullWidth mt="md" onClick={handleTripCopyLink}>
          Copy Link
        </Button>
      </Stack>
      {/* Leave Trip Confirmation Modal */}
      <Modal opened={opened} onClose={close} title="Confirm Leave Trip" centered>
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
