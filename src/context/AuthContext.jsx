import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const DEFAULT_PROFILE_PIC = "https://i.ibb.co/2kRZ1Z5/default-avatar.png";

  const formatUser = (user) => ({
    uid: user.uid,
    email: user.email,
    name: user.displayName || user.providerData?.[0]?.displayName || "User",
    profilePicture:
      user.photoURL || user.providerData?.[0]?.photoURL || DEFAULT_PROFILE_PIC,
  });

  useEffect(() => {
    const syncUser = () => {
      const localUser = localStorage.getItem("user");
      setUser(localUser ? JSON.parse(localUser) : null);
    };

    window.addEventListener("storage", syncUser);

    const localUser = localStorage.getItem("user");
    if (localUser) setUser(JSON.parse(localUser));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const formatted = formatUser(currentUser);
        setUser(formatted);
        localStorage.setItem("user", JSON.stringify(formatted));
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedIn", "false");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await res.user.reload();
      const formatted = formatUser(res.user);
      setUser(formatted);
      localStorage.setItem("user", JSON.stringify(formatted));
      localStorage.setItem("isLoggedIn", "true");
      toast.success("✅ Logged in successfully!");
      return res;
    } catch (err) {
      toast.error(`❌ Login failed: ${err.message}`);
      throw err;
    }
  };

  const signup = async (email, password, name, photoURL) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (name || photoURL) {
        await updateProfile(res.user, {
          displayName: name,
          photoURL: photoURL || DEFAULT_PROFILE_PIC,
        });
        await res.user.reload();
      }

      const formatted = formatUser(res.user);
      setUser(formatted);
      localStorage.setItem("user", JSON.stringify(formatted));
      localStorage.setItem("isLoggedIn", "true");
      toast.success("🎉 Account created successfully!");
      return res;
    } catch (err) {
      toast.error(`❌ Signup failed: ${err.message}`);
      throw err;
    }
  };

  const googleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await res.user.reload(); // 🔄
      const formatted = formatUser(res.user);
      setUser(formatted);
      localStorage.setItem("user", JSON.stringify(formatted));
      localStorage.setItem("isLoggedIn", "true");
      toast.success("🎉 Logged in with Google!");
      return res;
    } catch (err) {
      toast.error(`❌ Google login failed: ${err.message}`);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
      toast.info("👋 Logged out!");
    } catch (err) {
      toast.error("❌ Logout failed!");
      throw err;
    }
  };

  const updateUserProfile = async ({ name, photoURL }) => {
    try {
      await updateProfile(auth.currentUser, {
        ...(name ? { displayName: name } : {}),
        ...(photoURL ? { photoURL } : {}),
      });
      await auth.currentUser.reload();
      const formatted = formatUser(auth.currentUser);
      setUser(formatted);
      localStorage.setItem("user", JSON.stringify(formatted));
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      toast.error(`❌ Profile update failed: ${error.message}`);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        googleLogin,
        updateUserProfile,
        getToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
