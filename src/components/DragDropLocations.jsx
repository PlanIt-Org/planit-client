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
    const locationToRemove = internalLocations[indexToRemove];
  
    const removeFromState = () => {
      const newOrder = internalLocations.filter((_, i) => i !== indexToRemove);
      internalHandlers.setState(newOrder);
      setLocations(newOrder);
      notifications.show({
        title: "Location removed",
        message: `${locationToRemove.name} has been removed from your list.`,
        color: "green",
      });
    };
  
    if (locationToRemove.isNew) {
      removeFromState();
      return; 
    }
  
    const placeId = locationToRemove.googlePlaceId;
  
    if (!placeId) {
      notifications.show({
        title: "Deletion error",
        message: "Location missing identifier",
        color: "red",
      });
      return;
    }
  
    try {
      await apiClient.delete(`/trips/${tripId}/locations/${placeId}`);
      removeFromState();
    } catch (error) {
      notifications.show({
        title: "Error deleting location",
        message:
          error.response?.data?.message ||
          "This location might have already been removed.",
        color: "red",
      });
    }
  };

  const handleDragEnd = async ({ destination, source }) => {
    // Exit if the item was dropped outside a valid area
    if (!destination) return;

    // Store the original order in case we need to revert on error
    const originalOrder = Array.from(internalLocations);

    // Create the new order for an optimistic UI update
    const newOrder = Array.from(internalLocations);
    const [reorderedItem] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, reorderedItem);

    // --- 1. Optimistic UI Update ---
    // Update the state immediately for a snappy user experience.
    internalHandlers.setState(newOrder);
    setLocations(newOrder);

    // --- 2. Persist the New Order to the Backend ---
    try {
      // Extract the unique IDs of the locations in their new order.
      const locationIds = newOrder.map(loc => loc.googlePlaceId);

      // Make the API call to your new backend endpoint.
      await apiClient.put(`/trips/${tripId}/locations/order`, { locationIds });

      // Optional: Show a temporary success notification.
      notifications.show({
        title: "Order Saved",
        message: "Your new location order has been saved.",
        color: "green",
        autoClose: 2000,
      });

    } catch (error) {
      console.error("Failed to save location order:", error);

      // --- 3. Revert on Error ---
      // If the API call fails, revert the UI back to the original order.
      internalHandlers.setState(originalOrder);
      setLocations(originalOrder);

      // Show an error message to the user.
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
