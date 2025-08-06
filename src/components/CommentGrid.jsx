import React, { useState, useEffect } from "react";
import {
  Title,
  Card,
  Stack,
  Group,
  Text,
  Avatar,
  Paper,
  Grid,
  Select,
  Textarea,
  Button,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import apiClient from "../api/axios";
import { useProfilePicture } from "../hooks/useProfilePicture";

// This component is now self-contained and correct.
function CommentBox({ onAddComment, locations, userId, tripId, setProfilePictureURL }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [commentText, setCommentText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("general");
  const [locationsOptions, setLocationsOptions] = useState([]);


  useEffect(() => {
    const generalOption = { value: "general", label: "General Comment" };
    if (locations && locations.length > 0) {
      const locationSpecificOptions = locations.map((location) => ({
        value: location.name,
        label: location.name,
      }));
      setLocationsOptions([generalOption, ...locationSpecificOptions]);
    } else {
      setLocationsOptions([generalOption]);
    }
  }, [locations]);

  const createCommentData = async () => {
    if (!commentText.trim()) return null;

    if (selectedLocation === "general" || !selectedLocation) {
      return { authorId: userId, text: commentText, tripId: tripId, locationId: null };
    }

    const foundLocation = locations.find(
      (loc) => loc.name.trim().toLowerCase() === selectedLocation.trim().toLowerCase()
    );

    if (!foundLocation?.googlePlaceId) {
      console.error("Could not find location or its googlePlaceId.");
      return null;
    }

    try {
      const locationIdFromDb = await fetchLocationID(foundLocation.googlePlaceId);
      return { authorId: userId, text: commentText, tripId: tripId, locationId: locationIdFromDb };
    } catch (error) {
      console.error("An error occurred while creating comment data:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const data = await createCommentData();
    if (data) {
      try {
        const serverResponse = await addComments(data);
        
        // THE FIX, PART 1:
        // Pass an object containing both the server response AND the location name we already know.
        onAddComment({
          serverResponse,
          locationName: selectedLocation === "general" ? "" : selectedLocation,
        });
        
        setCommentText("");
        setSelectedLocation("general");
        close();
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add a New Comment" centered>
        <Stack>
          <Select
            label="Tag a Location (optional)"
            placeholder="Pick one"
            data={locationsOptions}
            value={selectedLocation}
            onChange={setSelectedLocation}
          />
          <Textarea
            label="Your Comment"
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(event) => setCommentText(event.currentTarget.value)}
            autosize
            minRows={3}
            required
          />
          <Button onClick={handleSubmit} mt="md" disabled={!commentText.trim()}>
            Submit Comment
          </Button>
        </Stack>
      </Modal>
      <Button onClick={open}>Add New Comment</Button>
    </>
  );
}

// Helper functions (no changes needed here)
async function addComments(commentData) {
  try {
    const response = await apiClient.post(`/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
}

async function fetchLocationID(placeId) {
  if (!placeId || typeof placeId !== 'string') {
    console.error("fetchLocationID called with invalid placeId:", placeId);
    return null;
  }
  try {
    const trimmedPlaceId = placeId.trim();
    const response = await apiClient.get(`/locations/by-place-id/${trimmedPlaceId}`);
    return response.data.id;
  } catch (error) {
    console.error("Failed to get location ID:", error);
    throw error;
  }
}

// Main Component
export default function CommentGrid({
  tripId,
  userId,
  locations,
  comments,
  setComments,
  userObj,
}) {

  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [name, setName] = useState("");



  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get("/users/me");

    
        setName(data.name)

        

        setProfilePictureURL(data.profilePictureUrl);

      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [tripId]); 

// src/components/CommentGrid.jsx

const handleAddComment = (commentPayload) => {
  const { serverResponse, locationName } = commentPayload;

  if (!serverResponse) return;

  // Create the new comment object for the UI.
  const formattedComment = {
      ...serverResponse,
      author: {
          // Use the logged-in user's data from the userObj prop
          name: name,
          // Use the correct property name to match what the server sends
          profilePictureUrl: profilePictureURL, 
      },
      location: locationName
  };
  
  setComments([formattedComment, ...comments]);
};
  return (
    <Grid>
      <Grid.Col>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack>
            <Group justify="space-between">
              <Title order={3} fw={300}>
                Comments
              </Title>
              <CommentBox
                onAddComment={handleAddComment}
                userId={userId}
                tripId={tripId}
                locations={locations}
                setProfilePictureURL = {setProfilePictureURL}
              />
            </Group>
            <Stack spacing="md" mt="md">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Paper key={comment.id} p="sm" withBorder radius="md">
                    <Group>
                      <Avatar
                        src={comment.author.profilePictureUrl}
                        alt={comment.author?.name || comment.author?.email || "Guest"}
                        radius="xl"
                      />
                      <div>
                        <Text size="sm" fw={500}>
                          {comment.author?.name || comment.author?.email || "Guest"}
                        </Text>
                        {/* This now uses the correct `location` property */}
                        {comment.location && (
                          <Text size="xs" c="dimmed">
                            on {comment.location}
                          </Text>
                        )}
                        <Text size="sm" mt={4}>
                          {comment.text}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center">
                  No comments yet. Be the first to add one!
                </Text>
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
