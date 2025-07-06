import React, { useState } from "react";
import { auth } from "../../firebase/firebase.config";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UpdateProfile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [preview, setPreview] = useState(user?.photoURL || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setPhotoURL("");  // Clear text input when uploading file
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("❌ User is not logged in!");
      return;
    }

    if (!name.trim()) {
      toast.error("❌ Name is required!");
      return;
    }

    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile_pics/${user.uid}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              finalPhotoURL = downloadURL;
              resolve();
            }
          );
        });
      }

      await updateProfile(user, {
        displayName: name.trim(),
        photoURL: finalPhotoURL || null,
      });

      toast.success("✅ Profile updated successfully!");
      navigate("/my-profile");
    } catch (err) {
      toast.error(`❌ Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-rose-400 border-8 border-white rounded-xl shadow-xl p-10">
      <title>Update Profile</title>
      <h1 className="text-3xl font-bold text-gray-700 mb-10 text-center">Update Profile</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center gap-5">
          <img
            src={preview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-white border-2 border-white bg-rose-900  cursor-pointer"
            disabled={loading}
          />

          <div className="w-full mt-3">
            <label className="block mb-1 text-white  font-semibold">Only Photo URL Use:</label>
            <input
              type="url"
              placeholder="Or paste image URL"
              value={photoURL}
              onChange={(e) => {
                setPhotoURL(e.target.value);
                setPreview(e.target.value);
                setFile(null);
              }}
              className="w-full px-4 py-2 border text-white  rounded-md text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-white-800 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border text-white  rounded-md focus:ring-2 focus:ring-rose-400"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-profile")}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white  font-medium py-2 px-4 rounded-md border"
            >
              Back to My Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;

