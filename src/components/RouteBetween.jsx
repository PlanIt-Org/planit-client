import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Text, Box, Stack, Button, Skeleton } from "@mantine/core";

const API_GEO_URL = import.meta.env.VITE_GEO_API_KEY;

export default function RouteBetween({ origin, destination, setEstimatedTime }) {
  const [mode, setMode] = useState(null); // The final recommended/selected mode
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const prevTimeRef = useRef(null);

  // this effect runs when locations change to find the best route automaticall, and it also runs when the user manually changes the mode.
  useEffect(() => {
    if (!origin || !destination) return;

    const userHasInteracted = prevTimeRef.current !== null;

 
    const getRouteTime = async (testMode) => {
      const url = `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=${testMode}&apiKey=${API_GEO_URL}`;
      const res = await axios.get(url);
      if (!res.data.features || res.data.features.length === 0) {
        throw new Error(`No route found for mode: ${testMode}`);
      }
      return res.data.features[0].properties.time / 60;
    };
    
    // this fetch is for when user toggles the different trans. mode
    const fetchSpecificMode = async () => {
      try {
        setLoading(true);
        const newTime = await getRouteTime(mode);
        setEstimatedTime(
          (currentTotal) => currentTotal - (prevTimeRef.current || 0) + newTime
        );
        setTime(newTime);
        prevTimeRef.current = newTime;
      } catch (err) {
        console.error(`Failed to get route for ${mode}:`, err);
       
      } finally {
        setLoading(false);
      }
    };

    // finds the best and most environmental friendly  route
    const findBestRoute = async () => {
      try {
        setLoading(true);
        let finalMode = "drive"; 
        const carTime = await getRouteTime("drive");
        let finalTime = carTime;

        if (carTime <= 6) {
          try {
            const bikeTime = await getRouteTime("bicycle");
            if (bikeTime <= 6) {
              try {
                const walkTime = await getRouteTime("walk");
                if (walkTime <= 12) {
                  finalMode = "walk";
                  finalTime = walkTime;
                } else {
                  finalMode = "bicycle";
                  finalTime = bikeTime;
                }
              } catch { finalMode = "bicycle"; finalTime = bikeTime; }
            } else if (bikeTime <= 10) {
              finalMode = "bicycle";
              finalTime = bikeTime;
            } else {
              try {
                const transitTime = await getRouteTime("transit");
                if (transitTime <= 30) {
                  finalMode = "transit";
                  finalTime = transitTime;
                }
              } catch { /* fallback to drive is default */ }
            }
          } catch { /* fallback to drive is default */ }
        }

        setMode(finalMode);
        setTime(finalTime);
        setEstimatedTime((currentTotal) => currentTotal + finalTime);
        prevTimeRef.current = finalTime;
      } catch (err) {
        console.error("Route optimization failed:", err);
        setMode("drive"); // if other routes fail because teh geoFiy api gives an error when the routes is impossible by car, bike, public transport, so we fallback to drive on any error
      } finally {
        setLoading(false);
      }
    };

    if (userHasInteracted) {
      fetchSpecificMode();
    } else {
      findBestRoute();
    }
  }, [mode, origin, destination, setEstimatedTime]);


  const formatTime = () => {
    if (time === null) return "---";
    const min = Math.round(time);
    return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min} min`;
  };

  const isSustainable = mode === "walk" || mode === "bicycle";

  const allModes = [
    { value: "drive", label: "🚗 Drive" },
    { value: "walk", label: "🚶 Walk" },
    { value: "bicycle", label: "🚲 Bike" },
    { value: "transit", label: "🚌 Transit" },
  ];

  if (loading || !mode) {
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
        {allModes.map(({ value, label }) => (
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


    </Box>
  );
}