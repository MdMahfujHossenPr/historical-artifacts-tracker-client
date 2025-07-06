import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";

const MyArtifacts = () => {
  const { user } = useContext(AuthContext);
  const [artifacts, setArtifacts] = useState([]);
  const [editingArtifact, setEditingArtifact] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) {
          setArtifacts([]);
          setLoading(false);
          return;
        }
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`http://localhost:5000/my-artifacts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtifacts(res.data);
      } catch (error) {
        console.error("Error fetching artifacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, [user, auth]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = await auth.currentUser.getIdToken();
        await axios.delete(`http://localhost:5000/artifacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtifacts((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Artifact has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete artifact.", "error");
      }
    }
  };

  const handleEditClick = (artifact) => {
    setEditingArtifact(artifact);
    setFormData(artifact);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { _id, likes, adderEmail, adderName, createdAt, ...updatedData } =
      formData;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`http://localhost:5000/artifacts/${_id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArtifacts((prev) =>
        prev.map((item) =>
          item._id === _id ? { ...item, ...updatedData } : item
        )
      );
      setEditingArtifact(null);
      Swal.fire("Updated!", "Artifact has been updated.", "success");
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error!", "Failed to update artifact.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">Loading...</p>
    );
  }

  return (
    <div className="p-6">
      <title>my-artifacts</title>
      <h1 className="text-3xl font-bold mb-6 text-center">My Artifacts</h1>

      {artifacts.length === 0 ? (
        <div className="text-center text-rose-600">
          <p className="text-xl font-semibold">No Artifacts Added Yet</p>
          <p className="text-sm">
            You can add artifacts from the "Add Artifacts" page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map((artifact) => (
            <div
              key={artifact._id}
              className="bg-rose-100 border-8 border-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={artifact.image}
                alt={artifact.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{artifact.name}</h2>
                <p className="text-sm">
                  <span className="font-semibold">Type:</span> {artifact.type}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Discovered By:</span>{" "}
                  {artifact.discoveredBy}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Created At:</span>{" "}
                  {artifact.createdAt}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Discovered At:</span>{" "}
                  {artifact.discoveredAt}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Location:</span>{" "}
                  {artifact.presentLocation}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Likes:</span> {artifact.likes}
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(artifact)}
                    className="bg-rose-500 hover:bg-rose-600 border-2 border-white text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <FaEdit /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(artifact._id)}
                    className="bg-red-500 hover:bg-red-600 border-2 border-white text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {editingArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4">Update Artifact</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Artifact Name"
                required
              />
              <input
                type="text"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Image URL"
                required
              />
              <input
                type="text"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Artifact Type"
              />
              <input
                type="text"
                name="createdAt"
                value={formData.createdAt || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Created At (e.g., 100 BC)"
              />
              <input
                type="text"
                name="discoveredAt"
                value={formData.discoveredAt || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Discovered At"
              />
              <input
                type="text"
                name="discoveredBy"
                value={formData.discoveredBy || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Discovered By"
              />
              <input
                type="text"
                name="presentLocation"
                value={formData.presentLocation || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Present Location"
              />
              <textarea
                name="historicalContext"
                value={formData.historicalContext || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Historical Context"
                required
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                placeholder="Short Description"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Update
              </button>
            </form>
            <button
              className="absolute top-2 right-3 text-red-500 text-xl"
              onClick={() => setEditingArtifact(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtifacts;
