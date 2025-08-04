import { useState, useEffect } from "react";
import { Container, Flex, Box, Divider, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";
import ProfileTripAccordion from "../components/ProfileTripAccordion";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = ({ setLocations }) => {
  const { session, setSession } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {!isMobile && <NavBar currentPage={3} setLocations={setLocations} />}

      {/* main content */}
      <Box
        style={{
          flex: 1,
          minWidth: 0,
          padding: isMobile ? "16px" : "20px",
          boxSizing: "border-box",
        }}
      >
        <Container
          size={isMobile ? "xs" : "sm"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: isMobile ? "calc(100vh - 60px)" : "100vh",
            width: "100%",
          }}
        >
          {/* Profile Card */}
          <ProfileCard
            user={session?.user}
            setUser={setSession}
            userInfo={userInfo}
            refreshUserInfo={fetchCurrentUser}
          />
          {/* Questionnaire Link */}
          <Divider
            my="xl"
            labelPosition="center"
            style={{ width: isMobile ? "100%" : 350 }}
          />
          <a
            href="/questionnaire"
            style={{ textDecoration: "none", width: isMobile ? "100%" : 350 }}
          ></a>
        
        </Container>
      </Box>
      {isMobile && (
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: 'var(--mantine-color-body)',
            borderTop: '1px solid var(--mantine-color-divider)',
          }}
        >
          <NavBar currentPage={3} setLocations={setLocations} />
        </Box>
      )}
    </Flex>
  );
};

export default ProfilePage;
