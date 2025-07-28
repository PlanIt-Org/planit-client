import { Text, Button, Group, NativeSelect, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CityAutoCompleteSearchField from "./CityAutoCompleteSearchField";
import { notifications } from "@mantine/notifications";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

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

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const handleCitySelected = (place) => {
    setSelectedCity(place);
    console.log("Selected City:", place);
  };

  const convertTimeToDate = (timeString) => {
    if (!timeString) return null;

    // TODO: fix this hardcoded
    const fixedDate = "2025-11-15";
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0; // 12 AM is 00 hours
    }
    const date = new Date(
      `${fixedDate}T${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:00Z`
    );
    return date.toISOString();
  };

  const handleGoClick = async () => {
    // notification if user does not change times
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

        const response = await fetch(`${API_BASE_URL}trips`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to create trip. Status: ${response.status}`
          );
        }

        const result = await response.json();
        console.log("Trip created successfully:", result.trip);
        navigate(`/tripfilter/${result.trip.id}`);
      } catch (error) {
        console.error("Error creating trip:", error);
        notifications.show({
          title: "Trip Creation Failed!",
          message:
            error.message ||
            "An unexpected error occurred while creating your trip.",
          color: "red",
          position: "bottom-center",
          autoClose: 7000,
        });
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
        margin: "32px 0",
      }}
    >
      <Text fw={700} size="xl">
        Plan a Trip!
      </Text>
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
    </Box>
  );
};

export default HomeLocationSearchBar;
