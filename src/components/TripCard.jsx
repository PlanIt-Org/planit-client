import React from "react";
import {
  Box,
  Image,
  Title,
  Text,
  Group,
  Stack,
  Card,
  Button,
  Modal,
  ActionIcon
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconHeartFilled} from "@tabler/icons-react";
import { useState } from "react";

const TripCard = ({onCardClick}) => {
  const randomId = Math.floor(Math.random() * 10) + 10;
  const [isHeartFilled, setIsHeartFilled] = useState(false);


  const toggleHeart = (event) => {
    
    event.stopPropagation();
    setIsHeartFilled(prev => !prev);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder onClick={onCardClick} style={{ cursor: 'pointer' }} >
      <Card.Section>
        <Image
          src={`https://picsum.photos/id/${randomId}/800/600`}
          height={160}
          alt="Title of the trip"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Title</Text>
        {/* Make the heart icon clickable with ActionIcon */}
        <ActionIcon variant="transparent" onClick={toggleHeart} aria-label="Toggle favorite">
          {isHeartFilled ? (
            <IconHeartFilled size={30} color="red" /> 
          ) : (
            <IconHeart size={30} color="black" /> 
          )}
        </ActionIcon>
      </Group>

      <Group justify="space-between" mt="md" mb="xs">
        <Text size="sm" c="dimmed">
          Host By User
        </Text>
        <Text size="sm" c="dimmed">
          Date
        </Text>
      </Group>
    </Card>
  );
};

export default TripCard;
