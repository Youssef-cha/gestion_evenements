import { createBrowserRouter } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
