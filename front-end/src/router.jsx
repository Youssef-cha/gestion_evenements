import { createBrowserRouter, Navigate } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Calendar from "./pages/Calendar";
import ForgotPassword from "./pages/ForgotPassword";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";
import Teams from "./pages/Teams";
import Notifications from "./pages/Notifications";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,

    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/verify",
        element: <Verification />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/teams-members",
        element: <Teams />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    element: <GuestLayout />,

    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
