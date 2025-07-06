// src/routes/AppRoutes.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";

// Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AddArtifact from "../pages/AddArtifact/AddArtifact";
import AllArtifacts from "../pages/AllArtifacts/AllArtifacts";
import MyArtifacts from "../pages/MyArtifacts/MyArtifacts";
import LikedArtifacts from "../pages/LikedArtifacts/LikedArtifacts";
import ArtifactDetails from "../pages/ArtifactDetails/ArtifactDetails";
import UpdateProfile from "../pages/UpdateProfile/UpdateProfile";
import HelpAndSupport from "../pages/HelpAndSupport/HelpAndSupport";
import Feedback from "../pages/Feedback/Feedback";
import MyProfile from "../pages/MyProfile/MyProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add-artifact",
        element: (
          <PrivateRoute>
            <AddArtifact />
          </PrivateRoute>
        ),
      },
      {
        path: "/all-artifacts",
        element: <AllArtifacts />,
      },
      {
        path: "/my-artifacts",
        element: (
          <PrivateRoute>
            <MyArtifacts />
          </PrivateRoute>
        ),
      },
      {
        path: "/artifact/:id",
        element: (
          <PrivateRoute>
            <ArtifactDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/liked-artifacts",
        element: (
          <PrivateRoute>
            <LikedArtifacts />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-profile",
        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/feedback",
        element: <Feedback />,
      },
      {
        path: "/help",
        element: <HelpAndSupport />,
      },
    ],
  },
]);

export default router;
