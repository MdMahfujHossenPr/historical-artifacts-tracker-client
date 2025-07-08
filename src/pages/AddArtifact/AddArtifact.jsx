import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const AddArtifact = () => {
  const navigate = useNavigate();
  const { user, getToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    type: "Tools",
    historicalContext: "",
    description: "",
    historicalCreationDate: "",
    discoveredAt: "",
    discoveredBy: "",
    presentLocation: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (validationErrors[e.target.name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      image,
      type,
      historicalContext,
      description,
      historicalCreationDate,
      discoveredAt,
      discoveredBy,
      presentLocation,
    } = formData;

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Artifact Name is required.";
    if (!image.trim()) {
      newErrors.image = "Image URL is required.";
    } else if (
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(image)
    ) {
      newErrors.image = "Please enter a valid image URL.";
    }
    if (!type.trim()) newErrors.type = "Artifact Type is required.";
    if (!historicalContext.trim())
      newErrors.historicalContext = "Historical Context is required.";
    if (!description.trim())
      newErrors.description = "Short Description is required.";
    if (!historicalCreationDate.trim())
      newErrors.historicalCreationDate = "Creation Date is required.";
    if (!discoveredAt.trim())
      newErrors.discoveredAt = "Discovery Date is required.";
    if (!discoveredBy.trim())
      newErrors.discoveredBy = "Discoverer's Name is required.";
    if (!presentLocation.trim())
      newErrors.presentLocation = "Present Location is required.";

    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    const artifactData = {
      name,
      image,
      type,
      historicalContext,
      description,
      historicalCreationDate,
      discoveredAt,
      discoveredBy,
      presentLocation,
      adderName: user?.name,
      adderEmail: user?.email,
    };

    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You must be logged in to add an artifact.",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `https://historical-artifacts-tracker-server-lovat.vercel.app/artifacts`,
        artifactData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Artifact Added Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setFormData({
          name: "",
          image: "",
          type: "Tools",
          historicalContext: "",
          description: "",
          historicalCreationDate: "",
          discoveredAt: "",
          discoveredBy: "",
          presentLocation: "",
        });
        setValidationErrors({});
        navigate("/my-artifacts");
      }
    } catch (error) {
      console.error("Error adding artifact:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add artifact",
        text: error.response?.data?.error || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) =>
    `input input-bordered w-full bg-rose-400 text-white border-4 border-white ${
      validationErrors[fieldName] ? "input-error" : ""
    }`;

  const getTextareaClass = (fieldName) =>
    `textarea textarea-bordered w-full bg-rose-400 text-white border-4 border-white ${
      validationErrors[fieldName] ? "textarea-error" : ""
    }`;

  const getSelectClass = (fieldName) =>
    `select select-bordered w-full bg-rose-400 text-white border-4 border-white ${
      validationErrors[fieldName] ? "select-error" : ""
    }`;

  const ErrorMessage = ({ message }) =>
    message ? <p className="text-rose-500 text-sm mt-1">{message}</p> : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <title>Add Artifact</title>
      <h2 className="text-3xl font-bold mb-6 text-rose-700 text-center">
        Add New Artifact
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-rose-500 text-white border-8 border-white p-6 rounded-lg shadow-md"
      >
        {/* Artifact Name */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Artifact Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter artifact name"
            className={getInputClass("name")}
            required
          />
          <ErrorMessage message={validationErrors.name} />
        </div>

        {/* Artifact Image URL Here */}
        <div>
          <label htmlFor="image" className="block font-semibold mb-1">
            Artifact Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter valid image URL"
            className={getInputClass("image")}
            required
          />
          <ErrorMessage message={validationErrors.image} />
        </div>

        {/* Artifact Type Dropdown Here */}
        <div>
          <label htmlFor="type" className="block font-semibold mb-1">
            Artifact Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={getSelectClass("type")}
          >
            <option value="Tools">Tools</option>
            <option value="Weapons">Weapons</option>
            <option value="Documents">Documents</option>
            <option value="Writings">Writings</option>
            <option value="Others">Others</option>
          </select>
          <ErrorMessage message={validationErrors.type} />
        </div>

        {/* Historical Context */}
        <div>
          <label
            htmlFor="historicalContext"
            className="block font-semibold mb-1"
          >
            Historical Context
          </label>
          <textarea
            id="historicalContext"
            name="historicalContext"
            value={formData.historicalContext}
            onChange={handleChange}
            rows={3}
            placeholder="Enter historical context"
            className={getTextareaClass("historicalContext")}
            required
          />
          <ErrorMessage message={validationErrors.historicalContext} />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Enter short description"
            className={getTextareaClass("description")}
            required
          />
          <ErrorMessage message={validationErrors.description} />
        </div>

        {/* Historical Creation Date */}
        <div>
          <label
            htmlFor="historicalCreationDate"
            className="block font-semibold mb-1"
          >
            Artifact Creation Date (e.g., "100 BC", "15th Century")
          </label>
          <input
            type="text"
            id="historicalCreationDate"
            name="historicalCreationDate"
            value={formData.historicalCreationDate}
            onChange={handleChange}
            placeholder="Enter creation date/period of the artifact"
            className={getInputClass("historicalCreationDate")}
            required
          />
          <ErrorMessage message={validationErrors.historicalCreationDate} />
        </div>

        {/* Discovered At */}
        <div>
          <label htmlFor="discoveredAt" className="block font-semibold mb-1">
            Discovered At (e.g., "1799", "Early 20th Century")
          </label>
          <input
            type="text"
            id="discoveredAt"
            name="discoveredAt"
            value={formData.discoveredAt}
            onChange={handleChange}
            placeholder="Enter discovery date/period"
            className={getInputClass("discoveredAt")}
            required
          />
          <ErrorMessage message={validationErrors.discoveredAt} />
        </div>

        {/* Discovered By */}
        <div>
          <label htmlFor="discoveredBy" className="block font-semibold mb-1">
            Discovered By
          </label>
          <input
            type="text"
            id="discoveredBy"
            name="discoveredBy"
            value={formData.discoveredBy}
            onChange={handleChange}
            placeholder="Enter discoverer's name"
            className={getInputClass("discoveredBy")}
            required
          />
          <ErrorMessage message={validationErrors.discoveredBy} />
        </div>

        {/* Present Location */}
        <div>
          <label htmlFor="presentLocation" className="block font-semibold mb-1">
            Present Location
          </label>
          <input
            type="text"
            id="presentLocation"
            name="presentLocation"
            value={formData.presentLocation}
            onChange={handleChange}
            placeholder="Enter present location"
            className={getInputClass("presentLocation")}
            required
          />
          <ErrorMessage message={validationErrors.presentLocation} />
        </div>

        {/* Adder Name */}
        <div>
          <label htmlFor="adderName" className="block font-semibold mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="adderName"
            value={user?.name || ""}
            readOnly
            className="input input-bordered w-full bg-rose-400 border-4 border-white cursor-not-allowed"
          />
        </div>

        {/* Adder Email */}
        <div>
          <label htmlFor="adderEmail" className="block font-semibold mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="adderEmail"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-rose-400 border-4 border-white cursor-not-allowed"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary bg-rose-500 border-2 border-white px-10 ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Adding..." : "Add Artifact"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArtifact;
