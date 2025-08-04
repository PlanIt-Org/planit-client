// components/QuickThemeSelector.jsx
import { Group, ActionIcon, Tooltip, Text, Alert } from "@mantine/core";
import { useProfilePicture, AVATAR_THEMES } from "../hooks/useProfilePicture";

const QuickThemeSelector = ({ userInfo, onUpdate, size = "sm" }) => {
  const { applyTheme, isLoading, error, clearError } =
    useProfilePicture(userInfo);

  const handleThemeSelect = async (themeName) => {
    const result = await applyTheme(themeName);
    if (result.success && onUpdate) {
      onUpdate();
    }
  };

  return (
    <div>
      <Text size="xs" weight={500} mb={4} color="dimmed">
        Quick Avatar Themes
      </Text>

      {error && (
        <Alert
          size="xs"
          color="red"
          mb="xs"
          onClose={clearError}
          withCloseButton
        >
          {error}
        </Alert>
      )}

      <Group spacing={4}>
        {Object.entries(AVATAR_THEMES).map(([themeName, theme]) => (
          <Tooltip key={themeName} label={`${themeName} theme`} position="top">
            <ActionIcon
              size={size}
              radius="xl"
              style={{
                backgroundColor: `#${theme.background}`,
                color: `#${theme.color}`,
                opacity: isLoading ? 0.6 : 1,
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
      </Group>

      {isLoading && (
        <Text size="xs" color="dimmed" mt={4}>
          Updating avatar...
        </Text>
      )}
    </div>
  );
};

export default QuickThemeSelector;
