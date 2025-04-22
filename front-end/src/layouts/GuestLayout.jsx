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
  if (user) return <Navigate to={"/home"} replace />;
  return (
    <main className="">
      <Outlet />
    </main>
  );
};

export default GuestLayout;
