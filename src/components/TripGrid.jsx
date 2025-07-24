import React from "react";
import { Container, Grid, Button, Group, Text, Modal, LoadingOverlay, Skeleton  } from "@mantine/core";
import TripCard from "./TripCard";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import CopyTripLink from "./CopyTripLink";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TripGrid = ({userId, setCurrTripId}) => {

  const [opened, { open, close }] = useDisclosure(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null); // State to hold the trip data for the modal


  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/trips/user/${userId}`);

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTrips(data.trips); 
        console.log(data.trips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []); 


  const handleCardClick = (trip) => {
    setSelectedTrip(trip);
    open(); 
  };

  if (loading) {
    return (
      <Container size="xl" py="lg" className="relative">
        <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />
        {/* skeleton loaders */}
        <Grid gutter="md" rowgap="xl" columngap="xl">
          {[...Array(6)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
              <Skeleton height={160} radius="md" mb="md" />
              <Skeleton height={20} width="70%" mb="xs" />
              <Skeleton height={16} width="50%" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="lg">
        <Text color="red" ta="center">Error loading trips: {error}</Text>
        <Text ta="center">Please ensure your backend server is running and accessible at `{API_BASE_URL}/api/trips`.</Text>
      </Container>
    );
  }

  if (trips.length === 0) {
    return (
      <Container size="xl" py="lg">
        <Text ta="center">No trips found. Start by creating some trips in your database!</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="lg">
      <Grid gutter="md" rowgap="xl" columngap="xl">
        {trips.map((trip) => (
          <Grid.Col key={trip.id} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
            <TripCard trip={trip} onCardClick={() => handleCardClick(trip)} />
          </Grid.Col>
        ))}
      </Grid>
      <Group justify="center" mt="lg">
        {/* TODO: Implement Load More logic*/}
        <Button >Load More</Button>
      </Group>

      <Modal opened={opened} onClose={close} title={selectedTrip?.title || "Trip Details"} centered size="lg"> {/* Changed size to "lg" for larger horizontal */}
        {selectedTrip && (
          <div className="space-y-4">
            <img
              src={selectedTrip.tripImage || `https://placehold.co/800x600/E0E0E0/333333?text=No+Image`}
              alt={selectedTrip.title || "Trip Image"}
               className="w-full h-24 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/800x600/E0E0E0/333333?text=Image+Error`;
              }}
            />
            <Text className="text-xl font-bold text-gray-800">{selectedTrip.title}</Text>
            <Text className="text-gray-700">
              <strong>Host:</strong> {selectedTrip.host?.name || "Unknown"}
            </Text>
            <Text className="text-gray-700">
              <strong>City:</strong> {selectedTrip.city || "N/A"}
            </Text>
            <Text className="text-gray-700">
              <strong>Dates:</strong> {selectedTrip.startTime ? new Date(selectedTrip.startTime).toLocaleDateString() : 'N/A'} - {selectedTrip.endTime ? new Date(selectedTrip.endTime).toLocaleDateString() : 'N/A'}
            </Text>
            <Text className="text-gray-700">
              <strong>Description:</strong> {selectedTrip.description || "No description provided."}
            </Text>
            {selectedTrip.locations && selectedTrip.locations.length > 0 && (
              <div className="mt-4">
                <Text className="font-semibold text-gray-800">Locations:</Text>
                <ul className="list-disc list-inside">
                  {selectedTrip.locations.map(loc => (
                    <li key={loc.id} className="text-gray-600">{loc.name} ({loc.address})</li>
                  ))}
                </ul>
              </div>
            )}
            <CopyTripLink text={"View this Trip"} tripId={selectedTrip.id}/>
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default TripGrid;
