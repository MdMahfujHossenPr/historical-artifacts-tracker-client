import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LikeContext } from "../../context/LikeContext";
import { useNavigate } from "react-router-dom";
import { FaThumbsDown } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const LikedArtifacts = () => {
  const [likedArtifacts, setLikedArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const { likeArtifact } = useContext(LikeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedArtifacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(
          "https://historical-artifacts-tracker-server-lovat.vercel.app/liked",
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
        console.error(err);
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
        toast.success("Artifact removed from your liked list!");
      }
    } catch {
      toast.error("❌ Failed to unlike the artifact. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-bars loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">{error}</div>
    );
  }

  if (likedArtifacts.length === 0) {
    return (
      <div className="text-center mt-20 text-yellow-600 font-semibold">
        You haven't liked any artifacts yet.
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <section className="max-w-7xl mx-auto px-4 py-10">
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
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-black mb-2">
                  {artifact.name}
                </h2>
                <p className="text-black text-sm mb-4 line-clamp-2">
                  {artifact.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/artifact/${artifact._id}`)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleUnlike(artifact._id)}
                    className="flex items-center gap-2 text-rose-400 bg-rose-300 border-2 border-white rounded-lg px-3 py-2 hover:bg-rose-200 transition"
                    aria-label={`Dislike ${artifact.name}`}
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
    </>
  );
};

export default LikedArtifacts;
