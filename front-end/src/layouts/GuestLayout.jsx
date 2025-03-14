import { Outlet } from "react-router";

const GuestLayout = () => {
  return <main className="flex bg-neutral-100 justify-center items-center min-h-screen">
    <Outlet/>
  </main>;
};

export default GuestLayout;
