import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/update-profile");
  };

  return (
    <div className="bg-rose-100 py-6 px-4 my-10 flex justify-center items-center">
      <title>my-profile</title>
      <div className="max-w-4xl mx-auto p-8 bg-rose-400 border-4 border-white rounded-3xl shadow-xl">
        <div className="flex flex-col items-center gap-10">
          {/* Profile Image with Edit Icon */}
          <div className="relative">
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-44 h-44 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div
              onClick={handleEditProfile}
              className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer transform transition duration-300 hover:scale-110"
            >
              <FaUserEdit className="text-cyan-800 text-xl" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-bold text-white">
              {user?.name || "No Name Found"}
            </h2>
            <p className="text-lg text-white font-medium">
              {user?.email || "No Email Found"}
            </p>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full shadow-md transform transition hover:scale-105"
              >
                <FaSignOutAlt /> Logout
              </button>
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 bg-black hover:bg-black text-white px-5 py-2.5 rounded-full shadow-md transform transition hover:scale-105"
              >
                <FaUserEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
