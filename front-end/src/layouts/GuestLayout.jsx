import { getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { Toaster } from "sonner";

const GuestLayout = () => {
  const user = useSelector(getAuthUser);
  if (user) return <Navigate to={"/"} replace />;
  return (
    <main className="flex dark:bg-neutral-900  bg-neutral-100 justify-center items-center min-h-screen">
      <Outlet />
      <Toaster />
    </main>
  );
};

export default GuestLayout;
