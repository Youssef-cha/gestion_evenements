import axiosClient from "@/axios";
import { getAuthUser } from "@/redux/authSlice";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import echo from "@/echo";

export const ColorState = createContext();

const ColorProvider = ({ children }) => {
  const user = useSelector(getAuthUser);
  const [isLight, setIsLight] = useState(
    localStorage.getItem("app_colors") === "light"
  );
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get("/notifications");
      setNotifications(
        response.data.map((notification) => ({
          id: notification.id,
          type: notification.data.type,
          message: notification.data.message,
          title: notification.data.title,
          sender: notification.data.sender,
          created_at: new Date(notification.created_at).toISOString(),
          start_time: notification.data.start_time,
          location: notification.data.location,
          event_id: notification.data.event_id,
          read_at: notification.read_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user === null) return;
    fetchNotifications();

    // Subscribe to private notification channel
    const channel = echo.private(`App.Models.User.${user.id}`);
    
    // Listen for new notifications
    channel.notification((notification) => {
      console.log("Notification received:", notification);
      setNotifications(prevNotifications => [{
        id: notification.id,
        type: notification.type,
        message: notification.message,
        title: notification.title,
        sender: notification.sender,
        created_at: new Date().toISOString(),
        start_time: notification.start_time,
        location: notification.location,
        event_id: notification.event_id,
        read_at: notification.read_at,
      }, ...prevNotifications]);
    });

    // Cleanup subscription when component unmounts
    return () => {
      channel.stopListening('App.Models.User');
    };
  }, [user]);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("app_colors", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("app_colors", "dark");
    }
  }, [isLight]);

  return (
    <ColorState.Provider
      value={{ isLight, setIsLight, notifications, setNotifications }}
    >
      {children}
    </ColorState.Provider>
  );
};

export default ColorProvider;
