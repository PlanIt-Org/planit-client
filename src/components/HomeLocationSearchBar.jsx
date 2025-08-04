// src/components/HomeLocationSearchBar.jsx
import {
  Text,
  Button,
  Group,
  NativeSelect,
  Box,
  useMantineTheme,
  Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CityAutoCompleteSearchField from "./CityAutoCompleteSearchField";
import { notifications } from "@mantine/notifications";
import DatePickerPopover from "./DatePickerPopover";
import apiClient from "../api/axios";
import { useMediaQuery } from "@mantine/hooks";

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute === 0 ? "00" : String(minute);
      const timeString = `${displayHour}:${displayMinute} ${period}`;
      times.push({ value: timeString, label: timeString });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();
const HomeLocationSearchBar = ({ selectedCity, setSelectedCity, user }) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [tripDate, setTripDate] = useState(null);

  const handleCitySelected = (place) => {
    setSelectedCity(place);
    console.log("Selected City:", place);
  };

  const convertTimeToDate = (timeString) => {
    if (!timeString || !tripDate) return null;

    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const localDate = new Date(tripDate);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const correctedDate = new Date(localDate.getTime() + timezoneOffset);

    const year = correctedDate.getFullYear();
    const month = String(correctedDate.getMonth() + 1).padStart(2, "0");
    const day = String(correctedDate.getDate()).padStart(2, "0");
    const hourString = String(hours).padStart(2, "0");
    const minuteString = String(minutes).padStart(2, "0");

    return `${year}-${month}-${day}T${hourString}:${minuteString}:00.000Z`;
  };

  const handleGoClick = async () => {
    if (!startTime || !endTime) {
      notifications.show({
        title: "Time Selection Missing!",
        message: "Please select both a start and an end time for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
    } else if (!selectedCity) {
      notifications.show({
        title: "City Selection Missing!",
        message: "Please select a city for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
    } else if (!tripDate) {
      notifications.show({
        title: "Trip Date Missing!",
        message: "Please select a date for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    } else {
      setIsCreatingTrip(true);

      try {
        const formattedStartTime = convertTimeToDate(startTime);
        const formattedEndTime = convertTimeToDate(endTime);

        const hostId = user;
        console.log("THIS IS WHAT IS PRINTING: " + user);

        const tripData = {
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          hostId: hostId,
          city: selectedCity.name,
          title: `Trip to ${selectedCity.name}`,
          description: `An exciting trip planned for ${selectedCity.name}!`,
        };

        const response = await apiClient.post("/trips", tripData);
        const result = response.data;

        console.log("Trip created successfully:", result.trip);
        navigate(`/tripfilter/${result.trip.id}`);
      } catch (error) {
        console.error("Error creating trip:", error);

        const backendMessage =
          error.response?.data?.message || "An unexpected error occurred.";

        if (backendMessage.includes("only have up to 5 planning")) {
          notifications.show({
            title: "Limit Reached!",
            message:
              "You can only have up to 5 planning trips. Finish or delete one first.",
            color: "red",
            position: "bottom-center",
            autoClose: 6000,
          });
        } else {
          notifications.show({
            title: "Trip Creation Failed!",
            message:
              backendMessage ||
              "An unexpected error occurred while creating your trip.",
            color: "red",
            position: "bottom-center",
            autoClose: 7000,
          });
        }
      } finally {
        setIsCreatingTrip(false);
      }
    }
  };

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: isMobile ? "16px 0" : "32px 0",
      }}
    >
      <Text fw={700} size={isMobile ? "lg" : "xl"} ta="center">
        Plan a Trip!
      </Text>
      {isMobile ? (
        // Mobile layout - stacked vertically
        <Stack gap="sm" w="100%" mt="md">
          <Group gap="sm" grow>
            <CityAutoCompleteSearchField
              onPlaceSelected={handleCitySelected}
              size="md"
              placeholder="Search for a city..."
              styles={{
                input: {
                  height: 44,
                  minHeight: 44,
                  borderRadius: "var(--mantine-radius-md)",
                },
                wrapper: {
                  width: "100%",
                },
              }}
            />
            <DatePickerPopover tripDate={tripDate} setTripDate={setTripDate} />
          </Group>
          <Group gap="sm" grow>
            <NativeSelect
              data={[{ value: "", label: "Start time" }, ...timeOptions]}
              value={startTime}
              onChange={(event) => setStartTime(event.currentTarget.value)}
              aria-label="Select start time"
              size="md"
              styles={{
                input: {
                  fontWeight: 500,
                  height: 44,
                  minHeight: 44,
                },
              }}
            />
            <NativeSelect
              data={[{ value: "", label: "End time" }, ...timeOptions]}
              value={endTime}
              onChange={(event) => setEndTime(event.currentTarget.value)}
              aria-label="Select end time"
              size="md"
              styles={{
                input: {
                  fontWeight: 500,
                  height: 44,
                  minHeight: 44,
                },
              }}
            />
            <Button
              onClick={() => {
                handleGoClick();
              }}
              size="md"
              style={{
                height: 44,
                minHeight: 44,
              }}
              loading={isCreatingTrip}
              disabled={isCreatingTrip}
            >
              Go
            </Button>
          </Group>
        </Stack>
      ) : (
        // Desktop layout - horizontal
        <Group
          gap={0}
          align="center"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            minHeight: 64,
          }}
        >
          {/* City Autocomplete */}
          <CityAutoCompleteSearchField
            onPlaceSelected={handleCitySelected}
            size="lg"
            styles={{
              input: {
                height: 48,
                minHeight: 48,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              wrapper: {
                flexGrow: 1,
                minWidth: 360,
                maxWidth: 700,
              },
            }}
          />
          {/* Time Selectors and Go Button */}
          <DatePickerPopover tripDate={tripDate} setTripDate={setTripDate} />
          <NativeSelect
            data={[{ value: "", label: "Start time" }, ...timeOptions]}
            value={startTime}
            onChange={(event) => setStartTime(event.currentTarget.value)}
            aria-label="Select start time"
            size="lg"
            styles={{
              input: {
                fontWeight: 500,
                borderRadius: 0,
                height: 48,
                minHeight: 48,
              },
            }}
          />
          <NativeSelect
            data={[{ value: "", label: "End time" }, ...timeOptions]}
            value={endTime}
            onChange={(event) => setEndTime(event.currentTarget.value)}
            aria-label="Select end time"
            size="lg"
            styles={{
              input: {
                fontWeight: 500,
                borderRadius: 0,
                borderLeft: "none",
                borderRight: "none",
                height: 48,
                minHeight: 48,
              },
            }}
          />
          <Button
            onClick={() => {
              handleGoClick();
            }}
            size="lg"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: 48,
              minHeight: 48,
            }}
            loading={isCreatingTrip}
            disabled={isCreatingTrip}
          >
            Go
          </Button>
        </Group>
      )}
    </Box>
  );
};

export default HomeLocationSearchBar;
