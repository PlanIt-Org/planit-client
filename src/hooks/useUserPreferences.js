// src/hooks/useUserPreferences.js
import { useState, useEffect } from "react";
import apiClient from "../api/axios";

/**
 * Custom React hook to fetch and manage the user's preferences from the backend.
 *
 * Fetches the user's preferences from the `/users/preferences` API endpoint on mount.
 * Returns the preferences in a structured object suitable for the questionnaire,
 * along with loading and error state.
 *
 * @returns {Object} An object containing:
 *   - preferences: The user's preferences structured for the questionnaire, or null if not loaded.
 *   - isLoading: Boolean indicating if the preferences are currently being loaded.
 *   - error: Any error encountered during fetching, or null if none.
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/users/preferences");
        if (data) {
          const structuredAnswers = {
            essentials: {
              age: data.age,
              dietary: data.dietaryRestrictions,
              location: data.location,
            },
            activities: {
              activityType: data.activityPreferences,
              budget: data.budget,
            },
            planningStyle: {
              tripLength: data.typicalTripLength,
              planningRole: data.planningRole,
            },
            personal: {
              eventAudience: data.typicalAudience,
              lifestyle: data.lifestyleChoices,
            },
          };
          setPreferences(structuredAnswers);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to fetch existing preferences:", err);
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return { preferences, isLoading, error };
}
