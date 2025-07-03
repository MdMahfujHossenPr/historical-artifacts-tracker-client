import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCH9bTXzJPUdNlH4YVUhT9gXMb7jDkfOxk",
  authDomain: "historical-artifacts-tra-399c3.firebaseapp.com",
  projectId: "historical-artifacts-tra-399c3",
  storageBucket: "historical-artifacts-tra-399c3.firebasestorage.app",
  messagingSenderId: "10837832117",
  appId: "1:10837832117:web:aece38eeee2cbb5435a9fc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default app;
const googleProvider = new GoogleAuthProvider();

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

export { auth, googleProvider, googleSignIn, updateUserProfile };