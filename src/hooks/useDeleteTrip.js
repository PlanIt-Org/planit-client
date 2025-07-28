// src/hooks/useDeleteTrip.js
import { showNotification } from "@mantine/notifications";
import api from "../api/axios";

export const useDeleteTrip = () => {
  const deleteTrip = async ({
    id,
    onSuccess,
    onError,
  }) => {
    try {
      await api.delete(`/trips/${id}`);
      showNotification({
        title: "Trip deleted",
        message: "Trip was deleted successfully.",
        color: "green",
      });
      onSuccess?.(id);
    } catch (err) {
      console.error("Delete trip failed:", err);
      showNotification({
        title: "Error",
        message: "Failed to delete the trip.",
        color: "red",
      });
      onError?.(err);
    }
  };

  return { deleteTrip };
};
