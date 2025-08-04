import React from "react";
import { Button, Group, ScrollArea, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const TripCategory = ({ categories, active, setActive }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const buttons = categories.map((category) => (
    <Button
      key={category}
      size={isMobile ? "xs" : "sm"}
      variant={active === category ? "outline" : "light"}
      color="blue"
      onClick={() => setActive(category)}
      style={{
        whiteSpace: "nowrap",
        minWidth: isMobile ? "auto" : "fit-content",
      }}
    >
      {category}
    </Button>
  ));

  return isMobile ? (
    //Mobile Viewx
    <ScrollArea type="hover" scrollbarSize={6}>
      <Group gap="xs" wrap="nowrap" py="xs" justify="center">
        {buttons}
      </Group>
    </ScrollArea>
  ) : (
    // Desktop view
    <Group justify="center" gap="sm" wrap="wrap">
      {buttons}
    </Group>
  );
};

export default TripCategory;
