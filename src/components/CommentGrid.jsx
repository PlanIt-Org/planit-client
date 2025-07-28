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
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

/**
 * Fetches all comments for a specific trip ID.
 * @param {string} tripId - The ID of the trip.
 * @returns {Promise<Array>} An array of comment objects.
 */
async function fetchAllCommentsForTrip(tripId) {
  try {
    const response = await axios.get(`${API_BASE_URL}comments/trips/${tripId}`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments for trip:", error);
    throw error;
  }
}

const mockComments = [
  {
    id: 1,
    author: { name: "Keith", avatar: "https://i.pravatar.cc/150?img=1" },
    text: "Yosemite was absolutely breathtaking! The views from Glacier Point are a must-see.",
    location: "Yosemite National Park",
  },
  {
    id: 2,
    author: { name: "Bobby", avatar: "https://i.pravatar.cc/150?img=2" },
    text: "The wine tasting tour in Napa was fantastic. Highly recommend the cabernet.",
    location: "Napa Valley",
  },
  {
    id: 3,
    author: { name: "Sarah", avatar: "https://i.pravatar.cc/150?img=2" },
    text: "I am so excited for this trip! I can't wait to see the sights.",
    location: "",
  },
];

const mockLocations = [
  { value: "general", label: "General Comment" },
  { value: "Yosemite National Park", label: "Yosemite National Park" },
  { value: "Napa Valley", label: "Napa Valley" },
];

function CommentBox({ onAddComment, locations, userId, currTripId }) {
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

  const handleSubmit = () => {
    onAddComment({
      text: commentText,
      location: selectedLocation,
    });

    setCommentText("");

    const commentDataAPI = {
      authorId: userId,
      text: commentText,
      tripId: currTripId,
    };

    console.log("try again", commentDataAPI);

    addComments(commentDataAPI);

    setSelectedLocation("general");
    close();
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
    const response = await axios.post(`${API_BASE_URL}comments`, commentData);

    console.log("Successfully created comment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
}

export default function CommentGrid({ currTripId, userId, locations }) {
  const [comments, setComments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    if (currTripId) {
      fetchAllCommentsForTrip(currTripId)
        .then((data) => {
          setComments(data);
        })
        .catch((error) => {
          console.error("Failed to set comments:", error);
        });
    }
  }, [currTripId]);

  const handleAddComment = (newCommentData) => {
    console.log("New comment submitted:", comments);

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "CurrentUser",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      ...newCommentData,
    };
    setComments([newComment, ...comments]);
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
                currTripId={currTripId}
                locations={locations}
              />
            </Group>

            <Group justify="space-between">
              {/* <Title> Filter by Location</Title> */}
            </Group>

            <Stack spacing="md" mt="md">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Paper key={comment.id} p="sm" withBorder radius="md">
                    <Group>
                      <Avatar
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        radius="xl"
                      />
                      <div>
                        <Text size="sm" fw={500}>
                          {comment.author.name}
                        </Text>
                        {comment.location.length > 0 && (
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
