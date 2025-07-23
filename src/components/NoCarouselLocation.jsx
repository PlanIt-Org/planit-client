import React from "react";
import { Card, Image, Box, Group, Text, Title } from "@mantine/core";
import { IconBubbleFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import TripLocationModal from "./TripLocationModal";

const NoCarouselLocation = ({ locations }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box w="100%">
      <Group grow align="stretch" spacing="md">
        {locations.map((loc, index) => (
          <Card
            key={index}
            withBorder
            radius="md"
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onClick={open}
          >
            <Card.Section>
              <Image
                src={
                  loc.photoUrl || `https://picsum.photos/300/200?random=${index}`
                }
                alt={loc.name}
                height={200}
                fit="cover"
              />
            </Card.Section>

            <Box p="md" style={{ flexGrow: 1 }}>
              <Group justify="space-between" mt={4} mb={2}>
                <Title fw={500} size="xl">
                  {loc.name}
                </Title>
              </Group>
              <Text size="sm" c="dimmed" component="div">
                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                  <li>{loc.formatted_address}</li>
                  {loc.description && <li>{loc.description}</li>}
                </ul>
              </Text>
            </Box>

            <div
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                background: "white",
                borderRadius: "50%",
                padding: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                zIndex: 2,
              }}
            >
              <IconBubbleFilled size={24} color="#333" />
            </div>
          </Card>
        ))}
      </Group>

      <TripLocationModal opened={opened} open={open} close={close} />
    </Box>
  );
};

export default NoCarouselLocation;
