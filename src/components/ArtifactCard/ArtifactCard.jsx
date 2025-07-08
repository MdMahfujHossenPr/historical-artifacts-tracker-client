import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaUser, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const ArtifactCard = ({ artifact }) => {
  const {
    _id,
    image,
    name,
    description,
    likes = 0,
    adderName,
    presentLocation,
    createdAt,
    addedBy,
    adder,
  } = artifact;

  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const adderDisplayName = adderName || addedBy || adder || "Unknown";

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      return Swal.fire("Login Required", "Please login to like.", "info");

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await axios.post(
        `https://historical-artifacts-tracker-server-lovat.vercel.app/like/${_id}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const liked = res.data.liked;
      if (typeof liked === "boolean") {
        setIsLiked(liked);
        setLikeCount((prev) => prev + (liked ? 1 : -1));

        Swal.fire({
          icon: liked ? "success" : "info",
          title: liked ? "Liked!" : "Unliked!",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Error", "Unexpected response from server.", "error");
      }
    } catch (error) {
      console.error("Like error:", error);
      Swal.fire("Error", "Failed to like the artifact.", "error");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group">
      {/* Artifact Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 font-medium shadow-lg transition 
            ${isLiked ? "bg-red-500" : "bg-rose-500"} hover:opacity-90`}
        >
          <FaHeart />
          {likeCount}
        </button>

        {/* Info Badge */}
        <div className="absolute top-3 right-3 bg-white/90 p-3 rounded-xl shadow-xl text-sm text-rose-700 w-56 space-y-1 border border-rose-100 backdrop-blur-sm">
          <p className="flex items-center gap-2 font-medium text-red-500">
            <FaHeart /> {likeCount} Likes
          </p>
          <p className="flex items-center gap-2">
            <FaUser className="text-rose-500" /> {adderDisplayName}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-500" />{" "}
            {presentLocation || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-purple-500" />{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-bold text-rose-800 line-clamp-1 mb-1">
          {name}
        </h3>
        <p className="text-sm text-rose-600 line-clamp-2">
          {description?.slice(0, 120)}...
        </p>

        {/* Button */}
        <div className="mt-auto pt-4">
          <Link
            to={`/artifact/${_id}`}
            className="btn btn-sm btn-outline btn-primary w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtifactCard;
