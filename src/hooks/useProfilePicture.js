// hooks/useProfilePicture.js
import { useState, useCallback, useMemo } from "react";
import apiClient from "../api/axios";

const DEFAULT_AVATAR_CONFIG = {
  background: "228be6",
  color: "fff",
  size: 128,
};

export const AVATAR_THEMES = {
  blue: { background: "228be6", color: "fff" },
  green: { background: "51cf66", color: "fff" },
  red: { background: "ff6b6b", color: "fff" },
  purple: { background: "9775fa", color: "fff" },
  orange: { background: "ff922b", color: "fff" },
  teal: { background: "20c997", color: "fff" },
  pink: { background: "f06595", color: "fff" },
  yellow: { background: "ffd43b", color: "212529" },
  gray: { background: "868e96", color: "fff" },
  dark: { background: "343a40", color: "fff" },
};

/**
 * Custom hook for managing user profile pictures with ui-avatars.com
 * Uses your existing apiClient with Supabase auth interceptors
 */
export const useProfilePicture = (userInfo) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate ui-avatars.com URL with given parameters
   */
  const generateAvatarUrl = useCallback((name, config = {}) => {
    const { background, color, size } = { ...DEFAULT_AVATAR_CONFIG, ...config };
    const encodedName = encodeURIComponent(name || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=${size}`;
  }, []);

  /**
   * Parse avatar URL to extract configuration
   */
  const parseAvatarUrl = useCallback((avatarUrl) => {
    if (!avatarUrl || !avatarUrl.includes("ui-avatars.com")) {
      return DEFAULT_AVATAR_CONFIG;
    }

    try {
      const url = new URL(avatarUrl);
      return {
        background:
          url.searchParams.get("background") ||
          DEFAULT_AVATAR_CONFIG.background,
        color: url.searchParams.get("color") || DEFAULT_AVATAR_CONFIG.color,
        size:
          parseInt(url.searchParams.get("size")) || DEFAULT_AVATAR_CONFIG.size,
        name: decodeURIComponent(url.searchParams.get("name") || "User"),
      };
    } catch {
      return DEFAULT_AVATAR_CONFIG;
    }
  }, []);

  /**
   * Get current avatar URL from userInfo
   * Prioritizes stored profilePictureUrl, falls back to generated URL
   */
  const getCurrentAvatarUrl = useCallback(() => {
    // If user has a stored profilePictureUrl, use that
    if (userInfo?.profilePictureUrl) {
      return userInfo.profilePictureUrl;
    }

    // Otherwise generate one from available name data
    const displayName =
      userInfo?.user_metadata?.display_name ||
      userInfo?.name ||
      userInfo?.email?.split("@")[0] ||
      "User";
    return generateAvatarUrl(displayName);
  }, [userInfo, generateAvatarUrl]);

  /**
   * Get current avatar configuration
   * Uses stored profilePictureUrl if available
   */
  const currentAvatarConfig = useMemo(() => {
    const currentUrl = userInfo?.profilePictureUrl || getCurrentAvatarUrl();
    return parseAvatarUrl(currentUrl);
  }, [userInfo?.profilePictureUrl, getCurrentAvatarUrl, parseAvatarUrl]);

  /**
   * Update user's profile picture with custom configuration
   * Uses your existing apiClient (auth handled by interceptors)
   */
  const updateProfilePicture = useCallback(async (config) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "useProfilePicture: Updating profile picture with config:",
        config
      );
      const response = await apiClient.put("/users/profile-picture", config);
      console.log("useProfilePicture: Profile picture updated successfully");
      return { success: true, user: response.data.user };
    } catch (err) {
      console.error(
        "useProfilePicture: Failed to update profile picture:",
        err
      );
      const errorMessage =
        err.response?.data?.message || "Failed to update profile picture";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Apply a predefined theme to the avatar
   */
  const applyTheme = useCallback(
    async (themeName) => {
      const theme = AVATAR_THEMES[themeName];
      if (!theme) {
        const errorMsg = `Theme "${themeName}" not found`;
        console.error("useProfilePicture:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log(`useProfilePicture: Applying ${themeName} theme`);
      return await updateProfilePicture({
        background: theme.background,
        color: theme.color,
        size: currentAvatarConfig.size, // Keep current size
      });
    },
    [updateProfilePicture, currentAvatarConfig.size]
  );

  /**
   * Update avatar size while keeping colors
   */
  const updateAvatarSize = useCallback(
    async (size) => {
      if (size < 16 || size > 512) {
        const errorMsg = "Size must be between 16 and 512 pixels";
        console.error("useProfilePicture:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log(`useProfilePicture: Updating avatar size to ${size}px`);
      return await updateProfilePicture({
        background: currentAvatarConfig.background,
        color: currentAvatarConfig.color,
        size,
      });
    },
    [updateProfilePicture, currentAvatarConfig]
  );

  /**
   * Update avatar colors while keeping size
   */
  const updateAvatarColors = useCallback(
    async (background, color) => {
      // Clean hex colors (remove # if present)
      const cleanBackground = background.replace("#", "");
      const cleanColor = color.replace("#", "");

      if (
        !/^[0-9a-fA-F]{3,6}$/.test(cleanBackground) ||
        !/^[0-9a-fA-F]{3,6}$/.test(cleanColor)
      ) {
        const errorMsg = "Colors must be valid hex codes";
        console.error("useProfilePicture:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log(
        `useProfilePicture: Updating avatar colors - bg: #${cleanBackground}, color: #${cleanColor}`
      );
      return await updateProfilePicture({
        background: cleanBackground,
        color: cleanColor,
        size: currentAvatarConfig.size,
      });
    },
    [updateProfilePicture, currentAvatarConfig.size]
  );

  /**
   * Get a preview URL without updating the profile
   */
  const getPreviewUrl = useCallback(
    (config) => {
      const name =
        userInfo?.user_metadata?.display_name ||
        userInfo?.name ||
        userInfo?.email?.split("@")[0] ||
        "User";
      return generateAvatarUrl(name, config);
    },
    [userInfo, generateAvatarUrl]
  );

  /**
   * Reset avatar to default configuration
   */
  const resetToDefault = useCallback(async () => {
    console.log("useProfilePicture: Resetting avatar to default configuration");
    return await updateProfilePicture(DEFAULT_AVATAR_CONFIG);
  }, [updateProfilePicture]);

  // Clear error function
  const clearError = useCallback(() => {
    console.log("useProfilePicture: Clearing error state");
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    currentAvatarConfig,

    // Actions
    updateProfilePicture,
    applyTheme,
    updateAvatarSize,
    updateAvatarColors,
    resetToDefault,
    clearError,

    // Utilities
    generateAvatarUrl,
    parseAvatarUrl,
    getPreviewUrl,
    getCurrentAvatarUrl,

    // Constants
    themes: AVATAR_THEMES,
    defaultConfig: DEFAULT_AVATAR_CONFIG,
  };
};
