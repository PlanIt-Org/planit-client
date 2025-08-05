import { useState, useEffect } from "react";
import { Container, Flex, Box, Divider, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import NavBar from "../components/NavBar";
import apiClient from "../api/axios";
import ProfileTripAccordion from "../components/ProfileTripAccordion";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../hooks/useAuth";

// --- Emotion Animations & Styled Components ---

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPageWrapper = styled(Flex)`
  width: 100%;
  min-height: 100vh;
  align-items: stretch;
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
`;

const AnimatedBox = styled(Box)`
  flex: 1;
  min-width: 0;
  padding: 20px;
  box-sizing: border-box;
  animation: ${fadeIn} 0.8s ease-out forwards;
  background: ${({ theme }) => theme.colors["custom-palette"][7]};
`;

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
    <StyledPageWrapper
      theme={theme}
      style={{
        flexDirection: isMobile ? "column" : "row",
        background: theme.colors["custom-palette"][7], // match HomePage background
      }}
    >
      {!isMobile && <NavBar currentPage={3}/>}

      {/* main content */}
      <AnimatedBox
        theme={theme}
        style={{
          padding: isMobile ? "16px" : "20px",
          background: theme.colors["custom-palette"][7], // match HomePage content background
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
            paddingBottom: isMobile ? "80px" : "0",
          }}
        >
          {/* Profile Card will now be rendered inside the animated container */}
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
            style={{
              textDecoration: "none",
              width: isMobile ? "100%" : 350,
              color: "white",
              textAlign: "center",
            }}
          >
            Go to Questionnaire
          </a>
        </Container>
      </AnimatedBox>

      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: theme.colors["custom-palette"][8],
            borderTop: `1px solid ${theme.colors["custom-palette"][6]}`,
          }}
        >
          <NavBar currentPage={3}  />
        </Box>
      )}
    </StyledPageWrapper>
  );
};

export default ProfilePage;
