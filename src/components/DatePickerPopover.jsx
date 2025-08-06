import { useState } from "react";
import { DatePicker } from "@mantine/dates";
import { Popover, Button, useMantineTheme } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import "@mantine/dates/styles.css";
import { useMemo } from "react";

function DatePickerPopover({ tripDate, setTripDate }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  function parseDateLocal(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const formattedDate = useMemo(() => {
    const parsedDate =
      tripDate instanceof Date
        ? tripDate
        : tripDate
        ? parseDateLocal(tripDate)
        : null;

    return parsedDate && !isNaN(parsedDate)
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(parsedDate)
      : "Select date";
  }, [tripDate]);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      shadow="md"
    >
      <Popover.Target>
        <Button
          onClick={() => setOpened((o) => !o)}
          variant="default"
          leftSection={<IconCalendar size={18} />}
          size="lg"
          style={{
            height: 48,
            minHeight: 48,
            borderRadius: 0,
            fontWeight: 500,
            paddingLeft: 14,
            paddingRight: 14,
            background: theme.colors["custom-palette"][8],
            color: theme.colors["custom-palette"][2],
          }}
        >
          {formattedDate}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <DatePicker
          allowDeselect
          value={
            tripDate instanceof Date
              ? tripDate
              : tripDate
              ? parseDateLocal(tripDate)
              : null
          }
          onChange={(value) => setTripDate(value ?? null)}
          defaultDate={
            tripDate instanceof Date
              ? tripDate
              : tripDate
              ? parseDateLocal(tripDate)
              : undefined
          }
          minDate={new Date()}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export default DatePickerPopover;
