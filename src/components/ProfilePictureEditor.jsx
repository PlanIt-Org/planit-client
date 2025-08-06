import { useState, useEffect } from "react";
import {
  Modal,
  Avatar,
  Text,
  Button,
  Group,
  Stack,
  ColorInput,
  Slider,
  Alert,
  Loader,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Divider,
} from "@mantine/core";
import { IconPalette, IconRefresh, IconCheck } from "@tabler/icons-react";
import { useProfilePicture, AVATAR_THEMES } from "../hooks/useProfilePicture";

const ProfilePictureEditor = ({ opened, onClose, userInfo, onUpdate }) => {
  const {
    isLoading,
    error,
    currentAvatarConfig,
    applyTheme,
    updateAvatarColors,
    updateAvatarSize,
    resetToDefault,
    getPreviewUrl,
    clearError,
  } = useProfilePicture(userInfo);

  // This is now the single source of truth for the avatar's appearance.
  const [previewConfig, setPreviewConfig] = useState(currentAvatarConfig);

  // This effect ensures the editor resets to the current avatar state each time it's opened.
  useEffect(() => {
    if (opened) {
      setPreviewConfig(currentAvatarConfig);
    }
  }, [opened, currentAvatarConfig]);

  const displayName =
    userInfo?.user_metadata?.display_name ||
    userInfo?.email?.split("@")[0] ||
    "User";
  const previewUrl = getPreviewUrl(previewConfig);

  const handleCustomUpdate = async () => {
    // The preview is already up-to-date, so we just save the current config.
    const result = await updateAvatarColors(
      previewConfig.background,
      previewConfig.color
    );

    if (result.success) {
      if (previewConfig.size !== currentAvatarConfig.size) {
        await updateAvatarSize(previewConfig.size);
      }
      if (onUpdate) onUpdate();
    }
  };

  const handleReset = async () => {
    const result = await resetToDefault();
    if (result.success) {
      const defaultConfig = {
        background: "228be6",
        color: "fff",
        size: 128,
      };
      setPreviewConfig(defaultConfig);
      if (onUpdate) onUpdate();
    }
  };

  const handleSizeChange = (newSize) => {
    // Size changes are reflected in the preview immediately.
    setPreviewConfig((prev) => ({ ...prev, size: newSize }));
  };

  const handleColorChange = (field, value) => {
    // This now updates the preview directly, causing an instant visual change.
    const cleanValue = value.replace("#", "");
    setPreviewConfig((prev) => ({ ...prev, [field]: cleanValue }));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Customize Profile Picture"
      size="md"
      centered
    >
      <Stack spacing="lg">
        {/* Error Alert */}
        {error && (
          <Alert color="red" onClose={clearError} withCloseButton>
            {error}
          </Alert>
        )}

        {/* Avatar Preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar src={previewUrl} size={120} radius={60} />
        </div>

        <Text align="center" size="sm" color="dimmed">
          Preview for: {displayName}
        </Text>

        <Divider />

        {/* Custom Colors */}
        <div>
          <Text size="sm" weight={500} mb="xs">
            Custom Colors
          </Text>
          <Stack spacing="sm">
            <ColorInput
              label="Background Color"
              placeholder="Pick background color"
              value={`#${previewConfig.background}`}
              onChange={(value) => handleColorChange("background", value)}
              disabled={isLoading}
              format="hex"
              swatches={[
                "#2e2e2e",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
            <ColorInput
              label="Text Color"
              placeholder="Pick text color"
              value={`#${previewConfig.color}`}
              onChange={(value) => handleColorChange("color", value)}
              disabled={isLoading}
              format="hex"
              swatches={[
                "#2e2e2e",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
          </Stack>
        </div>

        <Divider />

        {/* Size Slider (Commented out as in original) */}
        {/* <div> ... </div> */}

        {/* Action Buttons */}
        <Group position="apart" mt="md">
          <Button
            variant="subtle"
            leftSection={<IconRefresh size={16} />}
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset to Default
          </Button>

          <Group>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              leftSection={
                isLoading ? <Loader size={16} /> : <IconCheck size={16} />
              }
              onClick={handleCustomUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Apply Changes"}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ProfilePictureEditor;
