import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <div>
      DefaultLayout
      <Outlet />
    </div>
  );
};
export default DefaultLayout;
