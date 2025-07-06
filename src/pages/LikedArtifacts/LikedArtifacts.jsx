import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LikeContext } from "../../context/LikeContext";
import { useNavigate } from "react-router-dom";
import { FaThumbsDown } from "react-icons/fa";

const LikedArtifacts = () => {
  const [likedArtifacts, setLikedArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getToken } = useAuth();
  const { likeArtifact, isLiked } = useContext(LikeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedArtifacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(
          "https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app/liked",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch liked artifacts");

        const data = await res.json();
        setLikedArtifacts(data || []);
      } catch (err) {
        console.error("Failed to load liked artifacts:", err);
        setError("Failed to load liked artifacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedArtifacts();
  }, [getToken]);

  const handleUnlike = async (artifactId) => {
    try {
      const liked = await likeArtifact(artifactId);
      if (!liked) {
        setLikedArtifacts((prev) => prev.filter((a) => a._id !== artifactId));
      }
    } catch {
      alert("❌ Failed to unlike the artifact. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10"> Loading...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  if (likedArtifacts.length === 0)
    return (
      <p className="text-center text-yellow-500 mt-10 font-semibold">
        You haven't liked any artifacts yet.
      </p>
    );

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <title>Liked Artifacts</title>
      <h1 className="text-3xl font-bold text-center mb-8 text-rose-800">
        ❤️ Liked Artifacts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedArtifacts.map((artifact) => (
          <div
            key={artifact._id}
            className="bg-rose-100 border-8 border-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={artifact.image || "https://via.placeholder.com/400x300"}
              alt={artifact.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-black mb-2">
                {artifact.name}
              </h2>
              <p className="text-black text-sm mb-2 line-clamp-2">
                {artifact.description}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(`/artifact/${artifact._id}`)}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleUnlike(artifact._id)}
                  className="flex items-center gap-2 text-rose-400 bg-rose-300 border-2 border-white rounded-lg px-3 py-2 hover:bg-rose-200 ml-2"
                >
                  <FaThumbsDown className="text-xl" />
                  Dislike
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LikedArtifacts;
