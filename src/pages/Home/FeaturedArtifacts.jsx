import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";

const FeaturedArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchFeaturedArtifacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setArtifacts([]);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch(
        "https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app/artifacts/featured",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("ফিচ করতে সমস্যা হয়েছে");

      const data = await res.json();
      setArtifacts(data);
    } catch (err) {
      setError(err.message || "দুঃখিত, ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedArtifacts();
  }, []);

  const handleLike = async (artifactId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("লাইক দিতে লগইন করুন!");
      return;
    }

    if (likingId === artifactId) return;
    setLikingId(artifactId);

    try {
      const token = await user.getIdToken();

      const res = await fetch(
        `https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app/like/${artifactId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "লাইক করার সময় সমস্যা হয়েছে");
      }

      const result = await res.json();

      setArtifacts((prev) =>
        prev.map((a) =>
          a._id === artifactId
            ? { ...a, likes: a.likes + (result.liked ? 1 : -1) }
            : a
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="px-4 py-16 max-w-screen-xl mx-auto">
      <motion.div
        className="flex justify-between items-center mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-black">
          Featured Artifacts
        </h2>
        <button
          onClick={() => navigate("/all-artifacts")}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg transition duration-300 shadow-md"
        >
          See All
        </button>
      </motion.div>

      {loading && (
        <p className="text-center text-black">
          Featured artifacts লোড হচ্ছে...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && artifacts.length === 0 && (
        <p className="text-center text-yellow-600 font-medium">
          কোনো Featured artifacts পাওয়া যায়নি।
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
                <p className="text-sm text-black mb-3">
                  Location: {artifact.presentLocation || "N/A"}
                </p>
                <p className="flex items-center gap-2 mb-4 text-black">
                  <FaThumbsUp
                    onClick={() => handleLike(artifact._id)}
                    title="Like"
                    className={`cursor-pointer ${
                      likingId === artifact._id
                        ? "text-rose-400"
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

export default FeaturedArtifacts;
