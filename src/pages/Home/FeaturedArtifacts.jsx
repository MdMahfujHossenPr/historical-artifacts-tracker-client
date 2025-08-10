import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaLandmark, FaEye } from "react-icons/fa";
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
        "https://historical-artifacts-tracker-server-lovat.vercel.app/artifacts/featured",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch featured artifacts.");

      const data = await res.json();
      setArtifacts(data);
    } catch (err) {
      setError(err.message || "An error occurred while loading data.");
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
      alert("Please log in to like artifacts.");
      return;
    }

    if (likingId === artifactId) return;
    setLikingId(artifactId);

    try {
      const token = await user.getIdToken();

      const res = await fetch(
        `https://historical-artifacts-tracker-server-lovat.vercel.app/like/${artifactId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error occurred while liking.");
      }

      const result = await res.json();

      setArtifacts((prev) =>
        prev.map((artifact) =>
          artifact._id === artifactId
            ? { ...artifact, likes: artifact.likes + (result.liked ? 1 : -1) }
            : artifact
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-20 max-w-full mx-auto">
      <motion.div
        className="flex flex-col md:flex-row md:space-x-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Left side */}
        <motion.div
          className="md:w-1/3 bg-rose-100 bg-opacity-90 rounded-3xl p-10 shadow-lg mb-12 md:mb-0 relative overflow-hidden flex flex-col justify-center"
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
          style={{ minWidth: "280px" }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-14 -right-14 w-44 h-44 bg-rose-300 rounded-full opacity-20 animate-pulse pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 left-8 w-64 h-64 bg-rose-200 rounded-full opacity-30 animate-pulse pointer-events-none"
            aria-hidden="true"
          />

          <FaLandmark
            className="text-8xl text-rose-700 mb-6 drop-shadow-lg"
            style={{ filter: "drop-shadow(0 4px 6px rgba(220,38,38,0.4))" }}
          />

          <h2 className="text-4xl sm:text-5xl font-extrabold text-rose-700 tracking-wide drop-shadow-md mb-6 select-none">
            Featured Artifacts
          </h2>

          <p className="text-base sm:text-lg text-rose-800 leading-relaxed select-text mb-10">
            Discover rare historical treasures that reveal the richness of our heritage. Each artifact tells a unique story, carefully preserved for you to explore.
          </p>

          <div className="mb-10 grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center bg-white bg-opacity-70 rounded-xl p-6 shadow-inner">
              <span className="text-4xl font-extrabold text-rose-700 drop-shadow-sm select-text">
                {artifacts.length}
              </span>
              <span className="text-sm text-rose-600 select-text">Artifacts</span>
            </div>
            <div className="flex flex-col items-center bg-white bg-opacity-70 rounded-xl p-6 shadow-inner">
              <span className="text-4xl font-extrabold text-rose-700 drop-shadow-sm select-text">
                {artifacts.reduce((acc, a) => acc + (a.likes || 0), 0)}
              </span>
              <span className="text-sm text-rose-600 select-text">Total Likes</span>
            </div>
          </div>

          <blockquote className="border-l-4 border-rose-700 pl-6 italic text-rose-800 select-text mb-10">
            “Every artifact is a bridge between past and present — preserving stories for generations to come.”
            <footer className="mt-4 text-sm font-semibold text-rose-700">— Curator</footer>
          </blockquote>

          <button
            onClick={() => navigate("/all-artifacts")}
            className="bg-rose-700 hover:bg-rose-800 text-white px-10 py-3 rounded-3xl shadow-lg transition duration-300 font-semibold tracking-wide
              focus:outline-none focus:ring-4 focus:ring-rose-400 self-start"
            aria-label="View all artifacts"
          >
            View All Exhibits
          </button>
        </motion.div>

        {/* Right side */}
        <motion.div
          className="md:flex-1 bg-white bg-opacity-60 backdrop-blur-md rounded-3xl shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          {loading && (
            <p className="text-center text-rose-700 font-semibold text-lg col-span-full">
              Loading artifacts...
              <span className="loading loading-bars loading-md inline-block ml-3" />
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 font-semibold text-lg col-span-full">
              {error}
            </p>
          )}

          {!loading && !error && artifacts.length === 0 && (
            <p className="text-center text-yellow-600 font-medium text-lg col-span-full">
              Featured artifacts are available upon login. Please sign in to explore.
            </p>
          )}

          {!loading &&
            !error &&
            artifacts.map((artifact, index) => (
              <motion.div
                key={artifact._id}
                className="bg-white rounded-3xl shadow-lg border border-rose-200 cursor-pointer
                  hover:shadow-2xl hover:scale-105 transition-transform duration-300 flex flex-col overflow-hidden
                  focus:outline-none focus:ring-4 focus:ring-rose-400"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, type: "spring", stiffness: 130 }}
                onClick={() => navigate(`/artifact/${artifact._id}`)}
                aria-label={`View details for ${artifact.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/artifact/${artifact._id}`);
                }}
              >
                <div className="relative h-52 w-full overflow-hidden rounded-t-3xl shadow-inner border-b border-rose-300 border-opacity-40">
                  <img
                    src={
                      artifact.image ||
                      "https://via.placeholder.com/400x300?text=No+Image+Available"
                    }
                    alt={artifact.name}
                    className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold text-rose-700 mb-2 leading-tight line-clamp-2 drop-shadow-sm select-text">
                    {artifact.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-5 select-text">
                    Location: {artifact.presentLocation || "Unknown"}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Like Button with label on top */}
                    <div className="flex flex-col items-center select-text">
                      <span className="text-rose-700 font-semibold mb-1 select-text">
                        Like: {artifact.likes || 0}
                      </span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(artifact._id);
                        }}
                        whileTap={{ scale: 0.85 }}
                        disabled={likingId === artifact._id}
                        className={`flex items-center justify-center rounded-full font-semibold text-sm
                      transition-colors duration-300 select-none
                      ${
                        likingId === artifact._id
                          ? "bg-rose-200 text-rose-700 cursor-not-allowed"
                          : "bg-rose-600 hover:bg-rose-800 text-white shadow-md"
                      }
                      px-4 py-2
                      md:px-4 md:py-1
                      `}
                        aria-label={`Like artifact ${artifact.name}`}
                        title="Like"
                      >
                        <FaThumbsUp
                          className={`${
                            likingId === artifact._id ? "text-rose-700" : "text-white"
                          }`}
                          size={20}
                        />
                      </motion.button>
                    </div>

                    {/* View Details Button - icon only */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/artifact/${artifact._id}`);
                      }}
                      className="text-rose-600 hover:text-rose-900 font-semibold text-sm focus:outline-none flex items-center justify-center"
                      aria-label={`View details of ${artifact.name}`}
                      title="View Details"
                    >
                      <FaEye className="text-rose-700" size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedArtifacts;
