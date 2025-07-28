import React from 'react'
import { Text, Container, Flex, Box} from '@mantine/core';
import NavBar from '../components/NavBar';
import TripGrid from '../components/TripGrid';


const DiscoverTripsPage = ({setCurrTripId, setLocations}) => {
  return (
    <Flex
      style={{
        width: '100%',    
        minHeight: '100vh', 
        alignItems: 'stretch', 
      }}
    >
      <NavBar currentPage={1} setCurrTripId={setCurrTripId} setLocations={setLocations}/>

        {/* main content */}
      <Box
        style={{
          flex: 1, 
          minWidth: 0,
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <Container size="mid" py="0"> 
        <Text
            ta="center"
            fw={700}
            size="xl" 
          >
            Discover Trips
          </Text>
          <Text
            ta="center"
            size="xl" 
          >
            based on 
          </Text>
          <TripGrid></TripGrid>
          </Container>
      </Box>
    </Flex>
  );
}

export default DiscoverTripsPage