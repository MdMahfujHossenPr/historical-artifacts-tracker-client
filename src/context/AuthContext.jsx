import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
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

// Create and export the Auth Context
export const AuthContext = createContext();

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app with authentication logic
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores authenticated user
  const [loading, setLoading] = useState(true); // Tracks loading state

  // Format Firebase user object to custom shape
  const formatUser = (user) => ({
    uid: user.uid,
    email: user.email,
    name: user.displayName || "User Name",
    profilePicture:
      user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  // Sync auth state and localStorage
  useEffect(() => {
    const syncUser = () => {
      const localUser = localStorage.getItem("user");
      setUser(localUser ? JSON.parse(localUser) : null);
    };

    // Load user from localStorage on mount
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    // Listen for changes in auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const formatted = formatUser(currentUser);
        setUser(formatted);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(formatted));
      } else {
        setUser(null);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    // Listen to localStorage changes (for multi-tab sync)
    window.addEventListener("storage", syncUser);

    // Cleanup listeners on unmount
    return () => {
      unsubscribe();
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Get Firebase ID token of the current user
  const getToken = async () => {
    const currentUser = auth.currentUser;
    return currentUser ? await currentUser.getIdToken() : null;
  };

  // Log in using email and password
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

  // Sign up new user with email and password, and optionally set profile
  const signup = async (email, password, name = null, photoURL = null) => {
    if (!email || !password) {
      toast.error("❌ Please provide email and password");
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (name || photoURL) {
        await updateProfile(res.user, {
          displayName: name || "",
          photoURL: photoURL || "",
        });
        await auth.currentUser.reload();
      }

      const formatted = formatUser(auth.currentUser);
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

  // Sign in with Google popup
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

  // Log out the current user
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
      toast.info("👋 Logged out!");
    } catch (err) {
      toast.error("❌ Logout failed!");
    }
  };

  // Update the current user's profile info (name and photo)
  const updateUserProfile = async ({ name, photoURL }) => {
    if (!auth.currentUser) {
      toast.error("❌ User not logged in");
      return;
    }
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
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

  // Provide auth-related data and methods to the app
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
