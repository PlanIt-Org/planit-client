// components/ProfilePictureEditor.jsx
import { useState } from "react";
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

  const [previewConfig, setPreviewConfig] = useState({
    background: currentAvatarConfig.background,
    color: currentAvatarConfig.color,
    size: currentAvatarConfig.size,
  });

  const displayName =
    userInfo?.user_metadata?.display_name ||
    userInfo?.email?.split("@")[0] ||
    "User";
  const previewUrl = getPreviewUrl(previewConfig);

  const handleThemeSelect = async (themeName) => {
    const theme = AVATAR_THEMES[themeName];
    const newConfig = {
      background: theme.background,
      color: theme.color,
      size: previewConfig.size,
    };

    setPreviewConfig(newConfig);

    const result = await applyTheme(themeName);
    if (result.success && onUpdate) {
      onUpdate();
    }
  };

  const handleCustomUpdate = async () => {
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
      setPreviewConfig({
        background: "228be6",
        color: "fff",
        size: 128,
      });
      if (onUpdate) onUpdate();
    }
  };

  const handleSizeChange = (newSize) => {
    setPreviewConfig((prev) => ({ ...prev, size: newSize }));
  };

  const handleColorChange = (field, value) => {
    // Remove # from hex color if present
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

        {/* Quick Themes */}
        <div>
          <Text size="sm" weight={500} mb="xs">
            Quick Themes
          </Text>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SimpleGrid cols={5} spacing="xs" style={{ maxWidth: 320 }}>
              {Object.entries(AVATAR_THEMES).map(([themeName, theme]) => (
                <Tooltip key={themeName} label={`Apply ${themeName} theme`}>
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    style={{
                      backgroundColor: `#${theme.background}`,
                      color: `#${theme.color}`,
                    }}
                    onClick={() => handleThemeSelect(themeName)}
                    disabled={isLoading}
                  >
                    <Text size="xs" weight={700}>
                      {themeName.charAt(0).toUpperCase()}
                    </Text>
                  </ActionIcon>
                </Tooltip>
              ))}
            </SimpleGrid>
          </div>
        </div>

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

        {/* Size Slider */}
        {/* <div>
          <Text size="sm" weight={500} mb="xs">
            Avatar Size: {previewConfig.size}px
          </Text>
          <Slider
            value={previewConfig.size}
            onChange={handleSizeChange}
            min={64}
            max={256}
            step={16}
            marks={[
              { value: 64, label: "64px" },
              { value: 128, label: "128px" },
              { value: 192, label: "192px" },
              { value: 256, label: "256px" },
            ]}
            disabled={isLoading}
          />
        </div> */}

        {/* Action Buttons */}
        <Group position="apart" mt="md">
          <Button
            variant="subtle"
            leftIcon={<IconRefresh size={16} />}
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
              leftIcon={
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
