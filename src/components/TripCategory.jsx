import React from "react";
import { Button, Group, Text } from "@mantine/core";
import { useState } from "react";

const TripCategory = ({categories, active, setActive}) => {

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
