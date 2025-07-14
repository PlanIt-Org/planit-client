import React, { useRef } from "react";
import "../styles/LandingHeader.css";
import { Button, Text, Box, Group, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";

// TODO: change hardcoded text values (fontsize)

const LandingPage = () => {
  const navigate = useNavigate();

  const learnMoreRef = useRef(null); // to target scrolling

  return (
    <>
    <Stack
      style={{ width: "100%", minHeight: "100vh", padding: "16px 32px" }}
    >
      <header>
        <Group justify="space-between" align="center" style={{ width: "100%" }}>
          <Text style={{ fontSize: 36 }} fw={700}>
            PlanIt
          </Text>
          <Button
            variant="outline"
            color="gray"
            size="md"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </Group>
      </header>
      <Stack w="42vw" style={{ padding: "16px 32px" }} justify="flex-start" mt={96}>
        <Text fw={700} mb={0}>
          EVERY TRIP MADE EASY, JUST PLANIT.
        </Text>
        <Text style={{ fontSize: 78 }} fw={700}>
          Planning a hangout has never been easier.
        </Text>
        <Group mt="xl">
          <Button
            variant="filled"
            color="gray"
            size="xl"
            radius="md"
            onClick={() => {
              learnMoreRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Find out More
          </Button>
          <Button
            variant="filled"
            color="gray"
            size="xl"
            radius="md"
            // TODO: might have to change logic based on if user logged in, if login go to home page
            onClick={() => {
              navigate("/register");
            }}
          >
            Plan a Trip
          </Button>
        </Group>
      </Stack>      
    </Stack>
      <Stack
       ref={learnMoreRef}
      align="center"
      style={{ minHeight: "100vh", padding: "32px 16px"}}
    >
      <Text fw={700} style={{ fontSize: 32 }}>
        Learn More About us
      </Text>
      {/* TODO: later add extra stuff for when the user clicks on find out more */}
    </Stack>
    </>
  );
};

export default LandingPage;
