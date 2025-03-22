import { createBrowserRouter, Navigate } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/verify",
        element: <Verification />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    element: <GuestLayout />,

    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
