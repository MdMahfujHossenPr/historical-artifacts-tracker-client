import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";

const ArtifactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [artifact, setArtifact] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const [activeTab, setActiveTab] = useState("details");

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatedArtifacts, setRelatedArtifacts] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }
        const token = await currentUser.getIdToken();

        // Artifact details
        const resArtifact = await axios.get(
          `https://historical-artifacts-tracker-server-lovat.vercel.app/artifacts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArtifact(resArtifact.data);
        setLikeCount(resArtifact.data.likes || 0);
        setIsLiked(resArtifact.data.isLikedByUser || false);

        // Reviews
        try {
          const resReviews = await axios.get(
            `https://historical-artifacts-tracker-server-lovat.vercel.app/reviews/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setReviews(resReviews.data || []);
        } catch {
          setReviews([]);
        }

        // Related artifacts
        try {
          const resRelated = await axios.get(
            `https://historical-artifacts-tracker-server-lovat.vercel.app/artifacts/related/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setRelatedArtifacts(resRelated.data || []);
        } catch {
          setRelatedArtifacts([]);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch data.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, auth, navigate]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();

      const response = await axios.post(
        `https://historical-artifacts-tracker-server-lovat.vercel.app/like/${id}`,
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

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) {
      Swal.fire("Warning", "Review cannot be empty", "warning");
      return;
    }
    try {
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken();

      const res = await axios.post(
        `https://historical-artifacts-tracker-server-lovat.vercel.app/reviews/${id}`,
        { review: newReview },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReviews((prev) => [res.data, ...prev]);
      setNewReview("");
      Swal.fire("Success", "Review added", "success");
    } catch {
      Swal.fire("Error", "Failed to add review", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-rose-900 loading loading-bars loading-lg"></span>
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

  const sliderSettings = {
    dots: true,
    infinite: relatedArtifacts.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, relatedArtifacts.length),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const shareUrl = window.location.href;

  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
      {/* Artifact Header */}
      <div className="bg-rose-100 border-8 border-white shadow-lg rounded-xl overflow-hidden mb-6">
        <img
          src={artifact.image}
          alt={artifact.name}
          className="w-full h-[350px] object-cover"
        />
        <div className="p-6">
          <h2 className="text-4xl font-bold mb-3">{artifact.name}</h2>
          <p className="mb-3 text-lg text-black">{artifact.description}</p>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`px-5 py-3 rounded-full text-white border-4 border-white transition ${
              isLiked ? "bg-red-600" : "bg-rose-500"
            } hover:opacity-90`}
          >
            {isLiked ? "❤️ Liked" : "🤍 Like"} ({likeCount})
          </button>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-4 mt-5 text-2xl">
            <FacebookShareButton url={shareUrl} quote={artifact.name}>
              <FaFacebook className="text-blue-600 hover:opacity-80 cursor-pointer" />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={artifact.name}>
              <FaTwitter className="text-sky-400 hover:opacity-80 cursor-pointer" />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={artifact.name}>
              <FaWhatsapp className="text-green-600 hover:opacity-80 cursor-pointer" />
            </WhatsappShareButton>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex space-x-6 border-b border-rose-300 mb-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 font-semibold text-lg ${
            activeTab === "details"
              ? "border-b-4 border-rose-700 text-rose-700"
              : "text-gray-600 hover:text-rose-700"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 font-semibold text-lg ${
            activeTab === "reviews"
              ? "border-b-4 border-rose-700 text-rose-700"
              : "text-gray-600 hover:text-rose-700"
          }`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("related")}
          className={`pb-2 font-semibold text-lg ${
            activeTab === "related"
              ? "border-b-4 border-rose-700 text-rose-700"
              : "text-gray-600 hover:text-rose-700"
          }`}
        >
          Related Artifacts
        </button>
      </nav>

      {/* Tabs Content */}
      {activeTab === "details" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 text-black">
          <p><strong>Type:</strong> {artifact.type || "N/A"}</p>
          <p><strong>Historical Context:</strong> {artifact.historicalContext || "N/A"}</p>
          <p><strong>Created At:</strong> {artifact.createdAt ? new Date(artifact.createdAt).toLocaleDateString() : "N/A"}</p>
          <p><strong>Discovered At:</strong> {artifact.discoveredAt || "N/A"}</p>
          <p><strong>Discovered By:</strong> {artifact.discoveredBy || "N/A"}</p>
          <p><strong>Present Location:</strong> {artifact.presentLocation || "N/A"}</p>
          <p><strong>Description:</strong> {artifact.description || "N/A"}</p>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-rose-300 rounded-lg focus:outline-rose-500"
              rows="4"
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <button
              onClick={handleReviewSubmit}
              className="mt-3 bg-rose-600 text-white py-2 px-6 rounded-lg hover:bg-rose-700 transition"
            >
              Submit Review
            </button>
          </div>

          {reviews.length === 0 && (
            <p className="text-center text-gray-500">No reviews yet.</p>
          )}
          <ul>
            {reviews.map((review) => (
              <li
                key={review._id}
                className="border-b border-rose-200 py-3 text-black"
              >
                <p className="font-semibold">{review.userName || "Anonymous"}</p>
                <p>{review.review}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "related" && (
        <div className="mb-10">
          {relatedArtifacts.length === 0 && (
            <p className="text-center text-gray-500">No related artifacts found.</p>
          )}
          {relatedArtifacts.length > 0 && (
            <Slider {...sliderSettings}>
              {relatedArtifacts.map((rel) => (
                <div key={rel._id} className="p-4">
                  <div
                    className="bg-rose-100 border-4 border-white rounded-lg shadow cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/artifact/${rel._id}`)}
                  >
                    <img
                      src={rel.image || "https://via.placeholder.com/400x300"}
                      alt={rel.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-lg">{rel.name}</h3>
                      <p className="text-sm line-clamp-2">{rel.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtifactDetails;
