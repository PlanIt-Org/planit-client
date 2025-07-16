import React from "react";
import { Container, Grid, Button, Group, Text, Modal } from "@mantine/core";
import TripCard from "./TripCard";
import { useDisclosure } from "@mantine/hooks";

const TripGrid = () => {

  const [opened, { open, close }] = useDisclosure(false);


  return (
    <Container size="xl" py="lg">
      <Grid gutter="md" rowgap="xl" columngap="xl">
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard onCardClick={open}/>
        </Grid.Col>
      </Grid>
      <Group justify="center" mt="lg">
        <Button> Load More</Button>
      </Group>

      <Modal opened={opened} onClose={close} title="Modal" centered>
        {/* Modal content */}
      </Modal>
    </Container>
  );
};

export default TripGrid;
