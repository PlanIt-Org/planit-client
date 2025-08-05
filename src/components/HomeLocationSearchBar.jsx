import { Text, Button, Group, Box, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TimePicker } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CityAutoCompleteSearchField from "./CityAutoCompleteSearchField";
import { notifications } from "@mantine/notifications";
import DatePickerPopover from "./DatePickerPopover";
import apiClient from "../api/axios";
import dayjs from "dayjs";

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

  const combineDateAndTime = (date, timeString) => {
    if (!date || !timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);

    return dayjs(date)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DDTHH:mm:ss");
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
      return;
    }
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
      navigate(`/tripfilter/${result.trip.id}`, { state: { isNew: true } });
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

  const clockIcon = (
    <IconClock style={{ width: "1rem", height: "1rem" }} stroke={1.5} />
  );

  const mobileWrapStyle = (theme) => ({
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      flexWrap: "wrap",
      "& > *": {
        marginBottom: `calc(${theme.spacing.sm} / 2)`,
      },
    },
  });

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: isMobile ? theme.spacing.md : theme.spacing.lg,
        background: theme.colors["custom-palette"][7],
        borderRadius: theme.radius.md,
      }}
    >
      <Text
        fw={700}
        size="xl"
        ta="center"
        c={theme.colors["custom-palette"][1]}
      >
        Plan a Trip!
      </Text>

      {isMobile ? (
        <Stack spacing="sm" w="100%" mt="md">
          <Group spacing="sm" grow sx={mobileWrapStyle}>
            <CityAutoCompleteSearchField
              onPlaceSelected={handleCitySelected}
              size="md"
              placeholder="Search for a city..."
              styles={{
                input: {
                  height: 44,
                  minHeight: 44,
                  borderRadius: "var(--mantine-radius-md)",
                  background: theme.colors["custom-palette"][8],
                  color: theme.colors["custom-palette"][1],
                },
                wrapper: { width: "100%" },
              }}
            />
            <DatePickerPopover
              size="xs"
              tripDate={tripDate}
              setTripDate={setTripDate}
            />
          </Group>

          <Group spacing="sm" grow sx={mobileWrapStyle}>
            <TimePicker
              leftSection={clockIcon}
              placeholder="Start time"
              value={startTime}
              onChange={setStartTime}
              size="md"
              styles={{
                input: {
                  fontWeight: 500,
                  height: 44,
                  minHeight: 44,
                  background: theme.colors["custom-palette"][8],
                  color: theme.colors["custom-palette"][1],
                },
              }}
            />
            <TimePicker
              leftSection={clockIcon}
              placeholder="End time"
              value={endTime}
              onChange={setEndTime}
              size="md"
              styles={{
                input: {
                  fontWeight: 500,
                  height: 44,
                  minHeight: 44,
                  background: theme.colors["custom-palette"][8],
                  color: theme.colors["custom-palette"][1],
                },
              }}
            />
            <Button
              onClick={handleGoClick}
              size="md"
              loading={isCreatingTrip}
              disabled={isCreatingTrip}
              style={{
                height: 44,
                minHeight: 44,
                background: theme.colors["custom-palette"][4],
                color: theme.colors["custom-palette"][7],
              }}
            >
              Go
            </Button>
          </Group>
        </Stack>
      ) : (
        <Group
          gap={0}
          align="center"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            minHeight: 64,
            background: theme.colors["custom-palette"][7],
            borderRadius: theme.radius.md,
          }}
        >
          <CityAutoCompleteSearchField
            onPlaceSelected={handleCitySelected}
            size="lg"
            styles={{
              input: {
                height: 48,
                minHeight: 48,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                background: theme.colors["custom-palette"][8],
                color: theme.colors["custom-palette"][1],
                border: `1px solid ${theme.colors["custom-palette"][4]}`,
              },
              wrapper: { flexGrow: 1, minWidth: 360, maxWidth: 700 },
            }}
          />
          <DatePickerPopover tripDate={tripDate} setTripDate={setTripDate} />
          <TimePicker
            leftSection={clockIcon}
            placeholder="Start time"
            value={startTime}
            onChange={setStartTime}
            size="lg"
            styles={{
              input: {
                fontWeight: 500,
                borderRadius: 0,
                height: 48,
                minHeight: 48,
                background: theme.colors["custom-palette"][8],
                color: theme.colors["custom-palette"][1],
              },
            }}
          />
          <TimePicker
            leftSection={clockIcon}
            placeholder="End time"
            value={endTime}
            onChange={setEndTime}
            size="lg"
            styles={{
              input: {
                fontWeight: 500,
                borderRadius: 0,
                borderLeft: "none",
                height: 48,
                minHeight: 48,
                background: theme.colors["custom-palette"][8],
                color: theme.colors["custom-palette"][1],
              },
            }}
          />
          <Button
            onClick={handleGoClick}
            size="lg"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: 48,
              minHeight: 48,
              background: theme.colors["custom-palette"][4],
              color: theme.colors["custom-palette"][7],
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
