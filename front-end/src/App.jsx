import React, { useEffect, useState } from "react";
import router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router";
import {
  getAuthLoader,
  getCurrentToken,
  getUser,
  setLoader,
} from "./redux/authSlice";
import Loading from "./pages/Loading";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// websocket for live notifications
window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: "http://localhost:8000/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer YOUR_SANCTUM_TOKEN_HERE`, // 👈 Important
    },
  },
});

const App = () => {
  const token = useSelector(getCurrentToken);
  const dispatch = useDispatch();
  const loading = useSelector(getAuthLoader);
  useEffect(() => {
    if (token) {
      // websocket for live notifications
      window.Pusher = Pusher;
      window.Echo = new Echo({
        broadcaster: "reverb",
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT,
        wssPort: import.meta.env.VITE_REVERB_PORT,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
        enabledTransports: ["ws", "wss"],
        authEndpoint: "http://localhost:8000/broadcasting/auth",
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      localStorage.setItem("access_token", token);
      dispatch(getUser());
    } else {
      dispatch(setLoader(false));
    }
  }, [token, dispatch]);
  if (loading) return <Loading />;
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default App;
