// src/components/DragDropLocations.jsx
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { Text, Box, ActionIcon } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import classes from "../styles/DndListHandle.module.css";
import { useEffect } from "react";
// apiClient and notifications are no longer needed for deletion in this component
// import apiClient from "../api/axios";
// import { notifications } from "@mantine/notifications";

function DragDropLocations({ locations, setLocations, id: tripId }) {
  const [internalLocations, internalHandlers] = useListState(locations);

  useEffect(() => {
    internalHandlers.setState(locations);
  }, [locations, internalHandlers]);

  // --- THIS IS THE FIX ---
  // The handleRemove function is now synchronous and only manages local state.
  // The API call has been removed.
  const handleRemove = (indexToRemove) => {
    const newOrder = internalLocations.filter((_, index) => index !== indexToRemove);
    
    // Update the component's internal state
    internalHandlers.setState(newOrder);
    
    // Update the parent component's (TripPlannerPage) state
    setLocations(newOrder); 
  };

  const items = internalLocations.map((location, index) => (
    <Draggable
      key={location.place_id || `${location.name}-${index}`}
      index={index}
      draggableId={location.place_id || `${location.name}-${index}`}
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

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    const newOrder = Array.from(internalLocations);
    const [reorderedItem] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, reorderedItem);
    internalHandlers.setState(newOrder);

    setLocations(newOrder);
  };

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
