import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Text, Box, Stack, Button, Skeleton } from "@mantine/core";

const API_GEO_URL = import.meta.env.VITE_GEO_API_KEY;

export default function RouteBetween({ origin, destination, setEstimatedTime }) {
  const [mode, setMode] = useState("drive");
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const prevTimeRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) {
      return;
    }
    setLoading(true); 

    const url = `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=${mode}&apiKey=${API_GEO_URL}`;

    axios
      .get(url)
      .then((res) => {
        const timeInSec = res.data.features[0].properties.time;
        const tMin = timeInSec / 60; // convert to minutes

      
        if (prevTimeRef.current === null) {
    
          setEstimatedTime((currentTotal) => currentTotal + tMin);
        } else {
          // the user has changed the mode, so we adjust the total, so we have to  Subtract the old time and add the new time.
          setEstimatedTime(
            (currentTotal) => currentTotal - prevTimeRef.current + tMin
          );
        }

       
        setTime(tMin);
        prevTimeRef.current = tMin;
      })
      .catch((err) => {
        console.error("Geoapify error:", err);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [mode, origin, destination, setEstimatedTime]);

  const formatTime = () => {
    if (time === null) return "---";
    const min = Math.round(time);
    return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min} min`;
  };

  const isSustainable = mode === "walk" || mode === "bicycle";

  //all the different transportation method
  const allModes = [
    { value: "drive", label: "🚗 Drive" },
    { value: "walk", label: "🚶 Walk" },
    { value: "bicycle", label: "🚲 Bike" },
    { value: "transit", label: "🚌 Transit" },
  ];

  if (!origin || !destination) return null;


  if (loading) {
    return (
      <Box w={160} h="100%" p="md">
        <Skeleton height={80} circle mb="sm" />
        <Stack spacing="xs" w="100%">
          <Skeleton height={36} radius="sm" />
          <Skeleton height={36} radius="sm" />
          <Skeleton height={36} radius="sm" />
          <Skeleton height={36} radius="sm" />
        </Stack>
      </Box>
    );
  }


  let allowedModes = allModes;
  if (time > 40 && mode === "drive") {
    allowedModes = allModes.filter(
      (m) => m.value === "drive" 
    );
  }


  return (
    <Box
      w={160}
      h="100%"
      p="md"
      bg="#f1f3f5"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <Box
        w={80}
        h={80}
        mb="sm"
        style={{
          borderRadius: "50%",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {formatTime()}
      </Box>

      <Stack spacing="xs" w="100%">
        {/* Map over the filtered 'allowedModes' array */}
        {allowedModes.map(({ value, label }) => (
          <Button
            key={value}
            fullWidth
            variant={mode === value ? "filled" : "light"}
            color={
              (value === "walk" || value === "bicycle") && mode === value
                ? "green"
                : "gray"
            }
            onClick={() => setMode(value)}
          >
            {label}
          </Button>
        ))}
      </Stack>

      {isSustainable && (
        <Text mt="sm" c="green" ta="center" size="xs" fw={400}>
          You are choosing a sustainable option, great job! 🌱
        </Text>
      )}
    </Box>
  );
}
