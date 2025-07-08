import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    photoURL: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ password: "", form: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Must include at least one uppercase letter";
    return "";
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendUserToBackend = async (user, method, password = "") => {
    try {
      const res = await fetch(
        "https://historical-artifacts-tracker-server-lovat.vercel.app/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName || formData.name,
            email: user.email,
            photoURL:
              user.photoURL ||
              formData.photoURL ||
              "https://i.ibb.co/2kRZ1Z5/default-avatar.png",
            password: method === "manual" ? password : undefined,
            method,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        // ✅ যদি user আগে থেকেই থাকে
        if (data.message === "User already exists") {
          console.warn("ℹ️ User already exists. Proceeding...");
          return;
        }
        throw new Error(data.message || "Backend error");
      }
    } catch (err) {
      console.error("Backend error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ password: "", form: "" });

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setErrors((prev) => ({ ...prev, password: pwdError }));
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.photoURL
      );
      const user = userCredential.user || {};

      await sendUserToBackend(user, "manual", formData.password);

      Swal.fire({
        icon: "success",
        title: "Account Created Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      const user = result.user || {};

      await sendUserToBackend(user, "google");

      Swal.fire({
        icon: "success",
        title: "Google Signup Successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
      Swal.fire({
        icon: "error",
        title: "Google Signup Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-100 px-4">
      <title>Register</title>
      <div className="bg-rose-500 p-8 rounded-lg shadow-lg w-full max-w-sm border-8 border-white">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h2>

        {errors.form && (
          <div className="text-rose-200 text-sm mb-4 bg-rose-700 p-2 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-rose-400 border-4 border-white text-white placeholder-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-600"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="photoURL" className="block font-semibold mb-1">
              Photo URL (optional)
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="text"
              value={formData.photoURL}
              onChange={handleChange}
              className="input input-bordered w-full bg-rose-400 border-4 border-white text-white placeholder-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-600"
              placeholder="Enter photo URL"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-rose-400 border-4 border-white text-white placeholder-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`input input-bordered w-full bg-rose-400 border-4 rounded text-white placeholder-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-600 ${
                errors.password ? "border-rose-600" : "border-white"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-rose-200 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary bg-rose-500 border-2 border-white w-full px-10 ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-3 text-white">
          <hr className="w-1/3 border-white" />
          <span className="font-semibold">OR</span>
          <hr className="w-1/3 border-white" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 flex items-center justify-center space-x-2 w-full border border-white text-white py-2 rounded-md hover:bg-rose-600 hover:border-rose-600 transition"
        >
          <FaGoogle />
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
