import { useState, useEffect } from "react";
import { Flex, Card, Avatar, Text, Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditProfileModal from "../components/EditProfileModal";

const ProfileCard = ({ userInfo }) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (!userInfo) {
    return <Loader color="blue" />;
  }

  const handleUpdateName = async (newName) => {
    console.log("submitting new name", newName);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Profile" centered>
        <EditProfileModal
          currentDisplayName={userInfo.user_metadata?.name}
          onClose={close}
          onSubmit={handleUpdateName}
        ></EditProfileModal>
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
          <Button
            onClick={open}
            variant="outline"
            color="blue"
            mt="md"
            fullWidth
          >
            Edit Profile
          </Button>
          <Button variant="light" color="blue" fullWidth>
            Change Password
          </Button>
          <Button variant="light" color="red" fullWidth>
            Logout
          </Button>
          <Button fullWidth size="md" color="blue">
            Edit your Questionnaire
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default ProfileCard;
