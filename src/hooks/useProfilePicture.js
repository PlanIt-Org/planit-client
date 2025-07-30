// hooks/useProfilePicture.js
import { useState, useCallback, useMemo } from "react";
import axios from "axios";

const DEFAULT_AVATAR_CONFIG = {
  background: "007bff",
  color: "ffffff",
  size: 200,
};

export const AVATAR_THEMES = {
  blue: { background: "007bff", color: "ffffff" },
  green: { background: "28a745", color: "ffffff" },
  red: { background: "dc3545", color: "ffffff" },
  purple: { background: "6f42c1", color: "ffffff" },
  orange: { background: "fd7e14", color: "ffffff" },
  teal: { background: "20c997", color: "ffffff" },
  pink: { background: "e83e8c", color: "ffffff" },
  yellow: { background: "ffc107", color: "212529" },
  light: { background: "f8f9fa", color: "495057" },
  dark: { background: "343a40", color: "ffffff" },
};

/**
 * Custom hook for managing user profile pictures with ui-avatars.com
 * @param {Object} initialUser - Initial user object with profile data
 * @param {string} apiBaseUrl - Base URL for API calls (e.g., '/api/users')
 * @returns {Object} Hook methods and state
 */
export const useProfilePicture = (
  initialUser = null,
  apiBaseUrl = "/api/users"
) => {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const generateAvatarUrl = useCallback((name, config = {}) => {
    const { background, color, size } = { ...DEFAULT_AVATAR_CONFIG, ...config };
    const encodedName = encodeURIComponent(name || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=${size}`;
  }, []);

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

  const currentAvatarConfig = useMemo(() => {
    if (!user?.profilePictureUrl) return DEFAULT_AVATAR_CONFIG;
    return parseAvatarUrl(user.profilePictureUrl);
  }, [user?.profilePictureUrl, parseAvatarUrl]);

  const updateProfilePicture = useCallback(
    async (config) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.put(
          `${apiBaseUrl}/profile-picture`,
          config,
          { headers: getAuthHeaders() }
        );
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile picture";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, getAuthHeaders]
  );

  const updateDisplayName = useCallback(
    async (displayName) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.put(
          `${apiBaseUrl}/me`,
          { displayName },
          { headers: getAuthHeaders() }
        );
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update display name";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, getAuthHeaders]
  );

  const applyTheme = useCallback(
    async (themeName) => {
      const theme = AVATAR_THEMES[themeName];
      if (!theme) {
        setError(`Theme "${themeName}" not found`);
        return { success: false, error: `Theme "${themeName}" not found` };
      }
      return await updateProfilePicture({
        background: theme.background,
        color: theme.color,
        size: currentAvatarConfig.size,
      });
    },
    [updateProfilePicture, currentAvatarConfig.size]
  );

  const updateAvatarSize = useCallback(
    async (size) => {
      if (size < 16 || size > 512) {
        setError("Size must be between 16 and 512 pixels");
        return {
          success: false,
          error: "Size must be between 16 and 512 pixels",
        };
      }
      return await updateProfilePicture({
        background: currentAvatarConfig.background,
        color: currentAvatarConfig.color,
        size,
      });
    },
    [updateProfilePicture, currentAvatarConfig]
  );

  const updateAvatarColors = useCallback(
    async (background, color) => {
      const cleanBackground = background.replace("#", "");
      const cleanColor = color.replace("#", "");
      if (
        !/^[0-9a-fA-F]{6}$/.test(cleanBackground) ||
        !/^[0-9a-fA-F]{6}$/.test(cleanColor)
      ) {
        setError("Colors must be valid 6-digit hex codes");
        return {
          success: false,
          error: "Colors must be valid 6-digit hex codes",
        };
      }
      return await updateProfilePicture({
        background: cleanBackground,
        color: cleanColor,
        size: currentAvatarConfig.size,
      });
    },
    [updateProfilePicture, currentAvatarConfig.size]
  );

  const getPreviewUrl = useCallback(
    (config) => {
      const name = user?.name || user?.email?.split("@")[0] || "User";
      return generateAvatarUrl(name, config);
    },
    [user, generateAvatarUrl]
  );

  const resetToDefault = useCallback(async () => {
    return await updateProfilePicture(DEFAULT_AVATAR_CONFIG);
  }, [updateProfilePicture]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiBaseUrl}/me`, {
        headers: getAuthHeaders(),
      });
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch user data";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAuthHeaders]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isLoading,
    error,
    currentAvatarConfig,
    updateProfilePicture,
    updateDisplayName,
    applyTheme,
    updateAvatarSize,
    updateAvatarColors,
    resetToDefault,
    refreshUser,
    clearError,
    generateAvatarUrl,
    parseAvatarUrl,
    getPreviewUrl,
    themes: AVATAR_THEMES,
    defaultConfig: DEFAULT_AVATAR_CONFIG,
  };
};
