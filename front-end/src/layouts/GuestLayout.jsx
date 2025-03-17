import Loading from "@/pages/Loading";
import { getAuthLoader, getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const GuestLayout = () => {
  const user = useSelector(getAuthUser);
  const loading = useSelector(getAuthLoader);
  if (loading) {
    return <Loading />;
  }
  return (
    <main className="flex bg-neutral-100 justify-center items-center min-h-screen">
      {!user ? <Outlet /> : <Navigate to={"/home"} replace />}
    </main>
  );
};

export default GuestLayout;
