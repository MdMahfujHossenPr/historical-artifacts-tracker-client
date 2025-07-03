import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

export const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const { user, getToken } = useAuth();
  const [likedArtifacts, setLikedArtifacts] = useState([]);

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
        console.error("Fetching liked artifacts failed", error);
        setLikedArtifacts([]);
      }
    };

    fetchLikedArtifacts();
  }, [user, getToken]);

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
        console.error(result.error);
        return false;
      }
    } catch (error) {
      console.error("Like request failed", error);
      return false;
    }
  };

  const isLiked = (artifactId) => likedArtifacts.includes(artifactId);

  return (
    <LikeContext.Provider value={{ likedArtifacts, likeArtifact, isLiked }}>
      {children}
    </LikeContext.Provider>
  );
};
