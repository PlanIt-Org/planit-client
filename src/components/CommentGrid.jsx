import React from "react";
import {
  Title,
  Card,
  Stack,
  Group,
  Text,
  InputBase,
  Avatar,
  Combobox,
  Paper,
  Grid,
  Select,
  Textarea,
  Button,
  Modal,
  Input,
  useCombobox,
} from "@mantine/core";
import { LoremIpsum } from "react-lorem-ipsum";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import axios from "axios";
import apiClient from "../api/axios";
import { useEffect } from "react";
import { useProfilePicture } from "../hooks/useProfilePicture";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all comments for a specific trip ID.
 * @param {string} tripId - The ID of the trip.
 * @returns {Promise<Array>} An array of comment objects.
 */
// async function fetchAllCommentsForTrip(tripId) {
//   try {
//     const response = await axios.get(`${API_BASE_URL}comments/trips/${tripId}`);

//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch comments for trip:", error);
//     throw error;
//   }
// }

function CommentBox({ onAddComment, locations, userId, tripId }) {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const [commentText, setCommentText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationsOptions, setLocationsOptions] = useState("");

  React.useEffect(() => {
    if (locations && locations.length > 0) {
      setLocationsOptions(
        locations.map((location) => ({
          value: location.name,
          label: location.name,
        }))
      );
    } else {
      setLocationsOptions([{ value: "general", label: "General Comment" }]);
    }
  }, [locations]);

  const createCommentData = async () => {
    try {
      console.log(selectedLocation, "selected loc");
      console.log(locations, "All my locations");

      let commentDataAPI;

      if (selectedLocation === "general" || selectedLocation === "") {
        //General comment
        commentDataAPI = {
          authorId: userId,
          text: commentText,
          tripId: tripId,
        };
      } else {
        //Comment with location tag
        const foundLocation = locations.find((location) => {
          return (
            location.name.trim().toLowerCase() ===
            selectedLocation.trim().toLowerCase()
          );
        });
        console.log("Find my locaiton", foundLocation);

        if (!foundLocation) {
          console.error("Error: Could not find the selected location.");
          return null;
        }

        console.log("My place id x2", foundLocation.place_id);
        const locationId = await fetchLocationID(foundLocation.place_id);

        commentDataAPI = {
          authorId: userId,
          text: commentText,
          tripId: tripId,
          locationId: locationId,
        };
      }

      return commentDataAPI;
    } catch (error) {
      console.error("An error occurred while creating comment data:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const data = await createCommentData();
    if (data) {
      try {
        const response = await addComments(data);

        // Call onAddComment with the response data from server
        onAddComment({
          text: commentText,
          location: selectedLocation !== "general" ? selectedLocation : "",
          serverResponse: response,
        });

        setCommentText("");
        setSelectedLocation("");
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
            label="Select a Location (optional)"
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
          <Button onClick={handleSubmit} mt="md">
            Submit Comment
          </Button>
        </Stack>
      </Modal>

      <Button onClick={open}>Add New Comment</Button>
    </>
  );
}

/**
 * Sends a new comment to the server.
 * @param {object} commentData - The comment object, e.g., { text: "Great trip!", tripId: "xyz-123" }
 * @returns {Promise<object>} The newly created comment from the server.
 */
async function addComments(commentData) {
  try {
    console.log("What I am passing", commentData);
    const response = await axios.post(`${API_BASE_URL}comments`, commentData);
    console.log("COmment data", commentData);

    console.log("Successfully created comment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
}

async function fetchCurrentUser() {
  try {
    const response = await apiClient.get("/users/me");

    // setEmail(response.data.email);
    console.log("Current data", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to get current  user:", error);
    throw error;
  }
}

async function fetchLocationID(place_id) {
  try {
    console.log("My place", place_id);
    place_id = place_id.trim();
    const response = await apiClient.get(`/locations/by-place-id/${place_id}`);

    console.log("Current location id", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Failed to get location ID :", error);
    throw error;
  }
}

export default function CommentGrid({
  tripId,
  userId,
  locations,
  comments,
  setComments,
  userObj,
}) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { generateAvatarUrl } = useProfilePicture(userObj);

  console.log("All locations", locations);

  console.log("Current user object", userObj);

  const handleAddComment = async (newCommentData) => {
    console.log("New comment submitted:", newCommentData);

    try {
      const user = await fetchCurrentUser();
      const userEmail = user.email;

      console.log("current email!!!!!!!", userEmail);
      if (comments) {
        const newComment = {
          id: comments.length + 1,
          author: {
            name: userEmail,
            avatar: generateAvatarUrl(userEmail),
          },
          text: newCommentData.text,
          location: newCommentData.location || "",
          // Include server response data if available
          ...(newCommentData.serverResponse && {
            id: newCommentData.serverResponse.id,
            createdAt: newCommentData.serverResponse.createdAt,
          }),
        };

        setComments([newComment, ...comments]);
      }
    } catch (error) {
      console.error("Failed to add comment to UI:", error);
    }
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
              />
            </Group>

            <Group justify="space-between">
              {/* <Title> Filter by Location</Title> */}
            </Group>

            <Stack spacing="md" mt="md">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <Paper key={comment.id} p="sm" withBorder radius="md">
                    <Group>
                      <Avatar
                        src={
                          comment.author?.avatar ||
                          generateAvatarUrl(comment.author?.name || "User")
                        }
                        alt={comment.author?.name || "Unknown"}
                        radius="xl"
                      />
                      <div>
                        <Text size="sm" fw={500}>
                          {comment.author?.name || "Unknown"}
                        </Text>
                        {comment.location?.length > 0 && (
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
