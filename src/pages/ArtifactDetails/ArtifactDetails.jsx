import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";

const ArtifactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [artifact, setArtifact] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch artifact details
  useEffect(() => {
    const fetchArtifact = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }
        const token = await currentUser.getIdToken();

        const res = await axios.get(`http://localhost:5000/artifacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setArtifact(res.data);
        setLikeCount(res.data.likes || 0);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Artifact not found or fetch failed.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtifact();
  }, [id, auth, navigate]);

  // Check if current user liked this artifact
  useEffect(() => {
    const checkLiked = async () => {
      if (!userEmail) return;

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setIsLiked(false);
          return;
        }
        const token = await currentUser.getIdToken();

        const res = await axios.get("http://localhost:5000/liked", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const liked = res.data.some((item) => item._id === id);
        setIsLiked(liked);
      } catch (error) {
        setIsLiked(false);
      }
    };

    checkLiked();
  }, [id, userEmail, auth]);

  // Like/unlike handler
  const handleLike = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);

    try {
      const token = await currentUser.getIdToken();

      const response = await axios.post(
        `http://localhost:5000/like/${id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const liked = response.data.liked;
      setIsLiked(liked);
      setLikeCount((prev) => prev + (liked ? 1 : -1));

      Swal.fire({
        icon: "success",
        title: liked ? "Liked!" : "Unliked!",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "Failed to like/unlike.", "error");
    } finally {
      setIsLiking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl font-semibold">
        ❌ Artifact not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10 p-4">
      <title>artifact-details</title>
      <div className="bg-rose-100 border-8 border-white shadow-lg rounded-xl overflow-hidden">
        <img
          src={artifact.image}
          alt={artifact.name}
          className="w-full h-[300px] object-cover"
        />
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2">{artifact.name}</h2>
          <p className="text-black mb-2">
            <span className="font-semibold">Type:</span> {artifact.type}
          </p>
          <p className="text-black mb-2">
            <span className="font-semibold">Historical Context:</span>{" "}
            {artifact.historicalContext}
          </p>
          <p className="text-black mb-2">
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(artifact.createdAt).toLocaleDateString()}
          </p>
          <p className="text-black mb-2">
            <span className="font-semibold">Discovered At:</span>{" "}
            {artifact.discoveredAt}
          </p>
          <p className="text-black mb-2">
            <span className="font-semibold">Discovered By:</span>{" "}
            {artifact.discoveredBy}
          </p>
          <p className="text-black mb-2">
            <span className="font-semibold">Present Location:</span>{" "}
            {artifact.presentLocation}
          </p>
          <p className="text-black mb-4">
            <span className="font-semibold">Short Description:</span>{" "}
            {artifact.description}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`px-4 py-2 rounded-full text-white border-4 border-white ${
                isLiked ? "bg-red-500" : "bg-rose-500"
              } hover:opacity-80 transition`}
            >
              {isLiked ? "❤️ Liked" : "🤍 Like"}
            </button>
            <p className="text-rose-700 font-semibold">
              Total Likes:<span className="text-green-400 ml-2">{likeCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactDetails;
