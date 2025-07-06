import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

// Create and export Like Context
export const LikeContext = createContext();

// LikeProvider manages liked artifacts state and provides like-related utilities
export const LikeProvider = ({ children }) => {
  const { user, getToken } = useAuth(); // Access current user and token from AuthContext
  const [likedArtifacts, setLikedArtifacts] = useState([]); // Stores IDs of liked artifacts

  // Fetch liked artifacts from server whenever user changes
  useEffect(() => {
    if (!user) {
      setLikedArtifacts([]);
      return;
    }

    const fetchLikedArtifacts = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("http://localhost:5000/liked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch liked artifacts");

        const data = await res.json();
        setLikedArtifacts(data || []);
      } catch (error) {
        console.error("Fetching liked artifacts failed:", error);
        setLikedArtifacts([]);
      }
    };

    fetchLikedArtifacts();
  }, [user, getToken]);

  /**
   * Like or unlike an artifact by its ID.
   * Sends a POST request to the server and updates local state.
   * @param {string} artifactId - ID of the artifact to like or unlike
   * @returns {boolean} - Whether the artifact is now liked
   */
  const likeArtifact = async (artifactId) => {
    if (!user) return false;

    try {
      const token = await getToken();
      if (!token) return false;

      const res = await fetch(`http://localhost:5000/like/${artifactId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setLikedArtifacts((prev) =>
          result.liked
            ? [...prev, artifactId]
            : prev.filter((id) => id !== artifactId)
        );
        return result.liked;
      } else {
        console.error("Error from server:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Like request failed:", error);
      return false;
    }
  };

  /**
   * Check if a specific artifact is liked by the user
   * @param {string} artifactId - ID of the artifact
   * @returns {boolean}
   */
  const isLiked = (artifactId) => likedArtifacts.includes(artifactId);

  // Provide context values to children components
  return (
    <LikeContext.Provider value={{ likedArtifacts, likeArtifact, isLiked }}>
      {children}
    </LikeContext.Provider>
  );
};
