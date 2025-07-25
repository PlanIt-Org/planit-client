import { useState } from "react";
import apiClient from "../api/axios";

/**
 * Custom hook to handle updating the user's display name.
 * It abstracts the API call logic, loading state, and error handling.
 *
 * @returns {Array} A tuple containing:
 * - updateDisplayName {function}: An async function to call with the new display name.
 * It returns an object with a `success` boolean and the response `data` or `error`.
 * - state {object}: An object with `isLoading` and `error` properties.
 */
const useUpdateDisplayName = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Function to trigger the API call to update the display name.
   * @param {string} displayName - The new display name for the user.
   * @returns {Promise<object>} A promise that resolves to an object indicating success or failure.
   */
  const updateDisplayName = async (displayName) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put("/users/me", { displayName });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error("Failed to update display name:", errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return [updateDisplayName, { isLoading, error }];
};

export default useUpdateDisplayName;
