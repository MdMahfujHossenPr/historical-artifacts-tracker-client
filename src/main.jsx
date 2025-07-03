import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { LikeProvider} from "./context/LikeContext";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <LikeProvider>
          <RouterProvider router={router} />
        </LikeProvider>
    </AuthProvider>
  </React.StrictMode>
);
