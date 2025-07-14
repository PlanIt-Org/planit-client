import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';
import { Text, Box } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from '../styles/DndListHandle.module.css';
import { useEffect } from 'react';


function DragDropLocations({locations, setLocations}) {
  const [internalLocations, internalHandlers] = useListState(locations);

  // This useEffect keeps the internal state in sync with external changes to `locations`
  useEffect(() => {
    internalHandlers.setState(locations);
  }, [locations, internalHandlers]); // Added internalHandlers to dependency array as recommended by linter


  const items = internalLocations.map((location, index) => (
    // Ensure you have a unique key for each draggable item.
    // place_id is usually a good unique identifier for Google Places.
    <Draggable key={location.place_id || location.name} index={index} draggableId={location.place_id || location.name}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical size={18} stroke={1.5} />
          </div>
          <Box> {/* Use Box for better layout of text */}
            <Text fw={500}>{location.name}</Text>
            {location.formatted_address && (
              <Text c="dimmed" size="sm">
                {location.formatted_address}
              </Text>
            )}
            {/* You can add more details from the location object here */}
          </Box>
        </div>
      )}
    </Draggable>
  ));

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;

    // Create a new array from the current locations
    const newOrder = Array.from(internalLocations);

    // Remove the dragged item from its original position
    const [reorderedItem] = newOrder.splice(source.index, 1);

    // Insert the dragged item into its new position
    newOrder.splice(destination.index, 0, reorderedItem);

    // Update the internal state first
    internalHandlers.setState(newOrder);

    // change the order of locations on array
    setLocations(newOrder);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.length > 0 ? items : <Text c="dimmed" ta="center" mt="md">Add locations to your trip!</Text>}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DragDropLocations;