import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LikeContext } from "../../context/LikeContext";
import { useNavigate } from "react-router-dom";

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

        const res = await fetch("http://localhost:5000/liked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch liked artifacts");

        const data = await res.json();
        setLikedArtifacts(data || []);
      } catch (err) {
        console.error("লাইক করা আর্টিফ্যাক্ট লোড করতে সমস্যা:", err);
        setError(
          "লাইক করা আর্টিফ্যাক্ট লোড করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।"
        );
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
        // Means it was unliked
        setLikedArtifacts((prev) => prev.filter((a) => a._id !== artifactId));
      }
    } catch {
      alert("❌ আনলাইক করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ লোড হচ্ছে...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  if (likedArtifacts.length === 0)
    return (
      <p className="text-center text-yellow-500 mt-10 font-semibold">
        আপনি এখনও কোনো আর্টিফ্যাক্ট লাইক করেননি।
      </p>
    );

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-rose-800">
        ❤️ লাইক করা আর্টিফ্যাক্ট
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedArtifacts.map((artifact) => (
          <div
            key={artifact._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={artifact.image || "https://via.placeholder.com/400x300"}
              alt={artifact.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-rose-700 mb-2">
                {artifact.name}
              </h2>
              <p className="text-rose-500 text-sm mb-2 line-clamp-2">
                {artifact.description}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(`/artifact/${artifact._id}`)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
                >
                  বিস্তারিত দেখুন
                </button>
                <button
                  onClick={() => handleUnlike(artifact._id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 ml-2"
                >
                  আনলাইক করুন
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
