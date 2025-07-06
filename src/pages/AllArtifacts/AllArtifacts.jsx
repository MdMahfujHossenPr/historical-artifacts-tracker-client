import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import { LikeContext } from "../../context/LikeContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const AllArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState(null);
  const [error, setError] = useState(null);
  const { user, getToken } = useAuth();
  const { likeArtifact, isLiked } = useContext(LikeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(
          "https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app/artifacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch artifacts");
        const data = await res.json();
        setArtifacts(data || []);
      } catch (err) {
        console.error("Failed to load artifacts:", err);
        setError("Failed to load artifacts, please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, [getToken]);

  const handleLike = async (artifactId) => {
    if (!user) {
      alert("You must be logged in to like artifacts!");
      return;
    }

    if (likingId === artifactId) return;
    setLikingId(artifactId);

    try {
      const likedNow = await likeArtifact(artifactId);
      setArtifacts((prev) =>
        prev.map((a) =>
          a._id === artifactId
            ? {
                ...a,
                likes: likedNow
                  ? (a.likes || 0) + 1
                  : Math.max((a.likes || 1) - 1, 0),
              }
            : a
        )
      );
    } catch {
      alert("❌ Failed to like/unlike. Please try again.");
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="px-4 py-16 max-w-screen-xl mx-auto">
      <title>All Artifacts</title>
      <motion.div
        className="flex justify-between items-center mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-black">All Artifacts</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-md"
        >
          Back to Home
        </button>
      </motion.div>

      {loading && (
        <p className="text-center text-black">Loading all artifacts...</p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && artifacts.length === 0 && (
        <p className="text-center text-yellow-600 font-medium">
          No artifacts found.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {!loading &&
          !error &&
          artifacts.map((artifact, i) => (
            <motion.div
              key={artifact._id}
              className="bg-white/10 border-8 border-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <img
                src={artifact.image || "https://via.placeholder.com/300"}
                alt={artifact.name}
                className="w-full h-52 rounded-md object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                  {artifact.name}
                </h3>
                <p className="text-sm text-black mb-3 line-clamp-2">
                  {artifact.description || "No description available"}
                </p>
                <p className="flex items-center gap-2 mb-4 text-black">
                  <FaThumbsUp
                    onClick={() => handleLike(artifact._id)}
                    title={isLiked(artifact._id) ? "Unlike" : "Like"}
                    className={`cursor-pointer ${
                      likingId === artifact._id
                        ? "text-rose-400"
                        : isLiked(artifact._id)
                        ? "text-green-600"
                        : "text-rose-600"
                    }`}
                    style={{
                      pointerEvents:
                        likingId === artifact._id ? "none" : "auto",
                    }}
                  />
                  <span
                    className={
                      artifact.likes === 0 ? "text-rose-400" : "text-rose-900"
                    }
                  >
                    {artifact.likes || 0} Likes
                  </span>
                </p>

                <button
                  onClick={() => navigate(`/artifact/${artifact._id}`)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default AllArtifacts;
