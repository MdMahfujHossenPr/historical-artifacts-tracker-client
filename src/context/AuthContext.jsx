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

  const DEFAULT_PROFILE_PIC =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const formatUser = (user) => ({
    uid: user.uid,
    email: user.email,
    name: user.displayName || "User Name",
    profilePicture:
      user.photoURL && user.photoURL !== "" ? user.photoURL : DEFAULT_PROFILE_PIC,
  });

  useEffect(() => {
    const syncUser = () => {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
      else setUser(null);
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
    if (!email || !password) {
      toast.error("❌ Please provide email and password");
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
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

  const signup = async (email, password, name = null, photoURL = null) => {
    if (!email || !password) {
      toast.error("❌ Please provide email and password");
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (name || photoURL) {
        await updateProfile(res.user, {
          ...(name ? { displayName: name } : {}),
          ...(photoURL ? { photoURL } : {}),
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
    if (!auth.currentUser) {
      toast.error("❌ User not logged in");
      return;
    }
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
