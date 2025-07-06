import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication context.
 * Simplifies usage of AuthContext in functional components.
 *
 * @returns {Object} The current authentication context value.
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
