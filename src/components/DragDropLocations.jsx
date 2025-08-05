// src/components/DragDropLocations.jsx
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { Text, Box, ActionIcon } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import classes from "../styles/DndListHandle.module.css";
import { useEffect } from "react";
import apiClient from "../api/axios";
import { notifications } from "@mantine/notifications";

function DragDropLocations({ locations, setLocations, id: tripId }) {
  const [internalLocations, internalHandlers] = useListState(locations);

  useEffect(() => {
    internalHandlers.setState(locations);
  }, [locations]);

  const handleRemove = async (indexToRemove) => {
    const originalOrder = Array.from(internalLocations);
    const locationToRemove = originalOrder[indexToRemove];

    // --- 1. Optimistic UI Update ---
    const newOrder = originalOrder.filter((_, i) => i !== indexToRemove);
    internalHandlers.setState(newOrder);
    setLocations(newOrder);

    if (locationToRemove.isNew) {
      notifications.show({
        title: "Location removed",
        message: `${locationToRemove.name} has been removed from your list.`,
        color: "green",
      });
      return;
    }

    // --- THIS IS THE FIX ---
    // We get the googlePlaceId for the DELETE request, as the backend expects it.
    const googlePlaceId = locationToRemove.googlePlaceId; 
    if (!googlePlaceId) {
      notifications.show({ title: "Deletion error", message: "Location is missing a Google Place identifier.", color: "red" });
      internalHandlers.setState(originalOrder);
      setLocations(originalOrder);
      return;
    }

    try {
      // --- 2. Persist Changes to the Backend ---
      // API Call A: Use the googlePlaceId to disassociate the location from the trip.
      await apiClient.delete(`/trips/${tripId}/locations/${googlePlaceId}`);

      // API Call B: Update the locationOrder array with the remaining googlePlaceIds.
      const remainingLocationIds = newOrder.map(loc => loc.googlePlaceId);
      await apiClient.put(`/trips/${tripId}/locations/order`, { locationIds: remainingLocationIds });

      notifications.show({
        title: "Location Removed",
        message: `${locationToRemove.name} has been successfully removed from the trip.`,
        color: "green",
      });

    } catch (error) {
      // --- 3. Revert on Error ---
      console.error("Failed to remove location:", error);
      internalHandlers.setState(originalOrder);
      setLocations(originalOrder);

      notifications.show({
        title: "Error Removing Location",
        message: error.response?.data?.message || "Could not update the trip. Please try again.",
        color: "red",
      });
    }
  };

  const handleDragEnd = async ({ destination, source }) => {
    if (!destination) return;

    const originalOrder = Array.from(internalLocations);
    const newOrder = Array.from(internalLocations);
    const [reorderedItem] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, reorderedItem);

    internalHandlers.setState(newOrder);
    setLocations(newOrder);

    try {
      const locationIds = newOrder.map(loc => loc.googlePlaceId);
      await apiClient.put(`/trips/${tripId}/locations/order`, { locationIds });

      notifications.show({
        title: "Order Saved",
        message: "Your new location order has been saved.",
        color: "green",
        autoClose: 2000,
      });

    } catch (error) {
      console.error("Failed to save location order:", error);
      internalHandlers.setState(originalOrder);
      setLocations(originalOrder);

      notifications.show({
        title: "Error Saving Order",
        message: "Could not save the new location order. Please try again.",
        color: "red",
      });
    }
  };

  const items = internalLocations.map((location, index) => (
    <Draggable
      key={location.googlePlaceId || `location-${index}`}
      index={index}
      draggableId={String(location.googlePlaceId || `location-${index}`)}
    >
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical size={18} stroke={1.5} />
          </div>
          <Box style={{ flexGrow: 1 }}>
            <Text fw={500}>{location.name}</Text>
            {(location.formatted_address || location.address) && (
              <Text c="dimmed" size="sm">
                {location.formatted_address || location.address}
              </Text>
            )}
          </Box>
          <ActionIcon
            variant="transparent"
            color="red"
            size="md"
            onClick={() => handleRemove(index)}
            aria-label={`Remove ${location.name}`}
          >
            <IconX size={36} stroke={1.5} />
          </ActionIcon>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.length > 0 ? (
              items
            ) : (
              <Text c="dimmed" ta="center" mt="md">
                Add locations to your trip!
              </Text>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DragDropLocations;
