import { getAuthErrors, getAuthUser, getFormLoading } from "@/redux/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

const GuestLayout = () => {
  const user = useSelector(getAuthUser);
  const formLoading = useSelector(getFormLoading);
  const errors = useSelector(getAuthErrors);

  useEffect(() => {
    if (!formLoading && errors) {
      Object.keys(errors).forEach((key) => {
        toast.error(errors[key][0]);
      });
    }
  }, [errors, formLoading]);
  if (user) return <Navigate to={"/"} replace />;
  return (
    <main className="flex dark:bg-neutral-900  bg-neutral-100 justify-center items-center min-h-screen">
      <Outlet />
    </main>
  );
};

export default GuestLayout;
