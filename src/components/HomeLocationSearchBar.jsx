import { Text, Button, Group, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TimePicker } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import CityAutoCompleteSearchField from "./CityAutoCompleteSearchField";
import { notifications } from "@mantine/notifications";
import DatePickerPopover from "./DatePickerPopover";
import apiClient from "../api/axios";

const HomeLocationSearchBar = ({ selectedCity, setSelectedCity, user }) => {
  const navigate = useNavigate();

  // State now holds time strings (e.g., "14:30") or empty strings
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [tripDate, setTripDate] = useState(null);

  const handleCitySelected = (place) => {
    setSelectedCity(place);
    console.log("Selected City:", place);
  };

  // UPDATED HELPER FUNCTION: Now correctly handles time strings
  const combineDateAndTime = (datePart, timeString) => {
    if (!datePart || !timeString) return null;

    // 1. Split the "HH:mm" string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);

    // 2. Create a new Date object from the selected date
    const combined = new Date(datePart);

    // 3. Set the hours and minutes from the time string
    combined.setHours(hours);
    combined.setMinutes(minutes);
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    
    // 4. Return the combined date formatted as an ISO string
    return combined.toISOString();
  };

  const handleGoClick = async () => {
    // Updated validation logic
    if (!startTime || !endTime) {
      notifications.show({
        title: "Time Selection Missing!",
        message: "Please select both a start and an end time for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    } 
    // String comparison works for "HH:mm" format (e.g., "14:00" > "10:30")
    if (endTime <= startTime) {
      notifications.show({
        title: "Invalid Time Range!",
        message: "End time must be after the start time.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    }
    if (!selectedCity) {
      notifications.show({
        title: "City Selection Missing!",
        message: "Please select a city for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    } 
    if (!tripDate) {
      notifications.show({
        title: "Trip Date Missing!",
        message: "Please select a date for your trip.",
        color: "red",
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    }

    setIsCreatingTrip(true);
    try {
      // Use the new helper function to format times
      const formattedStartTime = combineDateAndTime(tripDate, startTime);
      const formattedEndTime = combineDateAndTime(tripDate, endTime);

      const tripData = {
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        hostId: user,
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
      const backendMessage = error.response?.data?.message || "An unexpected error occurred.";
      if (backendMessage.includes("only have up to 5 planning")) {
        notifications.show({
          title: "Limit Reached!",
          message: "You can only have up to 5 planning trips. Finish or delete one first.",
          color: "red",
          position: "bottom-center",
          autoClose: 6000,
        });
      } else {
        notifications.show({
          title: "Trip Creation Failed!",
          message: backendMessage,
          color: "red",
          position: "bottom-center",
          autoClose: 7000,
        });
      }
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const clockIcon = <IconClock style={{ width: '1rem', height: '1rem' }} stroke={1.5} />;

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
        {/* Date Picker */}
        <DatePickerPopover tripDate={tripDate} setTripDate={setTripDate} />
        
        {/* Start Time Picker */}
        <TimePicker
          leftSection={clockIcon}
          placeholder="Start time"
          value={startTime}
          onChange={(value) => setStartTime(value)} // onChange provides a string "HH:mm"
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
        
        {/* End Time Picker */}
        <TimePicker
          leftSection={clockIcon}
          placeholder="End time"
          value={endTime}
          onChange={(value) => setEndTime(value)} // onChange provides a string "HH:mm"
          size="lg"
          styles={{
            input: {
              fontWeight: 500,
              borderRadius: 0,
              height: 48,
              minHeight: 48,
              borderLeft: "none",
            },
          }}
        />

        {/* Go Button */}
        <Button
          onClick={handleGoClick}
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
