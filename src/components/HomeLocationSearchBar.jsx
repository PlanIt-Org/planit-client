import { Text, Button, Group, NativeSelect, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CityAutoCompleteSearchField from "./CityAutoCompleteSearchField";
import { Grid } from "@mantine/core";

// creates all time values once for the right section start time and end time
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

const HomeLocationSearchBar = ({ selectedCity, setSelectedCity }) => {
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState(timeOptions[0]?.value || "");
  const [endTime, setEndTime] = useState(
    timeOptions[timeOptions.length - 1]?.value || ""
  );

  const handleCitySelected = (place) => {
    setSelectedCity(place);
    console.log("Selected City:", place);
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
      <Text fw={700} size="xl">Plan a Trip!</Text>
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
          data={timeOptions}
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
          data={timeOptions}
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
            navigate("/tripplanner");
          }}
          size="lg"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 48,
            minHeight: 48,
          }}
        >
          Go
        </Button>
      </Group>
    </Box>
  );
};

export default HomeLocationSearchBar;
