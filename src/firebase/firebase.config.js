// Import necessary Firebase functions and modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH9bTXzJPUdNlH4YVUhT9gXMb7jDkfOxk",
  authDomain: "historical-artifacts-tra-399c3.firebaseapp.com",
  projectId: "historical-artifacts-tra-399c3",
  storageBucket: "historical-artifacts-tra-399c3.firebasestorage.app",
  messagingSenderId: "10837832117",
  appId: "1:10837832117:web:aece38eeee2cbb5435a9fc",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export Firebase app instance
export default app;

// Create Google Auth provider instance
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in the user using Google popup authentication
 */
const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User signed in: ", user);
  } catch (error) {
    console.error("Error signing in with Google: ", error.message);
    alert("Google sign-in failed, please try again.");
  }
};

/**
 * Update the current user's profile
 * @param {Object} profile - Object containing the updated profile information (e.g., { displayName, photoURL })
 */
const updateUserProfile = async (profile) => {
  if (auth.currentUser) {
    try {
      await firebaseUpdateProfile(auth.currentUser, profile);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  } else {
    console.error("No user is logged in");
  }
};

// Export authentication utilities
export { auth, googleProvider, googleSignIn, updateUserProfile };
