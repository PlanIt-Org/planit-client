import { useState, useEffect } from "react";
import { Flex, Card, Avatar, Text, Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditProfileModal from "../components/EditProfileModal";
import PasswordResetModal from "../components/PasswordResetModal";
import LogoutButton from "../components/LogoutButton";
const ProfileCard = ({ userInfo, refreshUserInfo, user, setUser }) => {
  const [
    editProfileOpened,
    { open: openEditProfile, close: closeEditProfile },
  ] = useDisclosure(false);
  const [
    changePasswordOpened,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!userInfo) {
    console.log("Loading profile card...");
    return <Loader color="blue" />;
  }

  const handleUpdateName = async (newName) => {
    console.log("submitting new name", newName);
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal
        opened={editProfileOpened}
        onClose={closeEditProfile}
        title="Edit Profile"
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
        ></PasswordResetModal>
      </Modal>
      <Card
        shadow="md"
        padding="xl"
        radius="md"
        withBorder
        style={{ width: 350, marginBottom: 32 }}
      >
        <Flex direction="column" align="center" gap="md">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${userInfo.email}&background=228be6&color=fff&size=128`}
            size={96}
            radius={48}
          />
          <Text size="lg" weight={700}>
            {userInfo.user_metadata?.display_name || userInfo.email}
          </Text>

          <Text color="dimmed" size="sm">
            {userInfo.email}
          </Text>

          <Text>
            Joined{" "}
            {new Date(userInfo.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Button
            onClick={openEditProfile}
            variant="outline"
            color="blue"
            mt="md"
            fullWidth
          >
            Edit Profile
          </Button>
          <Button
            onClick={openChangePassword}
            variant="light"
            color="blue"
            fullWidth
          >
            Change Password
          </Button>
          <LogoutButton></LogoutButton>
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
