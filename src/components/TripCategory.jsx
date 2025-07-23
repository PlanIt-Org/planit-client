import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useState } from "react";

const categories = [
  "Upcoming",
  "Drafts",
  "Invited Trips",
  "Hosting",
  "Past Events",
];

const TripCategory = () => {
  const [active, setActive] = useState(categories[0]);

  return (
    <>
      {/* TODO: make this text bigger, currently when making it bigger it shifts other stuff down???? */}
      {/* <Text ta="center" fw={700}>Your Trips</Text>  */}
      <Group gap="sm" justify="center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={active === category ? "outline" : "light"}
            color="blue"
            onClick={() => setActive(category)}
          >
            {category}
          </Button>
        ))}
      </Group>
    </>
  );
};

export default TripCategory;
