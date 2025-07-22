import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { Text, Box, ActionIcon } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import classes from "../styles/DndListHandle.module.css";
import { useEffect } from "react";

function DragDropLocations({ locations, setLocations }) {
  const [internalLocations, internalHandlers] = useListState(locations);

  // Tkeeps the internal state in sync with external changes to `locations
  useEffect(() => {
    internalHandlers.setState(locations);
  }, [locations, internalHandlers]);

  const handleRemove = (indexToRemove) => {
    const newOrder = internalLocations.filter(
      (_, index) => index !== indexToRemove
    );
    internalHandlers.setState(newOrder);
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
            {location.formatted_address && (
              <Text c="dimmed" size="sm">
                {location.formatted_address}
              </Text>
            )}
          </Box>
          <ActionIcon
            variant="transparent"
            color="red"
            size="md"
            onClick={() => handleRemove(index)} // remove the location when clicking on X
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

    // change the order of locations on array
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
