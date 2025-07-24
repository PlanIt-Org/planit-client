import React from "react";
import { Card, Text, Stack, Accordion } from "@mantine/core";

const ProfileTripAccordion = ({ userInfo }) => {
  return (
    <Accordion mt="xl" style={{ width: 350 }} multiple={false}>
      <Accordion.Item value="trips">
        <Accordion.Control>
          <Text fw={600}>Trips You've Been On</Text>
        </Accordion.Control>
        <Accordion.Panel>
          {userInfo?.trips && userInfo.trips.length > 0 ? (
            <Stack gap="xs">
              {userInfo.trips.map((trip) => (
                <Card
                  key={trip.id}
                  shadow="xs"
                  padding="md"
                  radius="sm"
                  withBorder
                  style={{ width: "100%" }}
                >
                  <Text fw={500}>{trip.name}</Text>
                  <Text size="sm">{trip.location}</Text>
                  <Text size="xs">{trip.date}</Text>
                </Card>
              ))}
            </Stack>
          ) : (
            <Text size="sm" color="dimmed">
              You haven't been on any trips yet.
            </Text>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ProfileTripAccordion;
