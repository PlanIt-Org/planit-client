import { useState, useEffect } from "react";
import {
  Container,
  Flex,
  Box,
  Card,
  Avatar,
  Text,
  Button,
  Group,
  Divider,
  Stack,
  Accordion,
  Loader,
} from "@mantine/core";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";

const ProfilePage = ({ setCurrTripId, setLocations }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  // Placeholder user data
  // TODO: Pull all this info from the Supabase backend
  // Display name, email, created at info is all there
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=228be6&color=fff&size=128",
    createdAt: "July '25",
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get("/users/me");

      setUserInfo(response.data);
      console.log("Successfully fetched user info:", response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error("Error fetching user info:", errorMessage);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Flex
      style={{
        width: "100%",
        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      <NavBar
        currentPage={3}
        setCurrTripId={setCurrTripId}
        setLocations={setLocations}
      />
      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        <Container
          size="sm"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          {/* Profile Card */}
          {userInfo ? ( // Conditionally render the card only when userInfo is available
            <Card
              shadow="md"
              padding="xl"
              radius="md"
              withBorder
              style={{ width: 350, marginBottom: 32 }}
            >
              <Flex direction="column" align="center" gap="md">
                {/* Generate avatar from email or use a stored avatar_url if you have one.
        The Supabase user object might have metadata: userInfo.user_metadata.avatar_url 
      */}
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${userInfo.email}&background=228be6&color=fff&size=128`}
                  size={96}
                  radius={48}
                />

                {/* Display name from metadata if it exists, otherwise fall back to email.
        The Supabase user object often stores custom fields in user_metadata.
      */}
                <Text size="lg" weight={700}>
                  {userInfo.user_metadata?.name || userInfo.email}
                </Text>

                <Text color="dimmed" size="sm">
                  {userInfo.email}
                </Text>

                {/* Format the timestamp from the backend */}
                <Text>
                  Joined{" "}
                  {new Date(userInfo.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>

                <Button variant="outline" color="blue" mt="md" fullWidth>
                  Edit Profile
                </Button>
              </Flex>
            </Card>
          ) : (
            // Optional: Show a loading message or a spinner
            <Loader color="blue" />
          )}

          {/* Account Actions */}
          <Card
            shadow="xs"
            padding="lg"
            radius="md"
            withBorder
            style={{ width: 350 }}
          >
            <Stack>
              <Button variant="light" color="blue" fullWidth>
                Change Password
              </Button>
              <Button variant="light" color="red" fullWidth>
                Logout
              </Button>
            </Stack>
          </Card>

          {/* Questionnaire Link */}
          <Divider
            my="xl"
            label="or"
            labelPosition="center"
            style={{ width: 350 }}
          />
          <a
            href="/questionnaire"
            style={{ textDecoration: "none", width: 350 }}
          >
            <Button fullWidth size="md" color="blue">
              Edit your Questionnaire
            </Button>
          </a>

          {/* User's Trips Accordion */}
          {/* TODO: UPDATE THIS FROM BACKEND */}
          <Accordion mt="xl" style={{ width: 350 }} multiple={false}>
            <Accordion.Item value="trips">
              <Accordion.Control>
                <Text fw={600}>Trips You've Been On</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {userInfo?.trips && userInfo.trips.length > 0 ? (
                  <Stack gap="xs">
                    {userInfo.trips.map((trip) => (
                      <Card
                        key={trip.id}
                        shadow="xs"
                        padding="md"
                        radius="sm"
                        withBorder
                        style={{ width: "100%" }}
                      >
                        <Text fw={500}>{trip.name}</Text>
                        <Text size="sm" color="dimmed">
                          {trip.location}
                        </Text>
                        <Text size="xs" color="gray">
                          {trip.date}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" color="dimmed">
                    You haven't been on any trips yet.
                  </Text>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
