// src/pages/AllArtifacts/AllArtifacts.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LikeContext } from "../../context/LikeContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

/**
 * AllArtifacts page
 * - Search with debounce
 * - Filter by type/category
 * - Sort (likes, newest, name)
 * - Client-side pagination
 * - Skeleton loader while fetching
 * - Optimistic UI update for like button via LikeContext
 *
 * Tailwind color theme: rose as primary
 */

const PAGE_SIZES = [6, 9, 12];

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-lg p-4 flex flex-col">
    <div className="bg-gray-200 rounded-md w-full h-44 mb-4" />
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
    <div className="mt-auto flex items-center justify-between">
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const AllArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [displayed, setDisplayed] = useState([]); // current page slice
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState(null);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const debounceRef = useRef(null);

  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("most-liked"); // defaults
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const { user, getToken } = useAuth();
  const { likeArtifact, isLiked } = useContext(LikeContext);
  const navigate = useNavigate();

  // Derived list of unique types for filter dropdown
  const types = useMemo(() => {
    const setTypes = new Set();
    artifacts.forEach((a) => {
      if (a?.type) setTypes.add(a.type);
    });
    return ["all", ...Array.from(setTypes)];
  }, [artifacts]);

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
      setCurrentPage(1); // reset to first page on new search
    }, 450);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Fetch artifacts (all)
  useEffect(() => {
    let cancelled = false;
    const fetchArtifacts = async () => {
      setLoading(true);
      setError(null);
      try {
        // If you want to use search on backend, you could call /search?name=debouncedTerm
        const token = await getToken();
        const res = await fetch(
          "https://historical-artifacts-tracker-server-lovat.vercel.app/artifacts",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch artifacts");
        const data = await res.json();
        if (!cancelled) {
          // ensure array
          setArtifacts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load artifacts:", err);
        if (!cancelled) setError("Failed to load artifacts. Try reloading the page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArtifacts();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  // Apply search, filter, sort -> produce a filtered array
  const processed = useMemo(() => {
    let list = Array.isArray(artifacts) ? [...artifacts] : [];

    // search (client-side)
    if (debouncedTerm) {
      const q = debouncedTerm.toLowerCase();
      list = list.filter(
        (a) =>
          (a.name || "").toLowerCase().includes(q) ||
          (a.description || "").toLowerCase().includes(q)
      );
    }

    // filter type
    if (selectedType !== "all") {
      list = list.filter((a) => (a.type || "").toLowerCase() === selectedType.toLowerCase());
    }

    // sort
    switch (sortBy) {
      case "most-liked":
        list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "least-liked":
        list.sort((a, b) => (a.likes || 0) - (b.likes || 0));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt || b.createdAt || 0) - new Date(a.createdAt || a.createdAt || 0));
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "name-asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    return list;
  }, [artifacts, debouncedTerm, selectedType, sortBy]);

  // Pagination: compute displayed slice whenever processed, pageSize or page changes
  useEffect(() => {
    setCurrentPage(1); // reset page if processed list changed significantly
  }, [debouncedTerm, selectedType, sortBy, pageSize]);

  useEffect(() => {
    const total = processed.length;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayed(processed.slice(start, end));
  }, [processed, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));

  // handle like (uses LikeContext which performs server call + local state update)
  const handleLike = async (artifactId) => {
    if (!user) {
      alert("Please log in to like artifacts.");
      return;
    }
    if (likingId === artifactId) return;
    setLikingId(artifactId);

    try {
      const likedNow = await likeArtifact(artifactId); // expect boolean
      setArtifacts((prev) =>
        prev.map((a) =>
          a._id === artifactId
            ? { ...a, likes: likedNow ? (a.likes || 0) + 1 : Math.max((a.likes || 1) - 1, 0) }
            : a
        )
      );
    } catch (err) {
      console.error("Like failed", err);
      alert("Failed to like/unlike. Try again.");
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      <title>All Artifacts</title>

      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-rose-700">All Artifacts</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <label className="sr-only" htmlFor="search">Search artifacts</label>
          <input
            id="search"
            type="search"
            inputMode="search"
            placeholder="Search by name or description..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search artifacts"
          />

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by type"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Types" : t}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort artifacts"
          >
            <option value="most-liked">Most Liked</option>
            <option value="least-liked">Least Liked</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
        </div>
      </div>

      {/* Controls row 2: page size and stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-rose-700">{processed.length}</span> results
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per page:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Results per page"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : processed.length === 0 ? (
        <div className="text-center text-yellow-600 font-medium">No artifacts found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayed.map((artifact, i) => (
              <motion.article
                key={artifact._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                tabIndex={0}
                aria-label={`Artifact ${artifact.name}`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={artifact.image || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={artifact.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ aspectRatio: "16/10" }}
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold text-rose-700 mb-1 line-clamp-2">
                    {artifact.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {artifact.shortDescription || artifact.description || "No description available."}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(artifact._id);
                        }}
                        disabled={likingId === artifact._id}
                        aria-label={isLiked(artifact._id) ? "Unlike" : "Like"}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition 
                          ${likingId === artifact._id ? "bg-rose-100 text-rose-700" : isLiked(artifact._id) ? "bg-green-600 text-white" : "bg-rose-600 text-white"}
                        `}
                        title={isLiked(artifact._id) ? "Unlike" : "Like"}
                      >
                        <FaThumbsUp />
                      </button>

                      {/* like count shown above button as requested? We keep count next to icon for clarity */}
                      <div className="text-sm text-gray-700 select-none">
                        <div className="text-xs text-gray-400">Likes</div>
                        <div className="font-semibold text-rose-700">{artifact.likes || 0}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/artifact/${artifact._id}`)}
                      className="px-4 py-2 text-sm font-medium text-rose-700 border border-rose-700 rounded-lg hover:bg-rose-50 transition"
                      aria-label={`View details of ${artifact.name}`}
                    >
                      See more
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-rose-700">{currentPage}</span> of{" "}
              <span className="font-semibold text-rose-700">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-white border border-gray-200 shadow-sm disabled:opacity-50"
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>

              <div className="flex items-center gap-1">
                {/* show up to 5 page buttons centered around current page */}
                {(() => {
                  const pages = [];
                  const maxButtons = 5;
                  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                  let end = start + maxButtons - 1;
                  if (end > totalPages) {
                    end = totalPages;
                    start = Math.max(1, end - maxButtons + 1);
                  }
                  for (let p = start; p <= end; p++) {
                    pages.push(
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-rose-600 text-white" : "bg-white border border-gray-200"}`}
                        aria-current={p === currentPage ? "page" : undefined}
                      >
                        {p}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-white border border-gray-200 shadow-sm disabled:opacity-50"
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AllArtifacts;
