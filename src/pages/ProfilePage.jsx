import { useState, useEffect } from "react";
import { Container, Flex, Box, Divider } from "@mantine/core";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";
import ProfileTripAccordion from "../components/ProfileTripAccordion";
import ProfileCard from "../components/ProfileCard";

const ProfilePage = ({ setCurrTripId, setLocations }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

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
          <ProfileCard
            userInfo={userInfo}
            refreshUserInfo={fetchCurrentUser}
          ></ProfileCard>
          {/* Questionnaire Link */}
          <Divider my="xl" labelPosition="center" style={{ width: 350 }} />
          <a
            href="/questionnaire"
            style={{ textDecoration: "none", width: 350 }}
          ></a>
          {/* Accordion that lists user trips */}
          <ProfileTripAccordion></ProfileTripAccordion>
        </Container>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
