import Loading from "@/pages/Loading";
import { getAuthLoader, getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router";

const DefaultLayout = () => {
  const user = useSelector(getAuthUser);
  const loading = useSelector(getAuthLoader);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <header>
        <div className="container px-6">
          <Link>Logo</Link>
        </div>
      </header>
      <main className="flex bg-neutral-100 justify-center items-center ">
        {user ? <Outlet /> : <Navigate to={"/login"} replace />}
      </main>
    </>
  );
};
export default DefaultLayout;
