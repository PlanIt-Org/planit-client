import { useState } from "react";
import {
  Flex,
  Card,
  Avatar,
  Text,
  Button,
  Loader,
  Modal,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPalette } from "@tabler/icons-react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import EditProfileModal from "../components/EditProfileModal";
import PasswordResetModal from "../components/PasswordResetModal";
import ProfilePictureEditor from "../components/ProfilePictureEditor";
import LogoutButton from "../components/LogoutButton";
import { useProfilePicture } from "../hooks/useProfilePicture";

// --- Emotion Animations & Styled Components ---

// 1. A keyframe animation for the card to float up into view.
const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 2. A keyframe animation to make an element pulse on hover.
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(0, 123, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

// 3. Style the Card component.
const AnimatedCard = styled(Card)`
  width: 350px;
  margin-bottom: 32px;
  // Apply the float-up animation with a delay
  animation: ${floatUp} 0.7s ease-out 0.2s forwards;
  // Set initial opacity to 0 so it's invisible before the animation starts
  opacity: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  // Add a "lift" effect on hover
  &:hover {
    box-shadow: ${({ theme }) =>
      (theme && theme.shadows && theme.shadows.xl) ||
      "0 8px 32px rgba(0,0,0,0.18)"};
    transform: translateY(-5px);
  }
`;

// 4. Style the Avatar's edit icon to apply the pulse animation on hover.
const PulsingActionIcon = styled(ActionIcon)`
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    animation: ${pulse} 1s infinite;
  }
`;

// 5. Create a styled button with a hover effect.
const InteractiveButton = styled(Button)`
  transition: transform 0.2s ease-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProfileCard = ({ userInfo, refreshUserInfo, user, setUser }) => {
  const [
    editProfileOpened,
    { open: openEditProfile, close: closeEditProfile },
  ] = useDisclosure(false);
  const [
    changePasswordOpened,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);
  const [
    profilePictureOpened,
    { open: openProfilePicture, close: closeProfilePicture },
  ] = useDisclosure(false);

  const { getCurrentAvatarUrl } = useProfilePicture(userInfo);

  if (!userInfo) {
    return <Loader color="blue" />;
  }

  const handleUpdateName = async (newName) => {
    console.log("submitting new name", newName);
  };

  const handleProfilePictureUpdate = () => {
    refreshUserInfo();
    closeProfilePicture();
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal
        opened={editProfileOpened}
        onClose={closeEditProfile}
        title="Change Username"
        centered
      >
        <EditProfileModal
          currentDisplayName={userInfo.user_metadata?.name}
          onClose={closeEditProfile}
          onSubmit={handleUpdateName}
          refreshUserInfo={refreshUserInfo}
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        opened={changePasswordOpened}
        onClose={closeChangePassword}
        title="Change Password"
        centered
      >
        <PasswordResetModal
          onClose={closeChangePassword} // Corrected from setIsModalOpen(false)
          onSuccess={(data) => {
            console.log("Password reset successful:", data.message);
            closeChangePassword(); // Close on success
          }}
        />
      </Modal>

      {/* Profile Picture Editor Modal */}
      <ProfilePictureEditor
        opened={profilePictureOpened}
        onClose={closeProfilePicture}
        userInfo={userInfo}
        onUpdate={handleProfilePictureUpdate}
      />

      {/* Use the new AnimatedCard component */}
      <AnimatedCard shadow="md" padding="xl" radius="md" withBorder>
        <Flex direction="column" align="center" gap="md">
          <div style={{ position: "relative" }}>
            <Avatar src={getCurrentAvatarUrl()} size={96} radius={48} />
            <Tooltip label="Customize avatar">
              {/* Use the new PulsingActionIcon */}
              <PulsingActionIcon
                size="sm"
                radius="xl"
                color="blue"
                variant="filled"
                onClick={openProfilePicture}
              >
                <IconPalette size={12} />
              </PulsingActionIcon>
            </Tooltip>
          </div>

          <Text size="lg" weight={700}>
            {userInfo.name}
          </Text>

          <Text c="dimmed" size="sm">
            {userInfo.email}
          </Text>

          <Text>
            Joined{" "}
            {userInfo.created_at
              ? new Date(userInfo.created_at).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Unknown"}
          </Text>

          {/* Use the new InteractiveButton for all buttons */}
          <InteractiveButton
            onClick={openEditProfile}
            variant="outline"
            color="blue"
            mt="md"
            fullWidth
          >
            Change Username
          </InteractiveButton>

          <InteractiveButton
            onClick={openChangePassword}
            variant="light"
            color="blue"
            fullWidth
          >
            Change Password
          </InteractiveButton>

          <LogoutButton />
        </Flex>
      </AnimatedCard>
    </>
  );
};

export default ProfileCard;
