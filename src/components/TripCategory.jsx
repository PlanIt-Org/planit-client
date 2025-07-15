import React from "react";
import { Button, Group } from "@mantine/core";
import { useState } from "react";

const categories = ["Upcoming", "Invited Trips", "Hosting", "Past Events"];

const TripCategory = () => {
  const [active, setActive] = useState(categories[0]);
  
  return (
    <>
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
