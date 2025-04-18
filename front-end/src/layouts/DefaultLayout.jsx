import Loading from "@/pages/Loading";
import { getAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidbar from "@/components/AppSidbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useColorContext } from "@/hooks/useColorContext";

const DefaultLayout = () => {
  const { isLight, setIsLight } = useColorContext();
  const user = useSelector(getAuthUser);

  if (!user) return <Navigate to={"/login"} replace />;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidbar user={user} />
      <main className="dark:bg-background  bg-white w-full">
        <div className="w-full flex justify-between items-center py-2 px-6">
          <SidebarTrigger />
          <div className="flex items-center space-x-2">
            <Moon />
            <Switch
              className={"dark:bg-red-500"}
              checked={isLight}
              onClick={() => {
                setIsLight(!isLight);
              }}
            />
            <Sun />
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
export default DefaultLayout
