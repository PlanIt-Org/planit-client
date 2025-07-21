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

//Dummy Comments for testing
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
    id: 2,
    author: { name: "Sarah", avatar: "https://i.pravatar.cc/150?img=2" },
    text: "I am so excited for this trip! I can't wait to see the sights.",
    location: "",
  },
];

//Dummy Locations for testing
const mockLocations = [
  { value: "general", label: "General Comment" },
  { value: "Yosemite National Park", label: "Yosemite National Park" },
  { value: "Napa Valley", label: "Napa Valley" },
];

function CommentBox({ onAddComment }) {
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const [commentText, setCommentText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSubmit = () => {
    onAddComment({
      text: commentText,
      location: selectedLocation,
    });

    setCommentText("");
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
            data={mockLocations}
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
// console.log(comment.location)

export default function CommentGrid() {
  const [comments, setComments] = useState(mockComments);

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

              <CommentBox onAddComment={handleAddComment} />
            </Group>

            <Group justify="space-between">
              <Title> Filter by Location</Title>
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
