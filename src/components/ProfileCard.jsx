import { useState, useEffect } from "react";
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
import EditProfileModal from "../components/EditProfileModal";
import PasswordResetModal from "../components/PasswordResetModal";
import ProfilePictureEditor from "../components/ProfilePictureEditor";
import LogoutButton from "../components/LogoutButton";
import { useProfilePicture } from "../hooks/useProfilePicture";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current avatar URL using the hook
  console.log(
    "ProfileCard: Calling useProfilePicture with userInfo:",
    userInfo
  );
  const { getCurrentAvatarUrl } = useProfilePicture(userInfo);
  console.log(
    "ProfileCard: getCurrentAvatarUrl function from hook:",
    getCurrentAvatarUrl
  );

  if (!userInfo) {
    console.log("Loading profile card...");
    return <Loader color="blue" />;
  }

  const handleUpdateName = async (newName) => {
    console.log("submitting new name", newName);
  };

  const handleProfilePictureUpdate = () => {
    // Refresh user info after profile picture update
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
          onClose={() => setIsModalOpen(false)}
          onSuccess={(data) => {
            console.log("Password reset successful:", data.message);
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

      <Card
        shadow="md"
        padding="xl"
        radius="md"
        withBorder
        style={{ width: 350, marginBottom: 32 }}
      >
        <Flex direction="column" align="center" gap="md">
          {/* Avatar with Edit Button */}
          <div style={{ position: "relative" }}>
            <Avatar src={getCurrentAvatarUrl()} size={96} radius={48} />
            <Tooltip label="Customize avatar">
              <ActionIcon
                size="sm"
                radius="xl"
                color="blue"
                variant="filled"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={openProfilePicture}
              >
                <IconPalette size={12} />
              </ActionIcon>
            </Tooltip>
          </div>

          <Text size="lg" weight={700}>
            {userInfo.user_metadata?.display_name || userInfo.email}
          </Text>

          <Text color="dimmed" size="sm">
            {userInfo.email}
          </Text>

          {/* Show formatted join date */}
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

          <Button
            onClick={openEditProfile}
            variant="outline"
            color="blue"
            mt="md"
            fullWidth
          >
            Change Username
          </Button>

          <Button
            onClick={openChangePassword}
            variant="light"
            color="blue"
            fullWidth
          >
            Change Password
          </Button>

          <LogoutButton />

          <Button
            fullWidth
            size="md"
            color="blue"
            onClick={() => (window.location.href = "/questionnaire")}
          >
            Edit your Questionnaire
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default ProfileCard;
